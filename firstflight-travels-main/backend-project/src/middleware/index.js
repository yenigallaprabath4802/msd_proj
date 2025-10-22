// This file exports middleware functions for the application.

const jwt = require('jsonwebtoken');
const config = require('../config');
const { User } = require('../models');

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || req.headers.Authorization;
    const token = header && header.startsWith('Bearer ') ? header.split(' ')[1] : header;
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    const payload = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(payload.userId).select('-password');
    if (!user) return res.status(401).json({ message: 'Invalid token: user not found' });

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = { auth };