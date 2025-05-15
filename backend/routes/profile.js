// const express = require('express');
// const User = require('../models/User');
// const Platform = require('../models/Platform');
// const auth = require('../middleware/auth');
// const router = express.Router();

// // Get user profile data
// router.get('/user/profile', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id)
//       .select('-password -__v')
//       .populate('platforms', '-__v -user -createdAt -updatedAt');

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: 'User not found'
//       });
//     }

//     res.json({
//       success: true,
//       user
//     });
//   } catch (err) {
//     console.error('Error fetching user profile:', err);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to fetch profile data'
//     });
//   }
// });

// // Get user's platforms with statistics
// router.get('/user/platforms', auth, async (req, res) => {
//   try {
//     const platforms = await Platform.find({ user: req.user._id })
//       .select('-__v -user -createdAt -updatedAt')
//       .sort({ platformName: 1 });

//     res.json({
//       success: true,
//       platforms
//     });
//   } catch (err) {
//     console.error('Error fetching platforms:', err);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to fetch platform data'
//     });
//   }
// });

// // Update user profile
// router.put('/user/profile', auth, async (req, res) => {
//   const { name, bio, githubUrl, linkedinUrl, portfolioUrl } = req.body;

//   try {
//     const user = await User.findById(req.user._id);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: 'User not found'
//       });
//     }

//     // Update fields if they exist in the request
//     if (name) user.name = name;
//     if (bio) user.bio = bio;
//     if (githubUrl) user.githubUrl = githubUrl;
//     if (linkedinUrl) user.linkedinUrl = linkedinUrl;
//     if (portfolioUrl) user.portfolioUrl = portfolioUrl;

//     await user.save();

//     res.json({
//       success: true,
//       user: {
//         _id: user._id,
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

// // Update profile picture
// router.put('/user/profile/picture', auth, async (req, res) => {
//   const { profilePicture } = req.body;

//   if (!profilePicture) {
//     return res.status(400).json({
//       success: false,
//       error: 'Profile picture URL is required'
//     });
//   }

//   try {
//     const user = await User.findById(req.user._id);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: 'User not found'
//       });
//     }

//     user.profilePicture = profilePicture;
//     await user.save();

//     res.json({
//       success: true,
//       profilePicture: user.profilePicture
//     });
//   } catch (err) {
//     console.error('Error updating profile picture:', err);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to update profile picture'
//     });
//   }
// });

// // Get user activity data (for heatmap)
// router.get('/user/activity', auth, async (req, res) => {
//   try {
//     // In a real application, this would come from a database of solved problems
//     // For now, we'll generate mock data similar to the frontend
    
//     const today = new Date();
//     const activityData = [];
    
//     // Generate 365 days of fake data
//     for (let i = 364; i >= 0; i--) {
//       const date = new Date(today);
//       date.setDate(today.getDate() - i);
      
//       // Random number of problems solved (0-12)
//       const problemsSolved = Math.floor(Math.random() * 13);
      
//       activityData.push({
//         date: date.toISOString().split('T')[0],
//         count: problemsSolved
//       });
//     }
    
//     res.json({
//       success: true,
//       activityData
//     });
//   } catch (err) {
//     console.error('Error fetching activity data:', err);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to fetch activity data'
//     });
//   }
// });

// module.exports = router;


const express = require('express');
const User = require('../models/User');
const Platform = require('../models/Platform');
const auth = require('../middleware/auth');
const platformScraper = require('../services/platformScraper');
const router = express.Router();
const { validateProfileUpdate } = require('../middleware/validation');
// Get complete user profile with platform data
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('platforms');

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    res.json({
      success: true,
      user,
      platforms: user.platforms
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