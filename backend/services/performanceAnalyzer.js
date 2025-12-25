const ContestSubmission = require('../models/ContestSubmission');
const UserAnalytics = require('../models/UserAnalytics');
const axios = require('axios');

const TOPICS = [
  'DP',
  'Graphs',
  'Greedy',
  'Math',
  'Strings',
  'DataStructures',
  'BinarySearch',
  'Misc'
];

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5002';

/**
 * Call ML service via HTTP
 * @param {string} endpoint - ML service endpoint
 * @param {object} data - Input data
 * @returns {Promise<object>} - ML service result
 */
async function callMLService(endpoint, data = {}) {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/${endpoint}`, data, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`ML service call failed for ${endpoint}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Calculate advanced performance metrics
 * @param {Array} submissions - User submissions
 * @returns {object} - Advanced metrics
 */
function calculateAdvancedMetrics(submissions) {
  if (submissions.length === 0) return {};

  // Sort submissions by time
  const sortedSubs = submissions.sort((a, b) => new Date(a.submissionTime) - new Date(b.submissionTime));

  // Calculate consistency score (based on submission frequency)
  const submissionDates = sortedSubs.map(s => new Date(s.submissionTime).toDateString());
  const uniqueDays = new Set(submissionDates).size;
  const totalDays = Math.ceil((new Date() - new Date(sortedSubs[0].submissionTime)) / (1000 * 60 * 60 * 24));
  const consistencyScore = totalDays > 0 ? Math.min(1, uniqueDays / Math.max(1, totalDays / 7)) : 0;

  // Calculate improvement rate (solving rate over time)
  const firstHalf = sortedSubs.slice(0, Math.floor(sortedSubs.length / 2));
  const secondHalf = sortedSubs.slice(Math.floor(sortedSubs.length / 2));

  const firstHalfSolved = firstHalf.filter(s => s.verdict === 'ACCEPTED').length;
  const secondHalfSolved = secondHalf.filter(s => s.verdict === 'ACCEPTED').length;

  const firstHalfRate = firstHalf.length > 0 ? firstHalfSolved / firstHalf.length : 0;
  const secondHalfRate = secondHalf.length > 0 ? secondHalfSolved / secondHalf.length : 0;
  const improvementRate = secondHalfRate - firstHalfRate;

  // Calculate recent performance (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentSubs = sortedSubs.filter(s => new Date(s.submissionTime) > thirtyDaysAgo);
  const recentSolved = recentSubs.filter(s => s.verdict === 'ACCEPTED').length;
  const recentRate = recentSubs.length > 0 ? recentSolved / recentSubs.length : 0;

  return {
    consistencyScore,
    improvementRate,
    recentPerformanceRate: recentRate,
    totalActiveDays: uniqueDays,
    averageSubmissionsPerDay: submissions.length / Math.max(1, totalDays)
  };
}

/**
 * Get ML-powered insights for user performance
 * @param {Array} submissions - User submissions
 * @param {object} basicAnalytics - Basic analytics data
 * @returns {Promise<object>} - ML insights
 */
async function getMLInsights(submissions, basicAnalytics) {
  try {
    // Prepare data for ML analysis
    const mlData = {
      submissions: submissions.map(s => ({
        problemId: s.problemId,
        contestId: s.contestId,
        platform: s.platform,
        verdict: s.verdict,
        topic: s.inferredTopic || 'Misc',
        submissionTime: s.submissionTime
      })),
      currentRating: basicAnalytics.currentRating || 1200,
      topics: basicAnalytics.topics || []
    };

    // Get ML predictions
    const mlResults = await Promise.all([
      callMLService('predict_rating', mlData),
      callMLService('analyze_weaknesses', mlData),
      callMLService('predict_improvement', mlData)
    ]);

    const [ratingPrediction, weaknessAnalysis, improvementPrediction] = mlResults;

    // Process ML insights
    const mlInsights = {
      predictedRating: ratingPrediction.success ? ratingPrediction.predictedRating : basicAnalytics.currentRating,
      expectedRatingChange: ratingPrediction.success ? ratingPrediction.expectedChange : 0,
      confidence: ratingPrediction.success ? ratingPrediction.confidence : 0,
      topWeakTopics: weaknessAnalysis.success ? weaknessAnalysis.weakTopics : [],
      recommendations: weaknessAnalysis.success ? weaknessAnalysis.recommendations : [],
      improvementTrajectory: improvementPrediction.success ? improvementPrediction.trajectory : 'stable'
    };

    return mlInsights;

  } catch (error) {
    console.error('Failed to get ML insights:', error);
    return {
      predictedRating: basicAnalytics.currentRating,
      expectedRatingChange: 0,
      confidence: 0,
      topWeakTopics: [],
      recommendations: [],
      improvementTrajectory: 'unknown'
    };
  }
}

/**
 * ENHANCED USER PERFORMANCE ANALYSIS WITH ML INSIGHTS
 * @param {string} userId - User ID
 * @returns {Promise<object>} - Comprehensive analytics
 */
async function analyzeUserPerformance(userId) {
  try {
    console.log(`Analyzing performance for user ${userId}`);

    // Get comprehensive submission data
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const submissions = await ContestSubmission.find({
      user: userId,
      submissionTime: { $gte: ninetyDaysAgo }
    }).sort({ submissionTime: -1 });

    if (submissions.length === 0) {
      throw new Error('No contest submissions found in the last 90 days');
    }

    // Basic analytics calculation
    const contests = new Set();
    const topicStats = {};
    TOPICS.forEach(t => {
      topicStats[t] = {
        attempted: 0,
        solved: 0,
        wrong: 0,
        failureRate: 0,
        successRate: 0
      };
    });

    submissions.forEach(s => {
      contests.add(`${s.platform}_${s.contestId}`);
      const topic = s.inferredTopic || 'Misc';
      if (topicStats[topic]) {
        topicStats[topic].attempted++;
        if (s.verdict === 'ACCEPTED') {
          topicStats[topic].solved++;
        } else {
          topicStats[topic].wrong++;
        }
      }
    });

    // Calculate rates for each topic
    TOPICS.forEach(topic => {
      const stats = topicStats[topic];
      stats.failureRate = stats.attempted > 0 ? stats.wrong / stats.attempted : 0;
      stats.successRate = stats.attempted > 0 ? stats.solved / stats.attempted : 0;
    });

    const totalProblemsAttempted = submissions.length;
    const totalProblemsSolved = submissions.filter(s => s.verdict === 'ACCEPTED').length;
    const totalContestsAnalyzed = contests.size;

    // Calculate advanced metrics
    const advancedMetrics = calculateAdvancedMetrics(submissions);

    // Prepare basic analytics object
    const basicAnalytics = {
      totalProblemsAttempted,
      totalProblemsSolved,
      totalContestsAnalyzed,
      currentRating: 1200, // Default, will be updated from platforms
      topics: TOPICS.map(t => ({
        topic: t,
        attempted: topicStats[t].attempted,
        solved: topicStats[t].solved,
        wrong: topicStats[t].wrong,
        failureRate: topicStats[t].failureRate,
        successRate: topicStats[t].successRate
      })),
      advancedMetrics
    };

    // Get ML insights
    console.log('Getting ML insights...');
    const mlInsights = await getMLInsights(submissions, basicAnalytics);

    // Calculate performance score
    const performanceScore = Math.min(100, Math.round(
      (totalProblemsSolved / totalProblemsAttempted) * 40 + // 40% weight for acceptance rate
      (advancedMetrics.consistencyScore * 20) + // 20% weight for consistency
      (advancedMetrics.recentPerformanceRate * 20) + // 20% weight for recent performance
      (mlInsights.confidence * 20) // 20% weight for ML confidence
    ));

    // Generate insights
    const insights = {
      overallAssessment: generateOverallAssessment(performanceScore, advancedMetrics, mlInsights),
      strengths: generateStrengths(basicAnalytics, advancedMetrics),
      weaknesses: generateWeaknesses(basicAnalytics, mlInsights),
      recommendations: generateRecommendations(basicAnalytics, mlInsights, advancedMetrics)
    };

    // Update analytics with ML insights
    const analytics = await UserAnalytics.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        totalContestsAnalyzed,
        totalProblemsAttempted,
        totalProblemsSolved,
        topics: basicAnalytics.topics,
        advancedMetrics,
        mlInsights,
        performanceScore,
        insights,
        analyzedAt: new Date(),
        lastAnalysisDate: new Date()
      },
      { upsert: true, new: true }
    );

    console.log(`Performance analysis completed for user ${userId}`);
    return {
      ...analytics.toObject(),
      mlInsights,
      advancedMetrics,
      performanceScore,
      insights,
      analyzedAt: new Date()
    };

  } catch (error) {
    console.error('Performance analysis failed:', error);
    throw error;
  }
}

