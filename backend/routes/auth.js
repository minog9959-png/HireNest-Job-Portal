const express = require('express');
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

// GET /api/auth/me — login user ki detail
router.get('/me', protect, (req, res) => res.json(req.user));

module.exports = router;
