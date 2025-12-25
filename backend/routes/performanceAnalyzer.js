const express = require('express');
const router = express.Router();
const performanceAnalyzer = require('../services/performanceAnalyzer');
const authenticateToken = require('../middleware/auth');

/**
 * GET USER PERFORMANCE ANALYSIS
 */
router.get('/analyze', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const analysis = await performanceAnalyzer.analyzeUserPerformance(userId);

    // Format response for frontend compatibility
    const formattedAnalysis = {
      performanceScore: analysis.performanceScore || 0,
      insights: analysis.insights || {},
      aggregatedMetrics: {
        totalSolved: analysis.totalProblemsSolved || 0,
        acceptanceRate: analysis.totalProblemsAttempted > 0 ?
          Math.round((analysis.totalProblemsSolved / analysis.totalProblemsAttempted) * 100) : 0,
        averageRating: analysis.mlInsights?.predictedRating || 1200,
        platformsCount: analysis.totalContestsAnalyzed || 0
      },
      topicAnalysis: {
        topics: analysis.topics?.map(topic => ({
          topic: topic.topic,
          attempted: topic.attempted,
          solved: topic.solved,
          failureRate: topic.failureRate,
          successRate: topic.successRate,
          weaknessScore: topic.failureRate // Use failure rate as weakness score
        })) || []
      },
      platforms: [], // Will be populated from platform data
      platformData: {}, // For backward compatibility
      advancedMetrics: analysis.advancedMetrics || {},
      mlInsights: analysis.mlInsights || {}
    };

    return res.json({
      success: true,
      analysis: formattedAnalysis
    });

  } catch (error) {
    console.error('Performance analysis error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze performance'
    });
  }
});



/**
 * GET PERFORMANCE SUMMARY (lightweight)
 */
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const fullAnalysis = await performanceAnalyzer.analyzeUserPerformance(userId);

    // Return only essential summary data
    const summary = {
      performanceScore: fullAnalysis.performanceScore,
      aggregatedMetrics: fullAnalysis.aggregatedMetrics,
      topWeakTopics: Object.entries(fullAnalysis.topicAnalysis.topics)
        .sort((a, b) => b[1].weaknessScore - a[1].weaknessScore)
        .slice(0, 3)
        .map(([topic, stats]) => ({
          topic,
          weaknessScore: stats.weaknessScore,
          failureRate: stats.failureRate
        })),
      overallAssessment: fullAnalysis.insights.overallAssessment,
      analyzedAt: fullAnalysis.analyzedAt
    };

    return res.json({
      success: true,
      summary
    });

  } catch (error) {
    console.error('Performance summary error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to get performance summary'
    });
  }
});

/**
 * POST ANALYZE PERFORMANCE BY HANDLES (no auth required)
 */
router.post('/', async (req, res) => {
  try {
    const { handles } = req.body;

    if (!handles || typeof handles !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Handles object is required'
      });
    }

    const analysis = await performanceAnalyzer.analyzeByHandles(handles);

    return res.json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('Performance analysis by handles error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze performance'
    });
  }
});



module.exports = router;
