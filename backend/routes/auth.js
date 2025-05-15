// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const User = require('../models/User');
// require('dotenv').config();

// const router = express.Router();
// const JWT_SECRET = process.env.JWT_SECRET;

// // Nodemailer setup
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PASS,
//   }
// });

// // Store OTPs temporarily
// const otpStore = {};

// // Send OTP
// router.post('/send-otp', async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ 
//       success: false,
//       error: 'Email is required' 
//     });
//   }

//   try {
//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ 
//         success: false,
//         error: 'Email already registered' 
//       });
//     }

//     // Generate OTP (6 digits)
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     otpStore[email] = otp;

//     // Send email
//     await transporter.sendMail({
//       from: process.env.EMAIL,
//       to: email,
//       subject: 'Your OTP Code',
//       text: `Your OTP code is: ${otp}`,
//       html: `<p>Your OTP code is: <strong>${otp}</strong></p>`
//     });

//     res.json({ 
//       success: true,
//       message: 'OTP sent successfully'
//     });
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Failed to send OTP'
//     });
//   }
// });

// // Register User
// router.post('/register', async (req, res) => {
//   const { name, email, password, otp } = req.body;
  
//   if (!name || !email || !password || !otp) {
//     return res.status(400).json({ 
//       success: false,
//       error: "All fields are required" 
//     });
//   }

//   // Check if OTP exists and matches
//   if (!otpStore[email] || otpStore[email] !== otp.toString().trim()) {
//     return res.status(400).json({ 
//       success: false,
//       error: 'Invalid or expired OTP' 
//     });
//   }

//   // Delete OTP after verification
//   delete otpStore[email];

//   try {
//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const user = await User.create({ 
//       name, 
//       email, 
//       password: hashedPassword 
//     });

//     // Generate JWT token
//     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

//     res.json({ 
//       success: true, 
//       message: 'User registered successfully',
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email
//       }
//     });
//   } catch (err) {
//     console.error("Registration error:", err);
//     res.status(500).json({ 
//       success: false,
//       error: 'Registration failed' 
//     });
//   }
// });

// // Login
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ 
//         success: false,
//         error: 'Invalid credentials' 
//       });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ 
//         success: false,
//         error: 'Invalid credentials' 
//       });
//     }

//     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    
//     res.json({ 
//       success: true, 
//       token, 
//       user: { 
//         id: user._id, 
//         name: user.name, 
//         email: user.email 
//       } 
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error during login' 
//     });
//   }
// });

// module.exports = router;




const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  }
});

// Store OTPs temporarily (in a real app, use Redis or a database with TTL)
const otpStore = {};

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ 
      success: false,
      error: 'Email is required' 
    });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: 'Email already registered' 
      });
    }

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with email
    otpStore[email] = otp;
    
    // Set OTP to expire after 10 minutes
    setTimeout(() => {
      delete otpStore[email];
    }, 10 * 60 * 1000);

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Your HackStreak Verification Code',
      text: `Your verification code is: ${otp}. This code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to HackStreak!</h2>
          <p>Your verification code is: <strong style="font-size: 24px;">${otp}</strong></p>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `
    });

    res.json({ 
      success: true,
      message: 'OTP sent successfully'
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to send OTP'
    });
  }
});

// Register User
router.post('/register', async (req, res) => {
  const { name, email, password, otp } = req.body;
  
  if (!name || !email || !password || !otp) {
    return res.status(400).json({ 
      success: false,
      error: "All fields are required" 
    });
  }

  try {
    // Check if email exists in OTP store
    if (!otpStore[email]) {
      return res.status(400).json({ 
        success: false,
        error: 'OTP expired or not requested. Please request a new OTP' 
      });
    }

    // Check if OTP matches
    if (otpStore[email] !== otp.toString().trim()) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid OTP' 
      });
    }

    // Delete OTP after verification
    delete otpStore[email];

    // Check if user already exists (double-check)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: 'Email already registered' 
      });
    }

    // Password validation (backend validation)
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        success: false,
        error: 'Password must contain at least 8 characters, one uppercase letter, and one number' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12); // Using 12 rounds for better security

    // Create user
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword 
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id }, 
      JWT_SECRET, 
      { expiresIn: '7d' } // 7 days expiration
    );

    res.json({ 
      success: true, 
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ 
      success: false,
      error: 'Registration failed' 
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      error: 'Email and password are required' 
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    const token = jwt.sign(
      { id: user._id }, 
      JWT_SECRET, 
      { expiresIn: '7d' } // 7 days expiration
    );
    
    res.json({ 
      success: true, 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      } 
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      success: false,
      error: 'Server error during login' 
    });
  }
});

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ success: false, error: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Token is not valid' });
  }
};

// Get current user (protected route)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;