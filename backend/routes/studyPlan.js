const express = require('express');
const router = express.Router();

const ContestSubmission = require('../models/ContestSubmission');
const UserAnalytics = require('../models/UserAnalytics');
const StudyPlan = require('../models/StudyPlan');
const Platform = require('../models/Platform');
const performanceAnalyzer = require('../services/performanceAnalyzer');
const { generateStudyPlanWithGemini } = require('../services/geminiClient');
const { hybridClassifyTopic } = require('../services/topicClassifier');
const authenticateToken = require('../middleware/auth');

/**
 * GENERATE STUDY PLAN WITH ENHANCED ML ANALYSIS
 */
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { duration_days = 7, target_rating = null, focus_topics = [] } = req.body;

    console.log(`Generating study plan for user ${userId}, duration: ${duration_days} days`);

    // ------------------------- ENHANCED DATA INGESTION -------------------------
    // Get comprehensive submission data with ML classification
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const rawSubmissions = await ContestSubmission.find({
      user: userId,
      submissionTime: { $gte: ninetyDaysAgo }
    })
      .sort({ submissionTime: -1 })
      .limit(1000);

    // Enhance submissions with ML topic classification if needed
    const submissions = await Promise.all(
      rawSubmissions.map(async (sub) => {
        if (!sub.inferredTopic || sub.inferredTopic === 'Misc') {
          try {
            const problemData = {
              title: sub.problemName || '',
              description: sub.problemDescription || '',
              tags: sub.tags || [],
              platform: sub.platform,
              contestId: sub.contestId,
              problemId: sub.problemId
            };

            const mlTopic = await hybridClassifyTopic(problemData);
            sub.inferredTopic = mlTopic;
            await sub.save(); // Update the database
          } catch (error) {
            console.warn(`Failed to classify topic for submission ${sub._id}:`, error.message);
          }
        }
        return sub;
      })
    );

    // ------------------------- ADVANCED USER ANALYTICS -------------------------
    // Get current platform ratings
    const platforms = await Platform.find({ user: userId });
    const platformRatings = platforms.map(p => ({
      platform: p.platform,
      rating: p.rating,
      maxRating: p.maxRating,
      rank: p.rank
    })).filter(p => p.rating != null);

    const currentRating = platformRatings.length > 0 ?
      Math.max(...platformRatings.map(p => p.rating)) : 1200;

    // Calculate comprehensive analytics
    const analytics = await performanceAnalyzer.analyzeUserPerformance(userId);

    // ------------------------- ML-POWERED WEAKNESS ANALYSIS -------------------------
    // Get ML insights for weakness analysis
    const mlInsights = analytics.mlInsights || {};
    const topWeakTopics = mlInsights.topWeakTopics || [];

    // Calculate focus areas with ML-enhanced scoring
    const topicStats = analytics.topics || [];
    const focusAreas = topicStats.map(topic => {
      const weaknessScore = topic.failureRate * 0.6 + (1 - (topic.attempted / Math.max(...topicStats.map(t => t.attempted), 1))) * 0.4;
      const isTopWeak = topWeakTopics.includes(topic.topic);

      return {
        topic: topic.topic,
        weaknessScore: Math.min(1, weaknessScore + (isTopWeak ? 0.2 : 0)),
        failureRate: topic.failureRate,
        exposure: topic.attempted,
        solved: topic.solved,
        allocatedQuestions: Math.max(0, Math.round(weaknessScore * 60))
      };
    }).sort((a, b) => b.weaknessScore - a.weaknessScore);

    // ------------------------- GEMINI PLAN GENERATION WITH ML CONTEXT -------------------------
    const geminiContext = {
      durationDays: duration_days,
      focusAreas: focusAreas.slice(0, 5), // Top 5 weak areas
      topWeakTopics: topWeakTopics.slice(0, 3),
      currentRating,
      targetRating: target_rating || Math.max(currentRating + 100, currentRating * 1.1),
      platformRatings,
      mlInsights: {
        predictedRating: mlInsights.predictedRating || currentRating,
        expectedRatingChange: mlInsights.expectedRatingChange || 0,
        confidence: mlInsights.confidence || 0
      },
      totals: {
        totalProblemsAttempted: analytics.totalProblemsAttempted || 0,
        totalProblemsSolved: analytics.totalProblemsSolved || 0,
        totalContestsAnalyzed: analytics.totalContestsAnalyzed || 0
      },
      advancedMetrics: analytics.advancedMetrics || {},
      recentPerformance: {
        last30Days: submissions.filter(s =>
          new Date(s.submissionTime) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length,
        improvementRate: analytics.advancedMetrics?.improvementRate || 0,
        consistencyScore: analytics.advancedMetrics?.consistencyScore || 0
      }
    };

    console.log('Generating study plan with Gemini using enhanced context...');
    const geminiPlan = await generateStudyPlanWithGemini(geminiContext);

    // ------------------------- SAVE ENHANCED PLAN -------------------------
    // Deactivate old plans
    await StudyPlan.updateMany(
      { user: userId, status: 'active' },
      { $set: { status: 'paused' } }
    );

    // Create new plan with ML-enhanced data
    const studyPlan = new StudyPlan({
      user: userId,
      status: 'active',
      startDate: new Date(geminiPlan.startDate),
      endDate: new Date(Date.now() + duration_days * 86400000),
      totalDays: geminiPlan.totalDays,

      dailyPlans: geminiPlan.dailyPlans.map(d => ({
        day: d.day,
        focus: d.focus,
        topics: d.topics.map(t => ({
          topic: t.topic,
          questionCount: t.questionCount
        })),
        totalQuestions: d.totalQuestions,
        estimatedDuration: d.estimatedDuration
      })),

      generationParams: {
        userRating: currentRating,
        targetRating: geminiContext.targetRating,
        contestsAnalyzed: analytics.totalContestsAnalyzed,
        topWeakTopics: geminiContext.topWeakTopics,
        focusAreas: geminiContext.focusAreas,
        mlInsights: geminiContext.mlInsights,
        platformRatings
      },

      llmExplanation: {
        summary: geminiPlan.llmExplanation.summary,
        overallStrategy: geminiPlan.llmExplanation.overallStrategy,
        topicBreakdown: Array.isArray(geminiPlan.llmExplanation.topicBreakdown)
          ? geminiPlan.llmExplanation.topicBreakdown
          : [],
        generatedAt: new Date()
      },

      progressTracking: {
        currentDay: 1,
        daysCompleted: 0,
        lastActivityDate: new Date()
      },

      // Add ML-powered metadata
      mlMetadata: {
        predictedRating: mlInsights.predictedRating,
        expectedRatingChange: mlInsights.expectedRatingChange,
        confidence: mlInsights.confidence,
        recommendations: mlInsights.recommendations || []
      }
    });

    await studyPlan.save();

    console.log(`Study plan generated successfully for user ${userId}`);

    return res.json({
      success: true,
      studyPlan: {
        ...studyPlan.toObject(),
        analytics: {
          currentRating,
          platformRatings,
          focusAreas: geminiContext.focusAreas,
          mlInsights: geminiContext.mlInsights
        }
      }
    });

  } catch (err) {
    console.error('STUDY PLAN GENERATION FAILED:', err.response?.data || err.message);
    return res.status(500).json({
      error: 'Study plan generation failed',
      details: err.response?.data || err.message
    });
  }
});

