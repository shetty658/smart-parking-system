import mongoose from 'mongoose';

const ParkingSlotSchema = new mongoose.Schema(
  {
    slotId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    vehicleNumber: {
      type: String,
      trim: true,
      default: null,
    },
    vehicleType: {
      type: String,
      enum: ['Car', 'Bike', 'SUV', 'EV', 'Truck', null],
      default: null,
    },
    ownerName: {
      type: String,
      trim: true,
      default: null,
    },
    entryTime: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['AVAILABLE', 'OCCUPIED', 'RESERVED'],
      default: 'AVAILABLE',
    },
    orderIndex: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const ParkingSlotModel = mongoose.model('ParkingSlot', ParkingSlotSchema);
