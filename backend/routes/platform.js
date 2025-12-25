

const express = require('express');
const Platform = require('../models/Platform');
const User = require('../models/User');
const auth = require('../middleware/auth');
const platformScraper = require('../services/platformScraper');
const router = express.Router();

// Get all platforms for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const platforms = await Platform.find({ user: req.user._id })
      .select('-__v')
      .sort({ platformName: 1 });

    res.json({
      success: true,
      platforms
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch platforms'
    });
  }
});
// Add new platform
router.post('/', auth, async (req, res) => {
  const { platformName, handle } = req.body;
  if (!platformName || !handle) {
    return res.status(400).json({
      success: false,
      error: 'Platform name and handle are required'
    });
  }
  try {
    // Check if platform already exists for this user
    const existing = await Platform.findOne({
      user: req.user._id,
      platformName
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Platform already exists'
      });
    }

    const newPlatform = new Platform({
      user: req.user._id,
      platformName,
      handle
    });

    await newPlatform.save();

    // Try to scrape initial data for the platform
    try {
      const scrapedData = await platformScraper.scrapePlatform(platformName, handle);
      if (scrapedData) {
        newPlatform.rating = scrapedData.rating || newPlatform.rating;
        newPlatform.rank = scrapedData.rank || newPlatform.rank;
        newPlatform.solvedProblems = scrapedData.solvedProblems || newPlatform.solvedProblems;
        newPlatform.problemBreakdown = scrapedData.problemBreakdown || newPlatform.problemBreakdown;
        newPlatform.maxRating = scrapedData.maxRating || newPlatform.maxRating;
        newPlatform.profileUrl = scrapedData.profileUrl || newPlatform.profileUrl;
        newPlatform.lastUpdated = new Date();
        await newPlatform.save();
      }
    } catch (scrapeErr) {
      console.error(`Failed to scrape initial data for ${platformName}:`, scrapeErr.message);
      // Continue without scraping data - platform is still added
    }

    res.status(201).json({
      success: true,
      platform: newPlatform
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to add platform'
    });
  }
});
// Update platform handle
router.put('/:id', auth, async (req, res) => {
  const { handle } = req.body;
  if (!handle) {
    return res.status(400).json({
      success: false,
      error: 'Handle is required'
    });
  }
  try {
    const platform = await Platform.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    if (!platform) {
      return res.status(404).json({ 
        success: false,
        error: 'Platform not found' 
      });
    }

    platform.handle = handle;
    await platform.save();

    res.json({
      success: true,
      platform
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to update platform'
    });
  }
});

// Delete platform
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Platform.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Platform not found'
      });
    }

    res.json({
      success: true,
      message: 'Platform deleted'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete platform'
    });
  }
});

// Update platform stats by scraping
router.post('/update-stats/:id', auth, async (req, res) => {
  try {
    const platform = await Platform.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!platform) {
      return res.status(404).json({
        success: false,
        error: 'Platform not found'
      });
    }

    console.log(`Updating stats for ${platform.platformName} user ${platform.handle}`);

    // Scrape platform data
    const scrapedData = await platformScraper.scrapePlatform(platform.platformName, platform.handle);

    if (!scrapedData) {
      return res.status(400).json({
        success: false,
        error: 'Failed to scrape platform data. Please check the handle and try again.'
      });
    }

    // Update platform with scraped data
    platform.rating = scrapedData.rating || platform.rating;
    platform.rank = scrapedData.rank || platform.rank;
    platform.solvedProblems = scrapedData.solvedProblems || platform.solvedProblems;
    platform.problemBreakdown = scrapedData.problemBreakdown || platform.problemBreakdown;
    platform.maxRating = scrapedData.maxRating || platform.maxRating;
    platform.profileUrl = scrapedData.profileUrl || platform.profileUrl;
    platform.lastUpdated = new Date();

    await platform.save();

    res.json({
      success: true,
      message: 'Platform stats updated successfully',
      platform
    });
  } catch (err) {
    console.error('Error updating platform stats:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update platform stats'
    });
  }
});

// Update all platforms stats
router.post('/update-all-stats', auth, async (req, res) => {
  try {
    const platforms = await Platform.find({ user: req.user._id });

    if (platforms.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No platforms found to update'
      });
    }

    const updatePromises = platforms.map(async (platform) => {
      try {
        console.log(`Updating stats for ${platform.platformName} user ${platform.handle}`);

        const scrapedData = await platformScraper.scrapePlatform(platform.platformName, platform.handle);

        if (scrapedData) {
          platform.rating = scrapedData.rating || platform.rating;
          platform.rank = scrapedData.rank || platform.rank;
          platform.solvedProblems = scrapedData.solvedProblems || platform.solvedProblems;
          platform.problemBreakdown = scrapedData.problemBreakdown || platform.problemBreakdown;
          platform.maxRating = scrapedData.maxRating || platform.maxRating;
          platform.profileUrl = scrapedData.profileUrl || platform.profileUrl;
          platform.lastUpdated = new Date();

          await platform.save();
          return { success: true, platform };
        } else {
          return { success: false, platform: platform.platformName, error: 'Failed to scrape data' };
        }
      } catch (err) {
        console.error(`Error updating ${platform.platformName}:`, err.message);
        return { success: false, platform: platform.platformName, error: err.message };
      }
    });

    const results = await Promise.allSettled(updatePromises);

    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.filter(r => r.status === 'rejected' || !r.value.success).length;

    res.json({
      success: true,
      message: `Updated ${successful} platforms successfully, ${failed} failed`,
      results: results.map(r => r.status === 'fulfilled' ? r.value : { success: false, error: r.reason })
    });
  } catch (err) {
    console.error('Error updating all platform stats:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update platform stats'
    });
  }
});

module.exports = router;