/**
 * Generate overall assessment
 */
function generateOverallAssessment(score, metrics, mlInsights) {
  if (score >= 80) return "Excellent performance! You're consistently solving problems and showing strong improvement.";
  if (score >= 60) return "Good performance with room for improvement. Focus on weak areas to boost your rating.";
  if (score >= 40) return "Moderate performance. Consider increasing practice frequency and targeting weak topics.";
  return "Performance needs improvement. Focus on fundamentals and consistent practice.";
}

/**
 * Generate strengths analysis
 */
function generateStrengths(analytics, metrics) {
  const strengths = [];

  if (analytics.totalProblemsSolved / analytics.totalProblemsAttempted > 0.6) {
    strengths.push("Strong problem-solving skills with high acceptance rate");
  }

  if (metrics.consistencyScore > 0.7) {
    strengths.push("Consistent practice routine");
  }

  if (metrics.recentPerformanceRate > 0.5) {
    strengths.push("Recent performance trending upward");
  }

  const strongTopics = analytics.topics.filter(t => t.successRate > 0.7 && t.attempted > 5);
  if (strongTopics.length > 0) {
    strengths.push(`Strong in: ${strongTopics.map(t => t.topic).join(', ')}`);
  }

  return strengths.length > 0 ? strengths : ["Keep building on your current skills"];
}

