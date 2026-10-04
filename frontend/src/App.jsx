import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import ParkingLotGrid from './components/ParkingLotGrid';
import DashboardStreams from './components/DashboardStreams';
import SlotDetailModal from './components/SlotDetailModal';
import ParkVehicleModal from './components/ParkVehicleModal';
import ExitVehicleModal from './components/ExitVehicleModal';
import DsaVisualizerPage from './components/DsaVisualizerPage';
import DsaOperationsPanel from './components/DsaOperationsPanel';
import VehicleSearchPage from './components/VehicleSearchPage';
import AdminPanel from './components/AdminPanel';
import VivaCodeGuide from './components/VivaCodeGuide';
import ToastNotification from './components/ToastNotification';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dsaState, setDsaState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(true);

  // Modals
  const [selectedSlotForModal, setSelectedSlotForModal] = useState(null);
  const [isParkModalOpen, setIsParkModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success', title = '', dsaBadge = '') => {
    setToast({ message, type, title, dsaBadge });
  };

  // Fetch full state from backend
  const loadData = useCallback(async () => {
    try {
      const data = await api.getDsaState();
      setDsaState(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load DSA state:', err);
      setError(err.message || 'Unable to connect to backend server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Periodic poll every 5 seconds to keep synchronized
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Handle Park Vehicle
  const handleParkVehicle = async (vehicleData) => {
    try {
      const res = await api.parkVehicle(vehicleData);
      if (res.action === 'PARKED') {
        showToast(
          res.message,
          'success',
          'Vehicle Parked',
          `Linked List [${res.slot.slotId}] OCCUPIED`
        );
      } else {
        showToast(
          res.message,
          'info',
          'Waiting Queue Enqueued',
          `Queue ENQUEUE (Position #${res.queuePosition})`
        );
      }
      await loadData();
    } catch (err) {
      showToast(err.message, 'error', 'Parking Failed');
      throw err;
    }
  };

  // Handle Exit Vehicle
  const handleExitVehicle = async (vehicleNumber) => {
    try {
      const res = await api.exitVehicle(vehicleNumber);
      let dsaBadge = 'Linked List Freed + Stack PUSH';
      if (res.autoAssignedVehicle) {
        dsaBadge += ' + Queue DEQUEUE';
      }
      showToast(
        res.message + (res.autoAssignedVehicle ? ` ➔ Auto-assigned to waiting vehicle ${res.autoAssignedVehicle.vehicleNumber}!` : ''),
        'success',
        'Exit Processed',
        dsaBadge
      );
      await loadData();
    } catch (err) {
      showToast(err.message, 'error', 'Exit Failed');
      throw err;
    }
  };

  // Handle Pop History Stack
  const handlePopHistory = async () => {
    try {
      const res = await api.popHistory();
      showToast(
        `Popped receipt for vehicle ${res.poppedRecord.vehicleNumber} from Stack.`,
        'info',
        'Stack POP Operation',
        'LIFO Stack (top = top.next)'
      );
      await loadData();
    } catch (err) {
      showToast(err.message, 'error', 'Pop Failed');
    }
  };

  // Handle Clear History Stack
  const handleClearHistory = async () => {
    try {
      await api.clearHistory();
      showToast('Parking History Stack has been completely reset.', 'info', 'Stack Cleared', 'TOP ➔ NULL');
      await loadData();
    } catch (err) {
      showToast(err.message, 'error', 'Clear Failed');
    }
  };

  // Handle Remove from Waiting Queue
  const handleRemoveWaiting = async (vehicleNumber) => {
    try {
      await api.removeWaitingVehicle(vehicleNumber);
      showToast(`Vehicle ${vehicleNumber} removed from waiting queue.`, 'info', 'Queue Cancellation');
      await loadData();
    } catch (err) {
      showToast(err.message, 'error', 'Remove Failed');
    }
  };

  // Handle Reset System Presets
  const handleResetSystem = async (preset) => {
    try {
      const res = await api.resetSystem(preset);
      showToast(res.message, 'success', 'System State Reinitialized', 'All Structures Reset');
      await loadData();
    } catch (err) {
      showToast(err.message, 'error', 'Reset Failed');
    }
  };

  // Simulate Rush Demo (Fast academic presentation walkthrough)
  const handleSimulateRush = async () => {
    try {
      showToast('Simulating traffic rush: Park & Queue demo...', 'info', 'Demo Simulation Started');
      // Add a couple of demo cars to showcase auto-queueing and stack exit
      const randomId = Math.floor(1000 + Math.random() * 9000);
      await api.parkVehicle({
        vehicleNumber: `KA53ZZ${randomId}`,
        vehicleType: 'Car',
        ownerName: 'Rush Demo Driver',
      });
      await loadData();
      showToast('Traffic rush completed successfully!', 'success', 'Simulation Finished');
    } catch (err) {
      showToast(err.message, 'info');
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const slots = dsaState ? dsaState.linkedList.nodes : [];
  const waitingQueue = dsaState ? dsaState.queue.items : [];
  const historyStack = dsaState ? dsaState.stack.items : [];
  const stats = dsaState ? dsaState.stats : null;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        onOpenParkModal={() => setIsParkModalOpen(true)}
        onOpenExitModal={() => setIsExitModalOpen(true)}
        onSimulateRush={handleSimulateRush}
        isDark={isDark}
        toggleTheme={toggleTheme}
        loading={loading}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm flex items-center justify-between">
            <div>
              <strong className="font-bold">Backend Connection Notice: </strong>
              <span>{error}</span>
            </div>
            <button
              onClick={loadData}
              className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
            >
              Retry
            </button>
          </div>
        )}

        {/* Global Statistics Cards (Visible across tabs or prominent) */}
        <StatsCards stats={stats} />

        {/* TAB 1: DASHBOARD & LIVE PARKING AREA */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <ParkingLotGrid
              slots={slots}
              onSelectSlot={(slot) => setSelectedSlotForModal(slot)}
              onQuickParkSlot={(slot) => setIsParkModalOpen(true)}
            />

            {/* Waiting Queue & Recent Exits streams */}
            <DashboardStreams
              waitingQueue={waitingQueue}
              historyStack={historyStack}
              onPopHistory={handlePopHistory}
              onRemoveWaiting={handleRemoveWaiting}
              onNavigateToVisualizer={() => setActiveTab('visualizer')}
            />
          </div>
        )}

        {/* TAB 2: DEDICATED DSA VISUALIZER PAGE */}
        {activeTab === 'visualizer' && (
          <DsaVisualizerPage
            dsaState={dsaState}
            onPopHistory={handlePopHistory}
            onRemoveWaiting={handleRemoveWaiting}
            onSelectSlot={(slot) => setSelectedSlotForModal(slot)}
          />
        )}

        {/* TAB 3: DSA OPERATIONS & POINTER TRACE PANEL */}
        {activeTab === 'operations' && (
          <DsaOperationsPanel dsaState={dsaState} />
        )}

        {/* TAB 4: VEHICLE SEARCH ENGINE */}
        {activeTab === 'search' && (
          <VehicleSearchPage onExitVehicle={handleExitVehicle} />
        )}

        {/* TAB 5: ADMIN CONTROLS */}
        {activeTab === 'admin' && (
          <AdminPanel
            dsaState={dsaState}
            onRefresh={loadData}
            onPopHistory={handlePopHistory}
            onClearHistory={handleClearHistory}
            onResetSystem={handleResetSystem}
          />
        )}

        {/* TAB 6: ACADEMIC CODE & VIVA GUIDE */}
        {activeTab === 'viva' && <VivaCodeGuide />}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-slate-300">ParkDSA System</span> — College Level Computer Science Academic Project
          </div>
          <div className="font-mono text-[11px] text-brand-400">
            Singly Linked List • FIFO Queue • LIFO Stack
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SlotDetailModal
        slot={selectedSlotForModal}
        onClose={() => setSelectedSlotForModal(null)}
        onExitVehicle={handleExitVehicle}
        onParkInSlot={(slot) => {
          setSelectedSlotForModal(null);
          setIsParkModalOpen(true);
        }}
      />

      <ParkVehicleModal
        isOpen={isParkModalOpen}
        onClose={() => setIsParkModalOpen(false)}
        onPark={handleParkVehicle}
        availableCount={stats ? stats.availableSlots : 0}
      />

      <ExitVehicleModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onExit={handleExitVehicle}
        parkedSlots={slots}
        waitingCount={waitingQueue.length}
      />

      {/* Toast Notification */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
