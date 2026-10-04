import mongoose from 'mongoose';

const ParkingHistorySchema = new mongoose.Schema(
  {
    vehicleNumber: {
      type: String,
      required: true,
      trim: true,
    },
    vehicleType: {
      type: String,
      default: 'Car',
    },
    ownerName: {
      type: String,
      default: 'Guest',
    },
    slotId: {
      type: String,
      required: true,
    },
    entryTime: {
      type: Date,
      required: true,
    },
    exitTime: {
      type: Date,
      default: Date.now,
    },
    durationMinutes: {
      type: Number,
      required: true,
    },
    fee: {
      type: Number,
      required: true,
    },
    stackDepth: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const ParkingHistoryModel = mongoose.model('ParkingHistory', ParkingHistorySchema);
