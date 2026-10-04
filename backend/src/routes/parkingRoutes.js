import express from 'express';
import { parkingController } from '../controllers/parkingController.js';

const router = express.Router();

// Vehicle Operations
router.post('/park', parkingController.parkVehicle);
router.post('/exit', parkingController.exitVehicle);
router.get('/vehicle/:vehicleNumber', parkingController.searchVehicle);

// Parking Slot Management (Linked List)
router.get('/slots', parkingController.getAllSlots);
router.post('/slots', parkingController.addSlot);
router.delete('/slots/:id', parkingController.deleteSlot);

// Waiting Queue Management (Queue - FIFO)
router.get('/queue', parkingController.getWaitingQueue);
router.delete('/queue/:vehicleNumber', parkingController.removeWaitingVehicle);

// Parking History Management (Stack - LIFO)
router.get('/history', parkingController.getParkingHistory);
router.post('/history/pop', parkingController.popHistory);
router.delete('/history', parkingController.clearHistory);

// Statistics, DSA State & Admin Controls
router.get('/stats', parkingController.getStats);
router.get('/dsa-state', parkingController.getDsaState);
router.post('/reset', parkingController.resetSystem);

export default router;
