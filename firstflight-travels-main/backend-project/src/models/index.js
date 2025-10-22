const mongoose = require('mongoose');

module.exports = {
  User: mongoose.models.User || require('./user'),
  Location: mongoose.models.Location || require('./location'),
  Booking: mongoose.models.Booking || require('./booking'),
  Contact: mongoose.models.Contact || require('./contact')
};