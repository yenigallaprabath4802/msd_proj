const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authRoutes = require('./auth');
const { Location, Booking, Contact } = require('../models');
const { auth } = require('../middleware');

router.use('/auth', authRoutes);

// public: list locations (only necessary fields)
router.get('/locations', async (req, res) => {
  try {
    const locations = await Location.find().select('_id name price available image description');
    res.json(locations);
  } catch (err) {
    console.error('Get locations error:', err);
    res.status(500).json({ message: err.message });
  }
});

// protected: create booking (accepts location id or location name)
router.post('/bookings', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    let { location, startDate, endDate, totalPrice } = req.body;

    if (!location || !startDate || !endDate || !totalPrice) {
      return res.status(400).json({ message: 'Missing booking fields' });
    }

    // If location is not a valid ObjectId, try to resolve by name (case-insensitive exact)
    if (!mongoose.Types.ObjectId.isValid(location)) {
      const locDoc = await Location.findOne({ name: new RegExp('^' + location + '$', 'i') });
      if (!locDoc) {
        return res.status(400).json({ message: 'Location not found. Provide a valid location id or exact name.' });
      }
      location = locDoc._id;
    }

    const booking = new Booking({
      user: userId,
      location,
      startDate,
      endDate,
      totalPrice,
      status: 'confirmed'
    });

    await booking.save();
    await booking.populate('location');
    res.status(201).json(booking);
  } catch (err) {
    console.error('Create booking error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Booking validation failed', errors: err.errors });
    }
    res.status(500).json({ message: err.message });
  }
});

// list current user's bookings
router.get('/bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('location').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error('List bookings error:', err);
    res.status(500).json({ message: err.message });
  }
});

// get booking by id
router.get('/bookings/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('location');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
    res.json(booking);
  } catch (err) {
    console.error('Get booking error:', err);
    res.status(500).json({ message: err.message });
  }
});

// cancel booking
router.delete('/bookings/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled', booking });
  } catch (err) {
    console.error('Cancel booking error:', err);
    res.status(500).json({ message: err.message });
  }
});

// contact route
router.post('/contact', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json(contact);
  } catch (err) {
    console.error('Contact error:', err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;