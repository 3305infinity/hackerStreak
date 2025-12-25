


const express = require('express');
const Platform = require('../models/Platform');
const auth = require('../middleware/auth');
const platformScraper = require('../services/platformScraper');
const { validatePlatform, validatePlatformOwnership } = require('../middleware/validation');
const rateLimit = require('express-rate-limit');
const router = express.Router();

// Rate limiting for update endpoints
const updateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many update requests, please try again later'
});

// Update all platforms for a user
router.post('/update', auth, updateLimiter, async (req, res) => {
  try {
    await platformScraper.updateAllPlatforms(req.user._id);

    // Return all platforms after update, not just the updated ones
    const allPlatforms = await Platform.find({ user: req.user._id });

    res.json({
      success: true,
      platforms: allPlatforms
    });
  } catch (err) {
    console.error('Error updating platforms:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to update platforms'
    });
  }
});

// Update a specific platform
router.post('/update/:platformId', auth, updateLimiter, validatePlatformOwnership, async (req, res) => {
  try {
    const data = await platformScraper.scrapePlatform(req.platform.platformName, req.platform.handle);
    if (!data) {
      return res.status(400).json({
        success: false,
        error: 'Failed to fetch platform data'
      });
    }
    
    // Update platform data
    Object.assign(req.platform, {
      rating: data.rating,
      maxRating: data.maxRating || req.platform.maxRating,
      rank: data.rank,
      solvedProblems: data.solvedProblems,
      problemBreakdown: data.problemBreakdown || req.platform.problemBreakdown,
      profileUrl: data.profileUrl || req.platform.profileUrl,
      lastUpdated: new Date()
    });
    
    await req.platform.save();
    
    res.json({
      success: true,
      platform: req.platform
    });
  } catch (err) {
    console.error('Error updating platform:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to update platform'
    });
  }
});

// Get all platforms for a user
router.get('/', auth, async (req, res) => {
  try {
    const platforms = await Platform.find({ user: req.user._id });
    res.json({
      success: true,
      platforms
    });
  } catch (err) {
    console.error('Error fetching platforms:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch platforms'
    });
  }
});

// Get platform history
router.get('/:platformId/history', auth, validatePlatformOwnership, async (req, res) => {
  try {
    res.json({
      success: true,
      history: req.platform.updateHistory
    });
  } catch (err) {
    console.error('Error fetching platform history:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch platform history'
    });
  }
});

module.exports = router;