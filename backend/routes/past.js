const express = require('express');
const router = express.Router();
const { scrapeAllContests } = require('../services/contestScraper');

// @route   GET /api/past
// @desc    Get past contests from all platforms
// @access  Public
router.get('/', async (req, res) => {
  try {
    console.log('Fetching past contests...');

    // Scrape contests from all platforms
    const contestData = await scrapeAllContests();

    // Combine past contests from all platforms
    const allPastContests = [];

    for (const [platform, data] of Object.entries(contestData.results)) {
      if (data.past && Array.isArray(data.past)) {
        // Add platform info and format contests
        const formattedContests = data.past.map(contest => ({
          ...contest,
          platform: platform.charAt(0).toUpperCase() + platform.slice(1),
          id: `${platform}_${contest.contestId || contest.name.replace(/\s+/g, '_')}`,
          // Ensure consistent date format
          startTime: contest.startTime ? new Date(contest.startTime) : null,
          endTime: contest.endTime ? new Date(contest.endTime) : null
        }));
        allPastContests.push(...formattedContests);
      }
    }

    // Sort by start time (most recent first)
    allPastContests.sort((a, b) => {
      if (!a.startTime && !b.startTime) return 0;
      if (!a.startTime) return 1;
      if (!b.startTime) return -1;
      return new Date(b.startTime) - new Date(a.startTime);
    });

    // Limit to recent contests (last 100 for performance)
    const recentContests = allPastContests.slice(0, 100);

    res.json({
      success: true,
      past: recentContests,
      totalContests: recentContests.length,
      platforms: Object.keys(contestData.results),
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching past contests:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching past contests',
      error: error.message
    });
  }
});

// @route   GET /api/past/:platform
// @desc    Get past contests for specific platform
// @access  Public
router.get('/:platform', async (req, res) => {
  try {
    const { platform } = req.params;

    console.log(`Fetching past contests for ${platform}...`);

    // Scrape contests for specific platform
    const { scrapeContests } = require('../services/contestScraper');
    const contestData = await scrapeContests(platform.toLowerCase());

    if (!contestData || !contestData.past) {
      return res.status(404).json({
        success: false,
        message: `No past contests found for ${platform}`
      });
    }

    // Format contests
    const formattedContests = contestData.past.map(contest => ({
      ...contest,
      platform: platform.charAt(0).toUpperCase() + platform.slice(1),
      id: `${platform.toLowerCase()}_${contest.contestId || contest.name.replace(/\s+/g, '_')}`,
      startTime: contest.startTime ? new Date(contest.startTime) : null,
      endTime: contest.endTime ? new Date(contest.endTime) : null
    }));

    // Sort by start time (most recent first)
    formattedContests.sort((a, b) => {
      if (!a.startTime && !b.startTime) return 0;
      if (!a.startTime) return 1;
      if (!b.startTime) return -1;
      return new Date(b.startTime) - new Date(a.startTime);
    });

    res.json({
      success: true,
      platform: platform,
      past: formattedContests,
      totalContests: formattedContests.length,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error(`Error fetching past contests for ${req.params.platform}:`, error);
    res.status(500).json({
      success: false,
      message: `Server error while fetching past contests for ${req.params.platform}`,
      error: error.message
    });
  }
});

module.exports = router;
