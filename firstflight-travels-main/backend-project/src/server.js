require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/initDb');
const config = require('./config');
const routes = require('./routes');

const app = express();

// Middleware (must be before routes)
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files (project root)
app.use(express.static(path.join(__dirname, '../../')));

// Mount API routes
app.use('/api', routes);

// health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

async function start() {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error('Server init failed:', err);
    process.exit(1);
  }
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught:', err);
  process.exit(1);
});
process.on('unhandledRejection', (err) => {
  console.error('UnhandledRejection:', err);
  process.exit(1);
});

start();

module.exports = app;