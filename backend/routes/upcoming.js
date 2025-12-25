const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const UserAnalytics = require('../models/UserAnalytics');

// @route   GET /api/upcoming
// @desc    Get upcoming contests based on user's skill level
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's platform data to determine skill level
    const userPlatforms = await UserAnalytics.find({ userId: userId });

    if (userPlatforms.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please add at least one coding platform to get personalized contest recommendations'
      });
    }

    // Calculate average rating across platforms
    const totalRating = userPlatforms.reduce((sum, platform) => sum + (platform.rating || 0), 0);
    const avgRating = totalRating / userPlatforms.length;

    // Determine contest difficulty range based on rating
    let minRating, maxRating;
    if (avgRating < 1200) {
      minRating = 800;
      maxRating = 1400;
    } else if (avgRating < 1600) {
      minRating = 1200;
      maxRating = 1800;
    } else if (avgRating < 2000) {
      minRating = 1500;
      maxRating = 2200;
    } else {
      minRating = 1800;
      maxRating = 2500;
    }

    // Mock upcoming contests data (in real implementation, this would come from scrapers)
    const mockUpcomingContests = [
      {
        platform: 'Codeforces',
        name: 'Codeforces Round #800 (Div. 1)',
        startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        duration: '02:00',
        contestId: '1800A',
        minRating: 1600,
        maxRating: 2000,
        registered: false
      },
      {
        platform: 'Codeforces',
        name: 'Codeforces Round #801 (Div. 2)',
        startTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        duration: '02:00',
        contestId: '1801B',
        minRating: 800,
        maxRating: 1600,
        registered: false
      },
      {
        platform: 'LeetCode',
        name: 'Weekly Contest 350',
        startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        duration: '01:30',
        contestId: 'LC350',
        minRating: 1200,
        maxRating: 1800,
        registered: false
      },
      {
        platform: 'AtCoder',
        name: 'AtCoder Beginner Contest 300',
        startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        duration: '01:40',
        contestId: 'ABC300',
        minRating: 0,
        maxRating: 1200,
        registered: false
      }
    ];

    // Filter contests based on user's rating range
    const recommendedContests = mockUpcomingContests.filter(contest => {
      return contest.minRating <= maxRating && contest.maxRating >= minRating;
    });

    // Sort by start time
    recommendedContests.sort((a, b) => a.startTime - b.startTime);

    res.json({
      success: true,
      upcomingContests: recommendedContests,
      userRating: Math.round(avgRating),
      recommendedRange: { minRating, maxRating },
      totalRecommended: recommendedContests.length
    });

  } catch (error) {
    console.error('Error fetching upcoming contests:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching upcoming contests'
    });
  }
});

// @route   GET /api/upcoming/:platform
// @desc    Get upcoming contests for specific platform
// @access  Private
router.get('/:platform', auth, async (req, res) => {
  try {
    const { platform } = req.params;

    // Mock platform-specific upcoming contests
    const platformContests = {
      'Codeforces': [
        {
          name: 'Codeforces Round #802 (Div. 1 + Div. 2)',
          startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          duration: '02:15',
          contestId: '1802A',
          minRating: 800,
          maxRating: 2200
        }
      ],
      'LeetCode': [
        {
          name: 'Biweekly Contest 100',
          startTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
          duration: '01:30',
          contestId: 'BC100',
          minRating: 1000,
          maxRating: 2000
        }
      ],
      'AtCoder': [
        {
          name: 'AtCoder Regular Contest 150',
          startTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
          duration: '02:00',
          contestId: 'ARC150',
          minRating: 1200,
          maxRating: 2000
        }
      ],
      'CodeChef': [
        {
          name: 'CodeChef Starters 50',
          startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          duration: '02:30',
          contestId: 'CC50',
          minRating: 800,
          maxRating: 1800
        }
      ]
    };

    const contests = platformContests[platform] || [];

    res.json({
      success: true,
      platform: platform,
      upcomingContests: contests,
      totalContests: contests.length
    });

  } catch (error) {
    console.error('Error fetching platform upcoming contests:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching platform upcoming contests'
    });
  }
});

// @route   POST /api/upcoming/register/:contestId
// @desc    Register for upcoming contest
// @access  Private
router.post('/register/:contestId', auth, async (req, res) => {
  try {
    const { contestId } = req.params;
    const userId = req.user.id;

    // In a real implementation, this would interact with the contest platform's API
    // For now, we'll just mark it as registered in our mock data

    res.json({
      success: true,
      message: 'Successfully registered for contest',
      contestId: contestId
    });

  } catch (error) {
    console.error('Error registering for contest:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while registering for contest'
    });
  }
});

module.exports = router;
