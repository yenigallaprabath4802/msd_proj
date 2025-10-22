const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Booking } = require('../models');
const config = require('../config');
const { auth } = require('../middleware');

// register (accepts /register and /signup)
router.post(['/register', '/signup'], async (req, res) => {
  try {
    console.log('Auth register body:', req.body);
    const username = (req.body.username || req.body.name || req.body.fullName || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password;
    if (!username || !email || !password) return res.status(400).json({ message: 'username, email and password are required' });

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ username, email, password });
    await user.save();
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    if (err.name === 'ValidationError') return res.status(400).json({ message: 'Validation failed', errors: err.errors });
    return res.status(500).json({ message: 'Error registering user' });
  }
});

// login -> returns JWT
router.post('/login', async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, username: user.username, role: user.role }, config.jwtSecret, { expiresIn: '24h' });
    return res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Error logging in' });
  }
});

// profile (protected)
router.get('/me', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('location');
    res.json({ user: req.user, bookings });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

module.exports = router;