const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Log registered routes for debugging
app.get('/api/debug/routes', (req, res) => {
  const routes = app._router.stack
    .filter(r => r.route)
    .map(r => `${Object.keys(r.route.methods)} ${r.route.path}`);
  res.json({ routes });
});

// Start server
if (require.main === module) {
  connectDB();
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;