import cors from 'cors';
import express from 'express';
import feedbackRoutes from './routes/feedback.routes.js';

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('This origin is not allowed by CORS.'));
  },
}));
app.use(express.json({ limit: '20kb' }));

app.get('/api/health', (_req, res) => res.json({ success: true, message: 'Student feedback API is running.' }));
app.use('/api/feedback', feedbackRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  console.error('Request failed:', error.name || 'Error');
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Request body must be valid JSON.' });
  }
  if (error.message === 'This origin is not allowed by CORS.') {
    return res.status(403).json({ success: false, message: error.message });
  }
  return res.status(500).json({ success: false, message: 'Something went wrong while processing the request.' });
});

export default app;
