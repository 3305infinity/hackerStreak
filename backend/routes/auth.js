const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTP } = require('../services/emailService');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

// @route   POST /api/auth/register
// @desc    Register user and send OTP
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
      email,
      password
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = generateOTP();
    otpStore.set(email, {
      otp,
      expires: Date.now() + 10 * 60 * 1000, // 10 minutes
      userData: user
    });

    // Send OTP
    await sendOTP(email, otp);

    res.json({ msg: 'OTP sent to your email' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and complete registration
// @access  Public
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpData = otpStore.get(email);
    if (!otpData) {
      return res.status(400).json({ msg: 'OTP not found or expired' });
    }

    if (Date.now() > otpData.expires) {
      otpStore.delete(email);
      return res.status(400).json({ msg: 'OTP expired' });
    }

    if (otpData.otp !== otp) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }

    // Save user to database
    const user = await otpData.userData.save();

    // Generate JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

    // Clean up OTP
    otpStore.delete(email);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset OTP
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    // Generate OTP
    const otp = generateOTP();
    otpStore.set(email, {
      otp,
      expires: Date.now() + 10 * 60 * 1000, // 10 minutes
      purpose: 'password_reset',
      userId: user._id
    });

    // Send OTP
    await sendOTP(email, otp);

    res.json({ msg: 'Password reset OTP sent to your email' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with OTP
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const otpData = otpStore.get(email);
    if (!otpData || otpData.purpose !== 'password_reset') {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }

    if (Date.now() > otpData.expires) {
      otpStore.delete(email);
      return res.status(400).json({ msg: 'OTP expired' });
    }

    if (otpData.otp !== otp) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    await User.findByIdAndUpdate(otpData.userId, { password: hashedPassword });

    // Clean up OTP
    otpStore.delete(email);

    res.json({ msg: 'Password reset successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
