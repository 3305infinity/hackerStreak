const { check, validationResult } = require('express-validator');
const Platform = require('../models/Platform');

// Common validation messages
const validationMessages = {
  required: 'This field is required',
  url: 'Please enter a valid URL',
  email: 'Please enter a valid email address',
  handle: {
    min: 'Handle must be at least 3 characters',
    max: 'Handle must be less than 50 characters',
    invalid: 'Handle contains invalid characters'
  }
};

// Helper function to validate URLs
const isValidUrl = (url) => {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Helper function to validate platform handles
const validateHandle = (platformName, handle) => {
  if (!handle) return false;
  
  // Common validations
  if (handle.length < 3 || handle.length > 50) return false;
  
  // Platform-specific validations
  switch (platformName.toLowerCase()) {
    case 'leetcode':
      return /^[a-zA-Z0-9_-]+$/.test(handle);
    case 'codeforces':
      return /^[a-zA-Z0-9_-]+$/.test(handle);
    case 'codechef':
      return /^[a-zA-Z0-9_]+$/.test(handle);
    case 'hackerrank':
      return /^[a-zA-Z0-9_-]+$/.test(handle);
    case 'atcoder':
      return /^[a-zA-Z0-9_]+$/.test(handle);
    case 'hackerearth':
      return /^[a-zA-Z0-9@._-]+$/.test(handle);
    case 'geeksforgeeks':
      return /^[a-zA-Z0-9_]+$/.test(handle);
    default:
      return /^[a-zA-Z0-9_-]+$/.test(handle);
  }
};

// Validation middleware for user profile updates
const validateProfileUpdate = [
  check('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  check('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must be less than 500 characters'),
  
  check('githubUrl')
    .optional()
    .trim()
    .custom((value) => {
      if (!value) return true;
      if (!isValidUrl(value)) throw new Error(validationMessages.url);
      if (!value.includes('github.com')) throw new Error('Please enter a valid GitHub URL');
      return true;
    }),
  
  check('linkedinUrl')
    .optional()
    .trim()
    .custom((value) => {
      if (!value) return true;
      if (!isValidUrl(value)) throw new Error(validationMessages.url);
      if (!value.includes('linkedin.com')) throw new Error('Please enter a valid LinkedIn URL');
      return true;
    }),
  
  check('portfolioUrl')
    .optional()
    .trim()
    .custom((value) => {
      if (!value) return true;
      if (!isValidUrl(value)) throw new Error(validationMessages.url);
      return true;
    }),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation middleware for platform creation/update
const validatePlatform = [
  check('platformName')
    .notEmpty()
    .withMessage(validationMessages.required)
    .isIn([
      'LeetCode',
      'Codeforces',
      'CodeChef',
      'HackerRank',
      'AtCoder',
      'HackerEarth',
      'GeeksForGeeks'
    ])
    .withMessage('Please select a valid platform'),
  
  check('handle')
    .notEmpty()
    .withMessage(validationMessages.required)
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage(validationMessages.handle.min)
    .custom(async (value, { req }) => {
      // Check if handle is valid for the platform
      if (!validateHandle(req.body.platformName, value)) {
        throw new Error(validationMessages.handle.invalid);
      }
      
      // Check if platform handle already exists for this user
      const existingPlatform = await Platform.findOne({
        user: req.user._id,
        platformName: req.body.platformName,
        handle: value
      });
      
      if (existingPlatform && (!req.params.platformId || existingPlatform._id.toString() !== req.params.platformId)) {
        throw new Error('You already have this platform connected');
      }
      
      return true;
    }),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation middleware for checking platform ownership
const validatePlatformOwnership = async (req, res, next) => {
  try {
    const platform = await Platform.findOne({
      _id: req.params.platformId,
      user: req.user._id
    });
    
    if (!platform) {
      return res.status(404).json({
        success: false,
        error: 'Platform not found or you do not have permission'
      });
    }
    
    req.platform = platform;
    next();
  } catch (err) {
    console.error('Error validating platform ownership:', err);
    res.status(500).json({
      success: false,
      error: 'Server error during platform validation'
    });
  }
};

module.exports = {
  validateProfileUpdate,
  validatePlatform,
  validatePlatformOwnership,
  validateHandle,
  isValidUrl
};