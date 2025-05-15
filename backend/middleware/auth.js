// // // const jwt = require('jsonwebtoken');
// // // const User = require('../models/User');
// // // require('dotenv').config();

// // // module.exports = async (req, res, next) => {
// // //   // Get token from header - check both 'x-auth-token' and 'Authorization'
// // //   let token = req.header('x-auth-token');
  
// // //   if (!token && req.header('Authorization')) {
// // //     token = req.header('Authorization').replace('Bearer ', '');
// // //   }

// // //   if (!token) {
// // //     return res.status(401).json({ 
// // //       success: false,
// // //       error: 'No token, authorization denied' 
// // //     });
// // //   }

// // //   try {
// // //     // Verify token
// // //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
// // //     // Find user and attach to request
// // //     req.user = await User.findById(decoded.user?.id || decoded.id).select('-password');
    
// // //     if (!req.user) {
// // //       return res.status(401).json({ 
// // //         success: false,
// // //         error: 'User not found' 
// // //       });
// // //     }
    
// // //     next();
// // //   } catch (err) {
// // //     console.error('Token verification error:', err);
// // //     res.status(401).json({ 
// // //       success: false,
// // //       error: 'Token is not valid' 
// // //     });
// // //   }
// // // };


// // const jwt = require('jsonwebtoken');
// // const User = require('../models/User');
// // require('dotenv').config();

// // module.exports = async (req, res, next) => {
// //   // Get token from header - check both 'x-auth-token' and 'Authorization'
// //   let token = req.header('x-auth-token');
  
// //   if (!token && req.header('Authorization')) {
// //     token = req.header('Authorization').replace('Bearer ', '');
// //   }

// //   // Check if token exists
// //   if (!token) {
// //     return res.status(401).json({ 
// //       success: false,
// //       error: 'No token, authorization denied' 
// //     });
// //   }

// //   try {
// //     // Verify token
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
// //     // Get user id from decoded token (handle different token formats)
// //     const userId = decoded.user?.id || decoded.id;
    
// //     if (!userId) {
// //       return res.status(401).json({
// //         success: false,
// //         error: 'Invalid token format'
// //       });
// //     }
    
// //     // Find user and attach to request
// //     const user = await User.findById(userId).select('-password');
    
// //     if (!user) {
// //       return res.status(401).json({ 
// //         success: false,
// //         error: 'User not found' 
// //       });
// //     }
    
// //     req.user = user;
// //     next();
// //   } catch (err) {
// //     console.error('Token verification error:', err.message);
// //     res.status(401).json({ 
// //       success: false,
// //       error: 'Token is not valid' 
// //     });
// //   }
// // };


// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// require('dotenv').config();

// module.exports = async (req, res, next) => {
//   try {
//     // Get token from header
//     let token = req.header('x-auth-token');
    
//     // Try alternative header if token not found
//     if (!token && req.header('Authorization')) {
//       token = req.header('Authorization').replace('Bearer ', '');
//     }

//     // Check if token exists
//     if (!token) {
//       console.log('No token provided in request');
//       return res.status(401).json({ 
//         success: false,
//         error: 'No token, authorization denied' 
//       });
//     }

//     // Log token for debugging (remove in production)
//     console.log('Token received:', token.substring(0, 10) + '...');
    
//     try {
//       // Verify token with proper error handling
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       console.log('Token decoded successfully:', JSON.stringify(decoded));
      
//       // Get user id from decoded token (handle different token formats)
//       const userId = decoded.user?.id || decoded.id || decoded.user;
      
//       if (!userId) {
//         console.log('No user ID found in token');
//         return res.status(401).json({
//           success: false,
//           error: 'Invalid token format - no user ID found'
//         });
//       }

//       console.log('Looking up user with ID:', userId);
      
//       // Find user and attach to request
//       const user = await User.findById(userId).select('-password');
      
//       if (!user) {
//         console.log('No user found with ID:', userId);
//         return res.status(401).json({ 
//           success: false,
//           error: 'User not found' 
//         });
//       }
      
//       console.log('User found, continuing to route handler');
//       req.user = user;
//       next();
//     } catch (jwtError) {
//       console.error('JWT verification error:', jwtError.message);
      
//       // Check for specific JWT errors
//       if (jwtError.name === 'TokenExpiredError') {
//         return res.status(401).json({
//           success: false, 
//           error: 'Token has expired'
//         });
//       } else if (jwtError.name === 'JsonWebTokenError') {
//         return res.status(401).json({
//           success: false,
//           error: 'Invalid token'
//         });
//       }
      
//       res.status(401).json({ 
//         success: false,
//         error: 'Token verification failed' 
//       });
//     }
//   } catch (err) {
//     console.error('Auth middleware error:', err);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error in authentication'
//     });
//   }
// };

const jwt = require('jsonwebtoken');
// require('dotenv').config();
const User = require('../models/User');
require('dotenv').config();

module.exports = async (req, res, next) => {
  try {
    // Get token from header
    let token = req.header('x-auth-token');
    
    // Try Authorization header if x-auth-token not found
    if (!token && req.header('Authorization')) {
      token = req.header('Authorization').replace('Bearer ', '');
    }

    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'No token, authorization denied' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user and attach to request
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired. Please login again.'
      });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Server error during authentication'
    });
  }
};