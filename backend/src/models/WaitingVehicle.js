import mongoose from 'mongoose';

const WaitingVehicleSchema = new mongoose.Schema(
  {
    vehicleNumber: {
      type: String,
      required: true,
      trim: true,
    },
    vehicleType: {
      type: String,
      enum: ['Car', 'Bike', 'SUV', 'EV', 'Truck'],
      default: 'Car',
    },
    ownerName: {
      type: String,
      default: 'Guest',
    },
    waitingSince: {
      type: Date,
      default: Date.now,
    },
    queuePosition: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const WaitingVehicleModel = mongoose.model('WaitingVehicle', WaitingVehicleSchema);