/**
 * GET CURRENT ACTIVE PLAN WITH ML INSIGHTS
 */
router.get('/current', authenticateToken, async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findOne({
      user: req.user.id,
      status: 'active'
    }).sort({ createdAt: -1 });

    if (!studyPlan) {
      return res.json({
        success: true,
        hasActivePlan: false
      });
    }

    // Get latest analytics for ML insights
    const analytics = await UserAnalytics.findOne({ user: req.user.id }).sort({ lastAnalysisDate: -1 });

    res.json({
      success: true,
      hasActivePlan: true,
      studyPlan: {
        ...studyPlan.toObject(),
        mlInsights: analytics?.mlInsights || {},
        currentAnalytics: analytics?.advancedMetrics || {}
      }
    });
  } catch (err) {
    console.error('Error fetching current plan:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch study plan' });
  }
});

/**
 * UPDATE PROGRESS WITH ML-BASED ADJUSTMENTS
 */
router.put('/progress', authenticateToken, async (req, res) => {
  try {
    const { day, completedTopics = [] } = req.body;

    const studyPlan = await StudyPlan.findOne({
      user: req.user.id,
      status: 'active'
    });

    if (!studyPlan) {
      return res.status(404).json({ error: 'No active plan' });
    }

    studyPlan.progressTracking.lastActivityDate = new Date();
    if (day > studyPlan.progressTracking.currentDay) {
      studyPlan.progressTracking.currentDay = day;
      studyPlan.progressTracking.daysCompleted = day;
    }

    // Update completed topics
    if (completedTopics.length > 0) {
      studyPlan.progressTracking.completedTopics = [
        ...(studyPlan.progressTracking.completedTopics || []),
        ...completedTopics
      ];
    }

    await studyPlan.save();

    // Trigger ML analysis update if significant progress
    if (day % 3 === 0) { // Every 3 days
      try {
        await performanceAnalyzer.analyzeUserPerformance(req.user.id);
      } catch (error) {
        console.warn('Failed to update ML analysis on progress:', error.message);
      }
    }

    res.json({
      success: true,
      studyPlan,
      message: 'Progress updated successfully'
    });

  } catch (err) {
    console.error('Progress update failed:', err);
    res.status(500).json({ success: false, error: 'Failed to update progress' });
  }
});

/**
 * GET STUDY PLAN ANALYTICS
 */
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get current plan
    const currentPlan = await StudyPlan.findOne({
      user: userId,
      status: 'active'
    });

    // Get user analytics
    const analytics = await UserAnalytics.findOne({ user: userId }).sort({ lastAnalysisDate: -1 });

    // Calculate plan effectiveness
    const planEffectiveness = currentPlan ? {
      daysCompleted: currentPlan.progressTracking.daysCompleted,
      totalDays: currentPlan.totalDays,
      completionRate: currentPlan.progressTracking.daysCompleted / currentPlan.totalDays,
      topicsCovered: currentPlan.progressTracking.completedTopics?.length || 0,
      totalTopics: currentPlan.dailyPlans.reduce((sum, day) => sum + day.topics.length, 0)
    } : null;

    res.json({
      success: true,
      analytics: {
        currentPlan: planEffectiveness,
        userAnalytics: analytics,
        mlInsights: analytics?.mlInsights || {},
        recommendations: analytics?.mlInsights?.recommendations || []
      }
    });

  } catch (err) {
    console.error('Analytics fetch failed:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch analytics' });
  }
});

router.get('/history', authenticateToken, async (req, res) => {
  const plans = await StudyPlan.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .limit(10);

  res.json({ success: true, studyPlans: plans });
});

/**
 * DELETE PLAN
 */
router.delete('/:planId', authenticateToken, async (req, res) => {
  const deleted = await StudyPlan.findOneAndDelete({
    _id: req.params.planId,
    user: req.user.id
  });

  if (!deleted) {
    return res.status(404).json({ error: 'Plan not found' });
  }

  res.json({ success: true });
});

module.exports = router;
