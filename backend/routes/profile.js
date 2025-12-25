

const express = require('express');
const User = require('../models/User');
const Platform = require('../models/Platform');
const ContestSubmission = require('../models/ContestSubmission');
const auth = require('../middleware/auth');
const platformScraper = require('../services/platformScraper');
const router = express.Router();
const { validateProfileUpdate } = require('../middleware/validation');

// Get complete user profile with platform data
router.get('/', auth, async (req, res) => {
  try {
    console.log('Profile route accessed by user:', req.user.id);

    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('platforms');

    if (!user) {
      console.log('User not found for ID:', req.user.id);
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    console.log('Profile data retrieved successfully for user:', user.name);

    res.json({
      success: true,
      user,
      platforms: user.platforms || []
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});


// Update user profile
router.put('/', auth, validateProfileUpdate, async (req, res) => {
  try {
    const { name, bio, githubUrl, linkedinUrl, portfolioUrl } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    // Update fields
    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (githubUrl) user.githubUrl = githubUrl;
    if (linkedinUrl) user.linkedinUrl = linkedinUrl;
    if (portfolioUrl) user.portfolioUrl = portfolioUrl;

    await user.save();

    res.json({ 
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        githubUrl: user.githubUrl,
        linkedinUrl: user.linkedinUrl,
        portfolioUrl: user.portfolioUrl
      }
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Failed to update profile' 
    });
  }
});



// // Update user profile
// router.put('/', auth, async (req, res) => {
//   try {
//     const { name, bio, githubUrl, linkedinUrl, portfolioUrl } = req.body;
//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ 
//         success: false,
//         error: 'User not found' 
//       });
//     }

//     if (name) user.name = name;
//     if (bio) user.bio = bio;
//     if (githubUrl) user.githubUrl = githubUrl;
//     if (linkedinUrl) user.linkedinUrl = linkedinUrl;
//     if (portfolioUrl) user.portfolioUrl = portfolioUrl;

//     await user.save();

//     res.json({ 
//       success: true,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         profilePicture: user.profilePicture,
//         bio: user.bio,
//         githubUrl: user.githubUrl,
//         linkedinUrl: user.linkedinUrl,
//         portfolioUrl: user.portfolioUrl
//       }
//     });
//   } catch (err) {
//     console.error('Error updating profile:', err);
//     res.status(500).json({ 
//       success: false,
//       error: 'Failed to update profile' 
//     });
//   }
// });

// Get user activity data
router.get('/activity', auth, async (req, res) => {
  try {
    // In production, replace with actual data from your database
    const platforms = await Platform.find({ user: req.user.id });
    
    // Generate mock activity data (replace with real data in production)
    const activityData = generateActivityData(platforms);
    
    res.json({ 
      success: true,
      activityData 
    });
  } catch (err) {
    console.error('Error fetching activity:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch activity data' 
    });
  }
});

// Refresh platform data and save contest submissions
router.post('/refresh-platforms', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('platforms');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const updatedPlatforms = [];
    const contestSubmissions = [];

    // Process each platform
    for (const platform of user.platforms) {
      try {
        console.log(`Refreshing data for ${platform.platformName}: ${platform.handle}`);

        // Scrape latest data
        const scrapedData = await platformScraper.scrapePlatform(platform.platformName, platform.handle);

        if (scrapedData) {
          // Update platform data
          platform.rating = scrapedData.rating || platform.rating;
          platform.rank = scrapedData.rank || platform.rank;
          platform.solvedProblems = scrapedData.solvedProblems || platform.solvedProblems;
          platform.problemBreakdown = scrapedData.problemBreakdown || platform.problemBreakdown;
          platform.profileUrl = scrapedData.profileUrl || platform.profileUrl;
          platform.lastUpdated = new Date();

          await platform.save();
          updatedPlatforms.push(platform);

          // Save contest submissions if available
          if (scrapedData.contestSubmissions && scrapedData.contestSubmissions.length > 0) {
            for (const submission of scrapedData.contestSubmissions) {
              try {
                // Check if submission already exists
                const existingSubmission = await ContestSubmission.findOne({
                  user: req.user.id,
                  platform: platform.platformName,
                  contestId: submission.contestId,
                  problemId: submission.problemId
                });

                if (!existingSubmission) {
                  const newSubmission = new ContestSubmission({
                    user: req.user.id,
                    platform: platform.platformName,
                    contestId: submission.contestId,
                    contestName: submission.contestName,
                    problemId: submission.problemId,
                    problemName: submission.problemName,
                    problemUrl: submission.problemUrl,
                    submissionTime: submission.submissionTime,
                    verdict: submission.verdict,
                    rating: submission.rating,
                    problemsSolved: submission.problemsSolved,
                    totalProblems: submission.totalProblems,
                    rank: submission.rank,
                    inferredTopic: submission.inferredTopic,
                    topicConfidence: submission.topicConfidence
                  });

                  await newSubmission.save();
                  contestSubmissions.push(newSubmission);
                }
              } catch (subErr) {
                console.error(`Error saving contest submission:`, subErr.message);
                // Continue with other submissions
              }
            }
          }
        }
      } catch (platformErr) {
        console.error(`Error refreshing ${platform.platformName}:`, platformErr.message);
        // Continue with other platforms
      }
    }

    console.log(`Refreshed ${updatedPlatforms.length} platforms and saved ${contestSubmissions.length} contest submissions`);

    res.json({
      success: true,
      message: `Successfully refreshed ${updatedPlatforms.length} platforms and saved ${contestSubmissions.length} contest submissions`,
      updatedPlatforms: updatedPlatforms.length,
      contestSubmissions: contestSubmissions.length
    });

  } catch (err) {
    console.error('Error refreshing platforms:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh platform data'
    });
  }
});

// Helper function to generate activity data
function generateActivityData(platforms) {
  const today = new Date();
  const activityData = [];
  const totalSolved = platforms.reduce((sum, p) => sum + (p.solvedProblems || 0), 0);

  // Distribute solved problems across the year
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    // More activity on weekdays
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseCount = isWeekend ? 0.2 : 0.5;

    // Randomize but weighted by total solved
    const count = Math.min(
      Math.floor(Math.random() * baseCount * (totalSolved / 100)),
      12
    );

    activityData.push({
      date: date.toISOString().split('T')[0],
      count
    });
  }

  return activityData.reverse();
}

module.exports = router;
