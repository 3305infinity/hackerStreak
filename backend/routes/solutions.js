const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const ContestSubmission = require('../models/ContestSubmission');

// @route   GET /api/solutions
// @desc    Get user's solved problems
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's solved problems from contest submissions
    const solvedProblems = await ContestSubmission.find({
      userId: userId,
      verdict: 'OK'
    }).select('platform problemId problemName problemRating problemTags submissionTime')
      .sort({ submissionTime: -1 });

    // Group by platform
    const groupedSolutions = solvedProblems.reduce((acc, submission) => {
      const platform = submission.platform;
      if (!acc[platform]) {
        acc[platform] = [];
      }
      acc[platform].push({
        problemId: submission.problemId,
        problemName: submission.problemName,
        problemRating: submission.problemRating,
        problemTags: submission.problemTags,
        solvedAt: submission.submissionTime
      });
      return acc;
    }, {});

    res.json({
      success: true,
      solutions: groupedSolutions,
      totalSolved: solvedProblems.length
    });

  } catch (error) {
    console.error('Error fetching solutions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching solutions'
    });
  }
});

// @route   GET /api/solutions/:platform
// @desc    Get user's solved problems for specific platform
// @access  Private
router.get('/:platform', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { platform } = req.params;

    const solvedProblems = await ContestSubmission.find({
      userId: userId,
      platform: platform,
      verdict: 'OK'
    }).select('problemId problemName problemRating problemTags submissionTime')
      .sort({ submissionTime: -1 });

    const solutions = solvedProblems.map(submission => ({
      problemId: submission.problemId,
      problemName: submission.problemName,
      problemRating: submission.problemRating,
      problemTags: submission.problemTags,
      solvedAt: submission.submissionTime
    }));

    res.json({
      success: true,
      platform: platform,
      solutions: solutions,
      totalSolved: solutions.length
    });

  } catch (error) {
    console.error('Error fetching platform solutions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching platform solutions'
    });
  }
});

// @route   GET /api/solutions/stats
// @desc    Get solution statistics
// @access  Private
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get total solved problems
    const totalSolved = await ContestSubmission.countDocuments({
      userId: userId,
      verdict: 'OK'
    });

    // Get solved problems by platform
    const platformStats = await ContestSubmission.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId), verdict: 'OK' } },
      { $group: { _id: '$platform', count: { $sum: 1 } } }
    ]);

    // Get solved problems by difficulty (if rating available)
    const difficultyStats = await ContestSubmission.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId), verdict: 'OK', problemRating: { $ne: null } } },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lte: ['$problemRating', 1200] }, then: 'Easy' },
                { case: { $lte: ['$problemRating', 1600] }, then: 'Medium' }
              ],
              default: 'Hard'
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        totalSolved: totalSolved,
        platformBreakdown: platformStats,
        difficultyBreakdown: difficultyStats
      }
    });

  } catch (error) {
    console.error('Error fetching solution stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching solution statistics'
    });
  }
});

module.exports = router;
