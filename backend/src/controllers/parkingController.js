import { parkingService } from '../services/parkingService.js';

export const parkingController = {
  // POST /api/parking/park
  async parkVehicle(req, res) {
    try {
      const { vehicleNumber, vehicleType, ownerName } = req.body;
      const result = await parkingService.parkVehicle({ vehicleNumber, vehicleType, ownerName });
      return res.status(200).json({ success: true, ...result });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  // POST /api/parking/exit
  async exitVehicle(req, res) {
    try {
      const { vehicleNumber } = req.body;
      const result = await parkingService.exitVehicle(vehicleNumber);
      return res.status(200).json({ success: true, ...result });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  // GET /api/parking/slots
  getAllSlots(req, res) {
    try {
      const slots = parkingService.getAllSlots();
      return res.status(200).json({ success: true, count: slots.length, slots });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // GET /api/parking/vehicle/:vehicleNumber
  searchVehicle(req, res) {
    try {
      const { vehicleNumber } = req.params;
      const result = parkingService.searchVehicle(vehicleNumber);
      return res.status(200).json({ success: true, ...result });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  // GET /api/parking/queue
  getWaitingQueue(req, res) {
    try {
      const queue = parkingService.getWaitingQueue();
      return res.status(200).json({ success: true, count: queue.length, queue });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // DELETE /api/parking/queue/:vehicleNumber
  async removeWaitingVehicle(req, res) {
    try {
      const { vehicleNumber } = req.params;
      const result = await parkingService.removeWaitingVehicle(vehicleNumber);
      return res.status(200).json({ success: true, ...result });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  // GET /api/parking/history
  getParkingHistory(req, res) {
    try {
      const history = parkingService.getParkingHistory();
      return res.status(200).json({ success: true, count: history.length, history });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // POST /api/parking/history/pop
  async popHistory(req, res) {
    try {
      const result = await parkingService.popHistory();
      return res.status(200).json({ success: true, ...result });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  // DELETE /api/parking/history
  async clearHistory(req, res) {
    try {
      const result = await parkingService.clearHistory();
      return res.status(200).json({ success: true, ...result });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // POST /api/parking/slots
  async addSlot(req, res) {
    try {
      const { slotId } = req.body;
      const result = await parkingService.addSlot(slotId);
      return res.status(201).json({ success: true, ...result });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  // DELETE /api/parking/slots/:id
  async deleteSlot(req, res) {
    try {
      const { id } = req.params;
      const result = await parkingService.deleteSlot(id);
      return res.status(200).json({ success: true, ...result });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  // GET /api/parking/stats
  getStats(req, res) {
    try {
      const stats = parkingService.getStats();
      return res.status(200).json({ success: true, stats });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // GET /api/parking/dsa-state
  getDsaState(req, res) {
    try {
      const dsaState = parkingService.getDsaState();
      return res.status(200).json({ success: true, ...dsaState });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // POST /api/parking/reset
  async resetSystem(req, res) {
    try {
      const { preset } = req.body;
      const result = await parkingService.resetSystem(preset || 'DEFAULT');
      return res.status(200).json({ success: true, ...result });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },
};
