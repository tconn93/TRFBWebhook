require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const webhookRouter = require('./routes/webhook');
const targetsRouter = require('./routes/targets');
const authRouter = require('./routes/auth');
const facebookRouter = require('./routes/facebook');
const { initializeDatabase } = require('./db/init');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/webhook', webhookRouter);
app.use('/api/auth', authRouter);
app.use('/api/targets', targetsRouter);
app.use('/api/facebook', facebookRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database schema
    console.log('Checking database schema...');
    await initializeDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`TRFBWebhook server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`Webhook endpoint: http://localhost:${PORT}/webhook`);
      console.log(`Auth endpoints: http://localhost:${PORT}/api/auth/login`);
      console.log(`Target management: http://localhost:${PORT}/api/targets`);
      console.log(`Facebook OAuth: http://localhost:${PORT}/api/facebook/status`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