/**
 * Generate weaknesses analysis
 */
function generateWeaknesses(analytics, mlInsights) {
  const weaknesses = [];

  if (analytics.totalProblemsSolved / analytics.totalProblemsAttempted < 0.4) {
    weaknesses.push("Low acceptance rate indicates need for better problem-solving approach");
  }

  if (mlInsights.topWeakTopics && mlInsights.topWeakTopics.length > 0) {
    weaknesses.push(`Weak in: ${mlInsights.topWeakTopics.slice(0, 3).join(', ')}`);
  }

  const weakTopics = analytics.topics.filter(t => t.failureRate > 0.6 && t.attempted > 3);
  if (weakTopics.length > 0) {
    weaknesses.push(`High failure rate in: ${weakTopics.map(t => t.topic).join(', ')}`);
  }

  return weaknesses.length > 0 ? weaknesses : ["Continue practicing to identify specific weak areas"];
}

/**
 * Generate recommendations
 */
function generateRecommendations(analytics, mlInsights, metrics) {
  const recommendations = [];

  if (mlInsights.recommendations && mlInsights.recommendations.length > 0) {
    recommendations.push(...mlInsights.recommendations.slice(0, 3));
  }

  if (metrics.consistencyScore < 0.5) {
    recommendations.push("Increase practice frequency for better consistency");
  }

  const weakTopics = analytics.topics.filter(t => t.failureRate > 0.5).sort((a, b) => b.failureRate - a.failureRate);
  if (weakTopics.length > 0) {
    recommendations.push(`Focus more practice on ${weakTopics[0].topic} problems`);
  }

  if (analytics.totalProblemsAttempted < 50) {
    recommendations.push("Increase overall problem-solving volume");
  }

  return recommendations.length > 0 ? recommendations : ["Continue regular practice and track progress"];
}

/**
 * Get performance trends over time
 * @param {string} userId - User ID
 * @param {number} days - Number of days to analyze
 * @returns {Promise<Array>} - Performance trends
 */
async function getPerformanceTrends(userId, days = 30) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const submissions = await ContestSubmission.find({
      user: userId,
      submissionTime: { $gte: startDate }
    }).sort({ submissionTime: 1 });

    // Group by week
    const weeklyStats = {};
    submissions.forEach(sub => {
      const weekKey = getWeekKey(sub.submissionTime);
      if (!weeklyStats[weekKey]) {
        weeklyStats[weekKey] = { attempted: 0, solved: 0, date: sub.submissionTime };
      }
      weeklyStats[weekKey].attempted++;
      if (sub.verdict === 'ACCEPTED') {
        weeklyStats[weekKey].solved++;
      }
    });

    return Object.values(weeklyStats).map(stat => ({
      date: stat.date,
      attempted: stat.attempted,
      solved: stat.solved,
      successRate: stat.attempted > 0 ? stat.solved / stat.attempted : 0
    }));

  } catch (error) {
    console.error('Failed to get performance trends:', error);
    return [];
  }
}

/**
 * Get week key for grouping
 * @param {Date} date - Date object
 * @returns {string} - Week key
 */
function getWeekKey(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const week = Math.ceil((d - new Date(year, 0, 1)) / (7 * 24 * 60 * 60 * 1000));
  return `${year}-W${week}`;
}

module.exports = {
  analyzeUserPerformance,
  getPerformanceTrends,
  calculateAdvancedMetrics,
  getMLInsights
};
