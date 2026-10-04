import React from 'react';
import { 
  Car, 
  Bike, 
  Truck, 
  Zap, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function ParkingLotGrid({ slots, onSelectSlot, onQuickParkSlot }) {
  const getVehicleIcon = (type) => {
    switch (type) {
      case 'Bike':
        return <Bike className="w-5 h-5 text-amber-400" />;
      case 'EV':
        return <Zap className="w-5 h-5 text-emerald-400" />;
      case 'SUV':
      case 'Truck':
        return <Truck className="w-5 h-5 text-cyan-400" />;
      default:
        return <Car className="w-5 h-5 text-indigo-400" />;
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    try {
      const d = new Date(timeStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timeStr;
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800">
      {/* Header with Linked List Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-wide">
              Smart Parking Facility — Slot Matrix
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Real-Time
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Internal Representation: <strong className="text-brand-400 font-mono">Singly Linked List</strong> (HEAD ➔ P-01 ➔ P-02 ➔ ... ➔ NULL)
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-slate-300 font-medium">Available (FREE)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-rose-500/20 border border-rose-500 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            </span>
            <span className="text-slate-300 font-medium">Occupied (BUSY)</span>
          </div>
        </div>
      </div>

      {/* Grid of Slots */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {slots.map((slot, index) => {
          const isOccupied = slot.status === 'OCCUPIED';

          return (
            <div
              key={slot.slotId}
              onClick={() => onSelectSlot(slot)}
              className={`relative rounded-xl p-3.5 cursor-pointer transition-all duration-200 border text-left flex flex-col justify-between min-h-[145px] group ${
                isOccupied
                  ? 'bg-slate-900/90 border-rose-500/30 hover:border-rose-500 hover:shadow-lg hover:shadow-rose-950/40'
                  : 'bg-slate-900/50 border-emerald-500/30 hover:border-emerald-400 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-emerald-950/40'
              }`}
            >
              {/* Linked List Order Indicator Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                    {slot.slotId}
                  </span>
                  {index === 0 && (
                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-600 text-white">
                      HEAD
                    </span>
                  )}
                </div>

                {/* Status Indicator */}
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    isOccupied
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {isOccupied ? 'BUSY' : 'FREE'}
                </span>
              </div>

              {/* Slot Body */}
              {isOccupied ? (
                <div className="my-2">
                  <div className="flex items-center gap-2 mb-1">
                    {getVehicleIcon(slot.vehicleType)}
                    <span className="font-mono font-black text-sm text-white tracking-wider">
                      {slot.vehicleNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] truncate">
                    <User className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    <span className="truncate">{slot.ownerName || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-0.5">
                    <Clock className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    <span>In: {formatTime(slot.entryTime)}</span>
                  </div>
                </div>
              ) : (
                <div className="my-auto py-3 text-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-1 group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-semibold text-emerald-400">Available</p>
                  <p className="text-[10px] text-slate-500">Ready for vehicle</p>
                </div>
              )}

              {/* Footer: Linked List Pointer Node Info */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Node #{index + 1}</span>
                <span className="flex items-center gap-1 text-slate-400">
                  {slot.nextSlotId ? (
                    <>
                      <span>➔</span>
                      <span className="text-slate-300 font-bold">{slot.nextSlotId}</span>
                    </>
                  ) : (
                    <span className="text-rose-400/80 font-bold">➔ NULL</span>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
