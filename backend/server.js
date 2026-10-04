import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import parkingRoutes from './src/routes/parkingRoutes.js';
import { parkingService } from './src/services/parkingService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_parking_dsa';

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Request logger for academic demonstration
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.originalUrl.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Mount Routes
app.use('/api/parking', parkingRoutes);

// Root health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    project: 'Smart Parking Management System — DSA Project',
    dsaComponents: {
      parkingSlots: 'Singly Linked List (ParkingSlotLinkedList)',
      waitingQueue: 'FIFO Queue (WaitingQueue)',
      parkingHistory: 'LIFO Stack (ParkingHistoryStack)',
    },
    mongoConnected: mongoose.connection.readyState === 1,
    endpoints: {
      slots: '/api/parking/slots',
      queue: '/api/parking/queue',
      history: '/api/parking/history',
      stats: '/api/parking/stats',
      dsaState: '/api/parking/dsa-state',
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Error Handler]', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Connect to MongoDB and start server
async function startServer() {
  try {
    console.log('Connecting to MongoDB at:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('✅ Connected to MongoDB successfully.');
  } catch (err) {
    console.warn('⚠️ MongoDB connection could not be established:', err.message);
    console.log('ℹ️ Running in resilient file-backed mode (backend/data/parking-state.json).');
  }

  // Initialize DSA in-memory engine
  await parkingService.initialize();

  app.listen(PORT, () => {
    console.log(`🚀 Smart Parking DSA Server is running on http://localhost:${PORT}`);
    console.log(`📊 Linked List Slots: ${parkingService.slotsList.size}`);
    console.log(`⏳ Waiting Queue Size: ${parkingService.waitingQueue.getSize()}`);
    console.log(`📚 History Stack Size: ${parkingService.historyStack.getSize()}`);
  });
}

startServer();
