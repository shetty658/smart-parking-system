import React, { useState } from 'react';
import { 
  X, 
  Car, 
  Bike, 
  Truck, 
  Zap, 
  User, 
  PlusCircle, 
  Clock, 
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function ParkVehicleModal({ isOpen, onClose, onPark, availableCount, preselectedSlot }) {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('Car');
  const [ownerName, setOwnerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const isFull = availableCount === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vehicleNumber.trim()) {
      setError('Please enter a vehicle registration number.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onPark({
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
        vehicleType,
        ownerName: ownerName.trim() || 'Guest Owner',
      });
      setVehicleNumber('');
      setOwnerName('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to process vehicle entry');
    } finally {
      setLoading(false);
    }
  };

  const samplePlates = [
    { num: 'KA04MN9911', type: 'Car', owner: 'Rahul Sen' },
    { num: 'MH01BK7722', type: 'EV', owner: 'Pooja Bhatt' },
    { num: 'DL08TC5533', type: 'Bike', owner: 'Aman Khan' },
    { num: 'KA25XY1234', type: 'SUV', owner: 'Suresh Raina' },
  ];

  const fillSample = (sample) => {
    setVehicleNumber(sample.num);
    setVehicleType(sample.type);
    setOwnerName(sample.owner);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg glass-panel bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Vehicle Entry Portal</h3>
            <p className="text-xs text-slate-400">
              DSA Action: Singly Linked List Allocation / FIFO Queue Enqueue
            </p>
          </div>
        </div>

        {/* DSA Status Callout */}
        <div className={`p-3.5 rounded-xl border mb-5 text-xs ${
          isFull 
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' 
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
        }`}>
          <div className="flex items-start gap-2.5">
            {isFull ? (
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold text-sm">
                {isFull ? 'All Parking Slots Full (Capacity 100%)' : `${availableCount} Available Slots Detected`}
              </p>
              <p className="mt-0.5 opacity-90">
                {isFull ? (
                  <span>
                    DSA Action: Vehicle will be added to the <strong className="underline">Waiting Queue (FIFO)</strong> at the REAR pointer.
                  </span>
                ) : (
                  <span>
                    DSA Action: Linked List will be traversed to find the first <strong className="underline">AVAILABLE</strong> node and mark it OCCUPIED.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Vehicle Registration Number *
            </label>
            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
              placeholder="e.g. KA01AB1234, DL03CD5678"
              required
              className="w-full px-4 py-2.5 rounded-xl glass-input text-white placeholder-slate-500 font-mono text-sm focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Vehicle Type
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl glass-input text-white text-sm bg-slate-900 focus:outline-none"
              >
                <option value="Car">Car (Sedan/Hatchback)</option>
                <option value="SUV">SUV / Compact SUV</option>
                <option value="Bike">Motorcycle / Scooter</option>
                <option value="EV">Electric Vehicle (EV)</option>
                <option value="Truck">Commercial / Truck</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Owner / Driver Name
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-white placeholder-slate-500 text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Pre-fill Samples for Demo */}
          <div className="pt-1">
            <span className="text-[11px] text-slate-400 block mb-1.5">
              Quick Test Samples (Click to autofill):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {samplePlates.map((s) => (
                <button
                  type="button"
                  key={s.num}
                  onClick={() => fillSample(s)}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[11px] font-mono transition-colors"
                >
                  {s.num} ({s.type})
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all active:scale-[0.98] ${
                isFull
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30'
              }`}
            >
              {loading ? 'Processing...' : isFull ? 'Enqueue to Waiting List' : 'Park Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
