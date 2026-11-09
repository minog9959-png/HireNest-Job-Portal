const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();
const makeToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register — seeker ya employer banega
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, company, skills } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password and role are required' });
    }
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'This email is already registered' });
    }
    const user = await User.create({ name, email, password, role, company, skills });
    res.status(201).json({
      token: makeToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Email or password is incorrect' });
    }
    res.json({
      token: makeToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// POST /api/auth/forgot-password — reset link banao
// Asal token kabhi DB me nahi jata, sirf us ka hash + 15 minute ki expiry jati hai.
// Email service is project me nahi hai, is liye reset link jawab me diya jata hai
// (demo ke liye); asal app me ye link email se bheja jata hai.
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    // Email na mile to bhi wahi jawab, taake koi ye na jaan sake ke email registered hai ya nahi
    if (!user) return res.json({ message: 'If an account exists for this email, a password reset link has been sent.' });
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save({ validateBeforeSave: false });
    const base = req.headers.origin || '';
    res.json({
      message: 'If an account exists for this email, a password reset link has been sent.',
      resetUrl: `${base}/reset-password/${token}`,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// POST /api/auth/reset-password/:token — naya password set karo
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: 'Reset link is invalid or expired' });
    user.password = password; // pre-save hook khud hash kar dega
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.json({ message: 'Password has been reset. Please log in with your new password.' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// GET /api/auth/me — login user ki detail
router.get('/me', protect, (req, res) => res.json(req.user));

module.exports = router;
