const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Routes
app.use('/api/employees', require('./routes/employees'));
app.use('/api/timesheets', require('./routes/timesheets'));
app.use('/api/training', require('./routes/training'));
app.use('/api/utilization', require('./routes/utilization'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/reports', require('./routes/reports'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'WorkFlow Assistant API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    integrations: ['Time@IBM', 'MyLearning', 'SuccessFactors', 'MySA']
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.path });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`\n🚀 WorkFlow Assistant API running on http://localhost:${PORT}`);
  console.log(`📡 Integrations: Time@IBM | MyLearning | SuccessFactors | MySA`);
  console.log(`🔑 Health: http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
