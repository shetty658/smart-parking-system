const API_BASE = 'http://localhost:5000/api/parking';

export const api = {
  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch statistics');
    const data = await res.json();
    return data.stats;
  },

  async getDsaState() {
    const res = await fetch(`${API_BASE}/dsa-state`);
    if (!res.ok) throw new Error('Failed to fetch DSA state');
    return await res.json();
  },

  async getAllSlots() {
    const res = await fetch(`${API_BASE}/slots`);
    if (!res.ok) throw new Error('Failed to fetch parking slots');
    const data = await res.json();
    return data.slots;
  },

  async getWaitingQueue() {
    const res = await fetch(`${API_BASE}/queue`);
    if (!res.ok) throw new Error('Failed to fetch waiting queue');
    const data = await res.json();
    return data.queue;
  },

  async getParkingHistory() {
    const res = await fetch(`${API_BASE}/history`);
    if (!res.ok) throw new Error('Failed to fetch parking history');
    const data = await res.json();
    return data.history;
  },

  async parkVehicle({ vehicleNumber, vehicleType, ownerName }) {
    const res = await fetch(`${API_BASE}/park`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicleNumber, vehicleType, ownerName }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to park vehicle');
    }
    return data;
  },

  async exitVehicle(vehicleNumber) {
    const res = await fetch(`${API_BASE}/exit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicleNumber }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to exit vehicle');
    }
    return data;
  },

  async searchVehicle(vehicleNumber) {
    const res = await fetch(`${API_BASE}/vehicle/${encodeURIComponent(vehicleNumber)}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Vehicle search failed');
    }
    return data;
  },

  async addSlot(slotId) {
    const res = await fetch(`${API_BASE}/slots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slotId }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to add slot');
    }
    return data;
  },

  async deleteSlot(slotId) {
    const res = await fetch(`${API_BASE}/slots/${encodeURIComponent(slotId)}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to delete slot');
    }
    return data;
  },

  async popHistory() {
    const res = await fetch(`${API_BASE}/history/pop`, {
      method: 'POST',
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to pop history record');
    }
    return data;
  },

  async clearHistory() {
    const res = await fetch(`${API_BASE}/history`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to clear history');
    }
    return data;
  },

  async removeWaitingVehicle(vehicleNumber) {
    const res = await fetch(`${API_BASE}/queue/${encodeURIComponent(vehicleNumber)}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to remove waiting vehicle');
    }
    return data;
  },

  async resetSystem(preset = 'DEFAULT') {
    const res = await fetch(`${API_BASE}/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preset }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to reset system');
    }
    return data;
  },
};
