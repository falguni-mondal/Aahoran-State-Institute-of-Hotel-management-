import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';


import authRouter from './routes/auth.routes.js';

const app = express();

// =========================================
// 1. GLOBAL MIDDLEWARE
// =========================================

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Enable Cross-Origin Resource Sharing
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // Update this to your deployed frontend URL later
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

// Compress response bodies for better performance
app.use(compression());

// Parse incoming JSON payloads (with size limit)
app.use(express.json({ limit: '10kb' }));

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Parse incoming cookies into req.cookies
app.use(cookieParser());

// =========================================
// 2. SECURITY MIDDLEWARE
// =========================================

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// =========================================
// 3. ROUTES
// =========================================

// API Health Check Route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'SIHM Backend API is running smoothly.',
    timestamp: new Date().toISOString()
  });
});

// ROUTUS -------------------------------------------
app.use('/api/v1/auth', authRouter);

// =========================================
// 4. ERROR HANDLING
// =========================================

// Handle unhandled routes (404)
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // Production error response (hide detailed stack traces)
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message || 'Something went wrong!'
    });
  }
});

export default app;