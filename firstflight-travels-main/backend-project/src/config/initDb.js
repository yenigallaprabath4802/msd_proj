const mongoose = require('mongoose');
const config = require('./index');

// avoid deprecation warning
mongoose.set('strictQuery', false);

let connection = null;
const connectDB = async () => {
  if (connection) return connection;
  try {
    connection = await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

module.exports = connectDB;