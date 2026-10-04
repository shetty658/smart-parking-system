import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import { ParkingSlotLinkedList } from '../data-structures/LinkedList.js';
import { WaitingQueue } from '../data-structures/Queue.js';
import { ParkingHistoryStack } from '../data-structures/Stack.js';
import { ParkingSlotModel } from '../models/ParkingSlot.js';
import { WaitingVehicleModel } from '../models/WaitingVehicle.js';
import { ParkingHistoryModel } from '../models/ParkingHistory.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const STATE_FILE = path.join(DATA_DIR, 'parking-state.json');

class ParkingService {
  constructor() {
    this.slotsList = new ParkingSlotLinkedList();
    this.waitingQueue = new WaitingQueue();
    this.historyStack = new ParkingHistoryStack(50);

    this.vehiclesParkedToday = 0;
    this.vehiclesExitedToday = 0;
    this.latestEntry = null;
    this.latestExit = null;

    this.operationLogs = [];
    this.latestOperation = null;
    this.isInitialized = false;
  }

  /**
   * Initialize data structures from MongoDB or local JSON file or default seed.
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      await fs.mkdir(DATA_DIR, { recursive: true });

      // Try loading from MongoDB if connected
      if (mongoose.connection.readyState === 1) {
        const slotsCount = await ParkingSlotModel.countDocuments();
        if (slotsCount > 0) {
          await this.loadFromMongo();
          this.isInitialized = true;
          return;
        }
      }

      // Try loading from local file
      const fileData = await this.readStateFile();
      if (fileData && fileData.slots && fileData.slots.length > 0) {
        this.loadFromSnapshot(fileData);
        this.isInitialized = true;
        return;
      }

      // Fallback: Seed initial realistic state
      this.seedDefaultState();
      await this.persist();
      this.isInitialized = true;
    } catch (err) {
      console.warn('Initialization notice (using default in-memory seed):', err.message);
      this.seedDefaultState();
      this.isInitialized = true;
    }
  }

  seedDefaultState() {
    this.slotsList.clear();
    this.waitingQueue.clear();
    this.historyStack.clear();

    const sampleSlots = [
      { slotId: 'P-01', vehicleNumber: 'KA01AB1234', vehicleType: 'Car', ownerName: 'Aarav Sharma', status: 'OCCUPIED', entryTime: new Date(Date.now() - 105 * 60000).toISOString() },
      { slotId: 'P-02', vehicleNumber: null, vehicleType: null, ownerName: null, status: 'AVAILABLE', entryTime: null },
      { slotId: 'P-03', vehicleNumber: 'KA03XY9988', vehicleType: 'SUV', ownerName: 'Priya Patel', status: 'OCCUPIED', entryTime: new Date(Date.now() - 75 * 60000).toISOString() },
      { slotId: 'P-04', vehicleNumber: 'MH12CD4567', vehicleType: 'EV', ownerName: 'Rohan Deshmukh', status: 'OCCUPIED', entryTime: new Date(Date.now() - 45 * 60000).toISOString() },
      { slotId: 'P-05', vehicleNumber: null, vehicleType: null, ownerName: null, status: 'AVAILABLE', entryTime: null },
      { slotId: 'P-06', vehicleNumber: 'DL04EF3322', vehicleType: 'Car', ownerName: 'Neha Verma', status: 'OCCUPIED', entryTime: new Date(Date.now() - 25 * 60000).toISOString() },
      { slotId: 'P-07', vehicleNumber: null, vehicleType: null, ownerName: null, status: 'AVAILABLE', entryTime: null },
      { slotId: 'P-08', vehicleNumber: 'KA05GH7890', vehicleType: 'Bike', ownerName: 'Vikram Rao', status: 'OCCUPIED', entryTime: new Date(Date.now() - 15 * 60000).toISOString() },
      { slotId: 'P-09', vehicleNumber: null, vehicleType: null, ownerName: null, status: 'AVAILABLE', entryTime: null },
      { slotId: 'P-10', vehicleNumber: 'TN07JK5544', vehicleType: 'SUV', ownerName: 'Kavita Nair', status: 'OCCUPIED', entryTime: new Date(Date.now() - 8 * 60000).toISOString() },
    ];

    for (const slot of sampleSlots) {
      this.slotsList.insertSlot(slot);
    }

    // Seed Waiting Queue
    this.waitingQueue.enqueue({
      vehicleNumber: 'KA09MN4321',
      vehicleType: 'Car',
      ownerName: 'Sunil Kumar',
      waitingSince: new Date(Date.now() - 10 * 60000).toISOString(),
    });
    this.waitingQueue.enqueue({
      vehicleNumber: 'KA04PQ8765',
      vehicleType: 'EV',
      ownerName: 'Ananya Iyer',
      waitingSince: new Date(Date.now() - 3 * 60000).toISOString(),
    });

    // Seed History Stack
    this.historyStack.push({
      vehicleNumber: 'KA02ZZ1111',
      vehicleType: 'Car',
      ownerName: 'Manish Gupta',
      slotId: 'P-02',
      entryTime: new Date(Date.now() - 180 * 60000).toISOString(),
      exitTime: new Date(Date.now() - 30 * 60000).toISOString(),
      durationMinutes: 150,
      fee: 90,
    });
    this.historyStack.push({
      vehicleNumber: 'DL01QQ2233',
      vehicleType: 'Bike',
      ownerName: 'Deepak Joshi',
      slotId: 'P-05',
      entryTime: new Date(Date.now() - 90 * 60000).toISOString(),
      exitTime: new Date(Date.now() - 12 * 60000).toISOString(),
      durationMinutes: 78,
      fee: 20,
    });
    this.historyStack.push({
      vehicleNumber: 'MH02WW4455',
      vehicleType: 'SUV',
      ownerName: 'Sanjay Kapoor',
      slotId: 'P-07',
      entryTime: new Date(Date.now() - 60 * 60000).toISOString(),
      exitTime: new Date(Date.now() - 2 * 60000).toISOString(),
      durationMinutes: 58,
      fee: 40,
    });

    this.vehiclesParkedToday = 8;
    this.vehiclesExitedToday = 3;
    this.latestEntry = {
      vehicleNumber: 'TN07JK5544',
      vehicleType: 'SUV',
      slotId: 'P-10',
      time: new Date(Date.now() - 8 * 60000).toISOString(),
    };
    this.latestExit = {
      vehicleNumber: 'MH02WW4455',
      slotId: 'P-07',
      time: new Date(Date.now() - 2 * 60000).toISOString(),
    };

    this.recordOperation({
      operation: 'SYSTEM_INITIALIZED',
      title: 'Parking System Initialized with Academic DSA Structures',
      dataStructure: 'ALL',
      algorithm: 'Initialization of Singly Linked List, FIFO Queue, and LIFO Stack',
      before: 'System Empty',
      after: `Slots: ${this.slotsList.size}, Waiting: ${this.waitingQueue.getSize()}, History: ${this.historyStack.getSize()}`,
      steps: [
        'Initialized Singly Linked List for Parking Slots (P-01 to P-10)',
        'Linked List Nodes linked sequentially via .next pointer',
        'Initialized WaitingQueue with FRONT and REAR pointers',
        'Initialized ParkingHistoryStack with TOP pointer',
      ],
      timeComplexity: 'O(n) for seeding',
      spaceComplexity: 'O(n) nodes',
    });
  }

  /**
   * Record a detailed DSA operation trace for academic display.
   */
  recordOperation(op) {
    const trace = {
      id: `OP-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      operation: op.operation,
      title: op.title,
      dataStructure: op.dataStructure,
      algorithm: op.algorithm,
      before: op.before,
      after: op.after,
      steps: op.steps || [],
      timeComplexity: op.timeComplexity || 'O(1)',
      spaceComplexity: op.spaceComplexity || 'O(1)',
      linkedListTrace: this.slotsList.toTraceString(),
      queueTrace: this.waitingQueue.toTraceString(),
      stackTrace: this.historyStack.toTraceString(),
    };

    this.latestOperation = trace;
    this.operationLogs.unshift(trace);
    if (this.operationLogs.length > 30) {
      this.operationLogs.pop();
    }
    return trace;
  }

  /**
   * Vehicle Entry Workflow:
   * 1. Check Linked List for first AVAILABLE slot.
   * 2. If slot found:
   *      - Mark slot OCCUPIED in Linked List.
   * 3. If no slot available (parking full):
   *      - Enqueue vehicle into Waiting Queue (FIFO).
   */
  async parkVehicle({ vehicleNumber, vehicleType = 'Car', ownerName = 'Guest' }) {
    if (!vehicleNumber) {
      throw new Error('Vehicle number is required');
    }

    const cleanNum = vehicleNumber.trim().toUpperCase();

    // Check if vehicle is already parked
    const existing = this.slotsList.searchVehicle(cleanNum);
    if (existing.node) {
      throw new Error(`Vehicle ${cleanNum} is already parked in slot ${existing.node.slotId}`);
    }

    const listBeforeTrace = this.slotsList.toTraceString();
    const queueBeforeTrace = this.waitingQueue.toTraceString();

    // Try occupying first available slot in Linked List
    const occupyResult = this.slotsList.occupyFirstAvailable({
      vehicleNumber: cleanNum,
      vehicleType,
      ownerName,
      entryTime: new Date().toISOString(),
    });

    if (occupyResult.node) {
      // Slot was available!
      this.vehiclesParkedToday++;
      this.latestEntry = {
        vehicleNumber: cleanNum,
        vehicleType,
        slotId: occupyResult.node.slotId,
        time: occupyResult.node.entryTime,
      };

      const traceSteps = occupyResult.steps.map(
        (s) =>
          `Slot ${s.slotId}: ${s.selected ? 'AVAILABLE -> ASSIGNED & OCCUPIED' : `${s.status} (traversing to next)`}`
      );

      const opTrace = this.recordOperation({
        operation: 'PARK_VEHICLE',
        title: `Vehicle ${cleanNum} Parked in Slot ${occupyResult.node.slotId}`,
        dataStructure: 'LINKED_LIST',
        algorithm: 'Singly Linked List Traversal & In-Place Node Update',
        before: listBeforeTrace,
        after: this.slotsList.toTraceString(),
        steps: [
          `Starting traversal from Linked List HEAD (${this.slotsList.head ? this.slotsList.head.slotId : 'NULL'})`,
          ...traceSteps,
          `Slot ${occupyResult.node.slotId} updated: status = 'OCCUPIED', vehicleNumber = '${cleanNum}'`,
          `Pointers remain stable; total occupied slots = ${this.slotsList.countOccupied()}/${this.slotsList.size}`,
        ],
        timeComplexity: 'O(n) - Linear traversal to find first available node',
        spaceComplexity: 'O(1) - In-place update of existing node',
      });

      await this.persist();

      return {
        action: 'PARKED',
        message: `Vehicle ${cleanNum} successfully parked in slot ${occupyResult.node.slotId}`,
        slot: occupyResult.node.toJSON(),
        dsaTrace: opTrace,
      };
    }

    // Parking is FULL! Add vehicle to Waiting Queue (FIFO)
    const enqueuedNode = this.waitingQueue.enqueue({
      vehicleNumber: cleanNum,
      vehicleType,
      ownerName,
      waitingSince: new Date().toISOString(),
    });

    const opTrace = this.recordOperation({
      operation: 'WAITING_QUEUE_ENQUEUE',
      title: `Parking Full — Vehicle ${cleanNum} Enqueued to Waiting Queue (FIFO)`,
      dataStructure: 'QUEUE',
      algorithm: 'Queue Enqueue at REAR Pointer',
      before: queueBeforeTrace,
      after: this.waitingQueue.toTraceString(),
      steps: [
        'Traversed entire Linked List: 0 AVAILABLE slots found (All slots OCCUPIED)',
        `Created new QueueNode for vehicle '${cleanNum}'`,
        this.waitingQueue.getSize() === 1
          ? 'Queue was EMPTY: FRONT and REAR now both point to this new node'
          : `REAR.next updated to point to new node; REAR pointer shifted to new node`,
        `Waiting Queue size increased to ${this.waitingQueue.getSize()}`,
      ],
      timeComplexity: 'O(1) - Constant time enqueue using REAR pointer',
      spaceComplexity: 'O(1) - Single QueueNode allocation',
    });

    await this.persist();

    return {
      action: 'QUEUED',
      message: `Parking is full! Vehicle ${cleanNum} added to Waiting Queue at position #${this.waitingQueue.getSize()}`,
      waitingVehicle: enqueuedNode.toJSON(),
      queuePosition: this.waitingQueue.getSize(),
      dsaTrace: opTrace,
    };
  }

  /**
   * Vehicle Exit Workflow:
   * 1. Search Linked List for vehicle.
   * 2. Mark slot AVAILABLE and clear vehicle info.
   * 3. Push exit record to Parking History Stack (LIFO).
   * 4. Check Waiting Queue (FIFO):
   *      - If waiting vehicle exists: Dequeue from FRONT and auto-assign to the freed slot!
   */
  async exitVehicle(vehicleNumber) {
    if (!vehicleNumber) {
      throw new Error('Vehicle number is required');
    }

    const cleanNum = vehicleNumber.trim().toUpperCase();
    const listBeforeTrace = this.slotsList.toTraceString();
    const stackBeforeTrace = this.historyStack.toTraceString();
    const queueBeforeTrace = this.waitingQueue.toTraceString();

    // 1. Search Linked List
    const { node, index, steps } = this.slotsList.searchVehicle(cleanNum);
    if (!node) {
      throw new Error(`Vehicle ${cleanNum} not found in any parking slot`);
    }

    const freedSlotId = node.slotId;
    const { releasedData } = this.slotsList.releaseVehicle(cleanNum);

    // 2. Push to History Stack (LIFO)
    const pushedStackNode = this.historyStack.push({
      vehicleNumber: releasedData.vehicleNumber,
      vehicleType: releasedData.vehicleType,
      ownerName: releasedData.ownerName,
      slotId: releasedData.slotId,
      entryTime: releasedData.entryTime,
      exitTime: releasedData.exitTime,
    });

    this.vehiclesExitedToday++;
    this.latestExit = {
      vehicleNumber: cleanNum,
      slotId: freedSlotId,
      time: releasedData.exitTime,
    };

    const exitOpTrace = this.recordOperation({
      operation: 'EXIT_VEHICLE',
      title: `Vehicle ${cleanNum} Exited from Slot ${freedSlotId} -> Pushed to Stack (LIFO)`,
      dataStructure: 'STACK_AND_LINKED_LIST',
      algorithm: 'Linked List Node Reset & Stack Push to TOP',
      before: `LL: ${listBeforeTrace}\nStack: ${stackBeforeTrace}`,
      after: `LL: ${this.slotsList.toTraceString()}\nStack: ${this.historyStack.toTraceString()}`,
      steps: [
        `Searched Linked List for '${cleanNum}' -> Found at slot ${freedSlotId} (index ${index})`,
        `Reset slot ${freedSlotId} status to 'AVAILABLE'`,
        `Calculated duration: ${pushedStackNode.record.durationMinutes} mins | Fee: ₹${pushedStackNode.record.fee}`,
        `Allocated new StackNode with exit receipt`,
        `Stack pointer update: newNode.next = TOP; TOP = newNode (LIFO Push)`,
        `Stack size is now ${this.historyStack.getSize()}`,
      ],
      timeComplexity: 'O(n) for LL Search + O(1) for Stack Push',
      spaceComplexity: 'O(1) - Single StackNode allocation',
    });

    // 3. Check Waiting Queue (FIFO)
    let autoAssignedVehicle = null;
    let queueOpTrace = null;

    if (!this.waitingQueue.isEmpty()) {
      const dequeuedNode = this.waitingQueue.dequeue();
      const newEntryTime = new Date().toISOString();

      // Assign the newly freed slot to this dequeued vehicle
      this.slotsList.updateSlot(freedSlotId, {
        status: 'OCCUPIED',
        vehicleNumber: dequeuedNode.vehicleNumber,
        vehicleType: dequeuedNode.vehicleType,
        ownerName: dequeuedNode.ownerName,
        entryTime: newEntryTime,
      });

      this.vehiclesParkedToday++;
      this.latestEntry = {
        vehicleNumber: dequeuedNode.vehicleNumber,
        vehicleType: dequeuedNode.vehicleType,
        slotId: freedSlotId,
        time: newEntryTime,
      };

      autoAssignedVehicle = {
        vehicleNumber: dequeuedNode.vehicleNumber,
        vehicleType: dequeuedNode.vehicleType,
        ownerName: dequeuedNode.ownerName,
        slotId: freedSlotId,
        entryTime: newEntryTime,
      };

      queueOpTrace = this.recordOperation({
        operation: 'AUTO_ASSIGN_FROM_QUEUE',
        title: `Auto-Assigned Waiting Vehicle ${dequeuedNode.vehicleNumber} to Freed Slot ${freedSlotId}`,
        dataStructure: 'QUEUE_AND_LINKED_LIST',
        algorithm: 'Queue Dequeue (FIFO) & Linked List Slot Allocation',
        before: queueBeforeTrace,
        after: this.waitingQueue.toTraceString(),
        steps: [
          `Detected vehicle '${dequeuedNode.vehicleNumber}' at FRONT of Waiting Queue`,
          `Queue Dequeue: FRONT pointer advanced to FRONT.next; queue size reduced to ${this.waitingQueue.getSize()}`,
          `Slot ${freedSlotId} reallocated to '${dequeuedNode.vehicleNumber}'`,
          `Linked List node updated: status = 'OCCUPIED'`,
        ],
        timeComplexity: 'O(1) for Queue Dequeue + O(1) for direct slot update',
        spaceComplexity: 'O(1)',
      });
    }

    await this.persist();

    return {
      message: `Vehicle ${cleanNum} exited from slot ${freedSlotId}. Exit record pushed to Stack.`,
      freedSlotId,
      receipt: pushedStackNode.toJSON(),
      autoAssignedVehicle,
      dsaTrace: exitOpTrace,
      queueTrace: queueOpTrace,
    };
  }

  /**
   * Search Vehicle by Number.
   * Returns matching slot or not found, along with complete Linked List traversal steps.
   */
  searchVehicle(vehicleNumber) {
    if (!vehicleNumber) {
      throw new Error('Vehicle number is required');
    }

    const { node, index, steps } = this.slotsList.searchVehicle(vehicleNumber);

    const trace = {
      query: vehicleNumber.trim().toUpperCase(),
      found: node !== null,
      slot: node ? node.toJSON() : null,
      traversalSteps: steps,
      timeComplexity: 'O(n) - Linear traversal from HEAD to target or NULL',
      spaceComplexity: 'O(1)',
    };

    return trace;
  }

  /**
   * Admin: Add a new parking slot to Linked List.
   */
  async addSlot(slotId) {
    if (!slotId) throw new Error('Slot ID is required (e.g. P-11)');
    const cleanId = slotId.trim().toUpperCase();

    // Check if slotId already exists
    const exists = this.slotsList.searchSlot(cleanId);
    if (exists.node) {
      throw new Error(`Slot ${cleanId} already exists`);
    }

    const listBefore = this.slotsList.toTraceString();
    const newNode = this.slotsList.insertSlot({ slotId: cleanId });

    const opTrace = this.recordOperation({
      operation: 'INSERT_SLOT',
      title: `New Parking Slot ${cleanId} Appended to Linked List`,
      dataStructure: 'LINKED_LIST',
      algorithm: 'Insert Node at Tail of Singly Linked List',
      before: listBefore,
      after: this.slotsList.toTraceString(),
      steps: [
        `Instantiated new ParkingSlotNode(slotId = '${cleanId}', status = 'AVAILABLE')`,
        `Traversed from HEAD to final node`,
        `Assigned lastNode.next = newNode`,
        `Linked List size incremented to ${this.slotsList.size}`,
      ],
      timeComplexity: 'O(n) traversal to end of list',
      spaceComplexity: 'O(1) node allocation',
    });

    // If waiting queue has vehicles, auto-assign this new slot!
    let autoAssigned = null;
    if (!this.waitingQueue.isEmpty()) {
      const dequeued = this.waitingQueue.dequeue();
      const entryTime = new Date().toISOString();
      newNode.status = 'OCCUPIED';
      newNode.vehicleNumber = dequeued.vehicleNumber;
      newNode.vehicleType = dequeued.vehicleType;
      newNode.ownerName = dequeued.ownerName;
      newNode.entryTime = entryTime;

      autoAssigned = {
        vehicleNumber: dequeued.vehicleNumber,
        slotId: cleanId,
      };
    }

    await this.persist();
    return { slot: newNode.toJSON(), autoAssigned, dsaTrace: opTrace };
  }

  /**
   * Admin: Delete a parking slot from Linked List.
   */
  async deleteSlot(slotId) {
    if (!slotId) throw new Error('Slot ID is required');
    const cleanId = slotId.trim().toUpperCase();

    const target = this.slotsList.searchSlot(cleanId);
    if (!target.node) {
      throw new Error(`Slot ${cleanId} does not exist`);
    }

    if (target.node.status === 'OCCUPIED') {
      throw new Error(`Cannot delete slot ${cleanId} because vehicle ${target.node.vehicleNumber} is currently parked in it`);
    }

    const listBefore = this.slotsList.toTraceString();
    const deletedNode = this.slotsList.deleteSlot(cleanId);

    const opTrace = this.recordOperation({
      operation: 'DELETE_SLOT',
      title: `Parking Slot ${cleanId} Removed from Linked List`,
      dataStructure: 'LINKED_LIST',
      algorithm: 'Delete Node & Rewire Pointers in Singly Linked List',
      before: listBefore,
      after: this.slotsList.toTraceString(),
      steps: [
        `Searched for slot ${cleanId} in Linked List`,
        `Updated prev.next = current.next (bypassing deleted node)`,
        `Freed node ${cleanId}`,
        `Linked List size decremented to ${this.slotsList.size}`,
      ],
      timeComplexity: 'O(n) traversal to find node',
      spaceComplexity: 'O(1)',
    });

    await this.persist();
    return { deletedSlotId: cleanId, dsaTrace: opTrace };
  }

  /**
   * Admin: Pop latest record from Stack.
   */
  async popHistory() {
    if (this.historyStack.isEmpty()) {
      throw new Error('Parking History Stack is empty');
    }

    const stackBefore = this.historyStack.toTraceString();
    const poppedNode = this.historyStack.pop();

    const opTrace = this.recordOperation({
      operation: 'POP_STACK',
      title: `Popped Latest Exit Record (${poppedNode.record.vehicleNumber}) from Stack (LIFO)`,
      dataStructure: 'STACK',
      algorithm: 'Stack Pop from TOP Pointer',
      before: stackBefore,
      after: this.historyStack.toTraceString(),
      steps: [
        `Inspected TOP node: Vehicle '${poppedNode.record.vehicleNumber}'`,
        `Advanced TOP pointer: TOP = TOP.next`,
        `Stack size reduced to ${this.historyStack.getSize()}`,
      ],
      timeComplexity: 'O(1) - Constant time pop from TOP',
      spaceComplexity: 'O(1)',
    });

    await this.persist();
    return { poppedRecord: poppedNode.toJSON(), dsaTrace: opTrace };
  }

  /**
   * Admin: Clear history stack.
   */
  async clearHistory() {
    this.historyStack.clear();
    const opTrace = this.recordOperation({
      operation: 'CLEAR_STACK',
      title: 'Parking History Stack Cleared',
      dataStructure: 'STACK',
      algorithm: 'Reset TOP Pointer to NULL',
      before: 'Stack with records',
      after: 'TOP -> [EMPTY STACK]',
      steps: ['TOP pointer set to null', 'Stack size reset to 0'],
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
    });
    await this.persist();
    return { message: 'History cleared', dsaTrace: opTrace };
  }

  /**
   * Remove a waiting vehicle from queue (cancellation).
   */
  async removeWaitingVehicle(vehicleNumber) {
    if (!vehicleNumber) throw new Error('Vehicle number required');
    const removed = this.waitingQueue.removeVehicle(vehicleNumber);
    if (!removed) throw new Error(`Vehicle ${vehicleNumber} not found in waiting queue`);

    await this.persist();
    return { removedVehicle: removed.toJSON(), queueSize: this.waitingQueue.getSize() };
  }

  /**
   * Get all slots in Linked List order.
   */
  getAllSlots() {
    return this.slotsList.toArray();
  }

  /**
   * Get waiting queue list from FRONT to REAR.
   */
  getWaitingQueue() {
    return this.waitingQueue.toArray();
  }

  /**
   * Get parking history list from TOP down to bottom.
   */
  getParkingHistory() {
    return this.historyStack.toArray();
  }

  /**
   * Get full dashboard statistics.
   */
  getStats() {
    const totalSlots = this.slotsList.size;
    const occupiedSlots = this.slotsList.countOccupied();
    const availableSlots = this.slotsList.countAvailable();
    const waitingCount = this.waitingQueue.getSize();
    const historyCount = this.historyStack.getSize();
    const occupancyPercent = totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0;

    return {
      totalSlots,
      availableSlots,
      occupiedSlots,
      waitingVehicles: waitingCount,
      historyRecords: historyCount,
      vehiclesParkedToday: this.vehiclesParkedToday,
      vehiclesExitedToday: this.vehiclesExitedToday,
      occupancyPercent,
      latestEntry: this.latestEntry,
      latestExit: this.latestExit,
      status: occupancyPercent >= 100 ? 'FULL' : occupancyPercent >= 80 ? 'HIGH' : 'NORMAL',
    };
  }

  /**
   * Get complete live DSA snapshot for visualization page & panels.
   */
  getDsaState() {
    return {
      linkedList: {
        head: this.slotsList.head ? this.slotsList.head.slotId : null,
        size: this.slotsList.size,
        nodes: this.slotsList.toArray(),
        traceString: this.slotsList.toTraceString(),
      },
      queue: {
        front: this.waitingQueue.front ? this.waitingQueue.front.vehicleNumber : null,
        rear: this.waitingQueue.rear ? this.waitingQueue.rear.vehicleNumber : null,
        size: this.waitingQueue.getSize(),
        items: this.waitingQueue.toArray(),
        traceString: this.waitingQueue.toTraceString(),
      },
      stack: {
        top: this.historyStack.top ? this.historyStack.top.record.vehicleNumber : null,
        size: this.historyStack.getSize(),
        items: this.historyStack.toArray(),
        traceString: this.historyStack.toTraceString(),
      },
      latestOperation: this.latestOperation,
      recentOperations: this.operationLogs.slice(0, 10),
      stats: this.getStats(),
    };
  }

  /**
   * Reset system or apply seed presets.
   */
  async resetSystem(preset = 'DEFAULT') {
    if (preset === 'EMPTY') {
      this.slotsList.clear();
      for (let i = 1; i <= 6; i++) {
        this.slotsList.insertSlot({ slotId: `P-0${i}` });
      }
      this.waitingQueue.clear();
      this.historyStack.clear();
      this.vehiclesParkedToday = 0;
      this.vehiclesExitedToday = 0;
      this.latestEntry = null;
      this.latestExit = null;
    } else {
      this.seedDefaultState();
    }

    const opTrace = this.recordOperation({
      operation: 'SYSTEM_RESET',
      title: `Parking System Reset (Preset: ${preset})`,
      dataStructure: 'ALL',
      algorithm: 'Complete State Reinitialization',
      before: 'Previous State',
      after: `Slots: ${this.slotsList.size}, Available: ${this.slotsList.countAvailable()}`,
      steps: ['Reset Linked List', 'Cleared Queue', 'Cleared Stack', 'Counters Reset'],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
    });

    await this.persist();
    return { message: `System reset to ${preset} preset`, dsaTrace: opTrace };
  }

  /**
   * Persist state to MongoDB (if connected) and local JSON file.
   */
  async persist() {
    const snapshot = {
      slots: this.slotsList.toArray(),
      queue: this.waitingQueue.toArray(),
      history: this.historyStack.toArray(),
      stats: {
        vehiclesParkedToday: this.vehiclesParkedToday,
        vehiclesExitedToday: this.vehiclesExitedToday,
        latestEntry: this.latestEntry,
        latestExit: this.latestExit,
      },
      savedAt: new Date().toISOString(),
    };

    // 1. Write to local JSON file
    try {
      await fs.writeFile(STATE_FILE, JSON.stringify(snapshot, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write local state file:', err.message);
    }

    // 2. Write to MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        await Promise.all([
          ParkingSlotModel.deleteMany({}),
          WaitingVehicleModel.deleteMany({}),
          ParkingHistoryModel.deleteMany({}),
        ]);

        const slotDocs = snapshot.slots.map((s, idx) => ({
          slotId: s.slotId,
          vehicleNumber: s.vehicleNumber,
          vehicleType: s.vehicleType,
          ownerName: s.ownerName,
          entryTime: s.entryTime,
          status: s.status,
          orderIndex: idx,
        }));

        const queueDocs = snapshot.queue.map((q, idx) => ({
          vehicleNumber: q.vehicleNumber,
          vehicleType: q.vehicleType,
          ownerName: q.ownerName,
          waitingSince: q.waitingSince,
          queuePosition: idx + 1,
        }));

        const historyDocs = snapshot.history.map((h, idx) => ({
          vehicleNumber: h.vehicleNumber,
          vehicleType: h.vehicleType,
          ownerName: h.ownerName,
          slotId: h.slotId,
          entryTime: h.entryTime,
          exitTime: h.exitTime,
          durationMinutes: h.durationMinutes,
          fee: h.fee,
          stackDepth: idx + 1,
        }));

        if (slotDocs.length > 0) await ParkingSlotModel.insertMany(slotDocs);
        if (queueDocs.length > 0) await WaitingVehicleModel.insertMany(queueDocs);
        if (historyDocs.length > 0) await ParkingHistoryModel.insertMany(historyDocs);
      } catch (err) {
        console.warn('MongoDB sync warning:', err.message);
      }
    }
  }

  async readStateFile() {
    try {
      const data = await fs.readFile(STATE_FILE, 'utf-8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  loadFromSnapshot(data) {
    this.slotsList.clear();
    this.waitingQueue.clear();
    this.historyStack.clear();

    if (data.slots && Array.isArray(data.slots)) {
      for (const s of data.slots) {
        this.slotsList.insertSlot(s);
      }
    }

    if (data.queue && Array.isArray(data.queue)) {
      for (const q of data.queue) {
        this.waitingQueue.enqueue(q);
      }
    }

    if (data.history && Array.isArray(data.history)) {
      // Stack items in array are top-to-bottom, so push in reverse order to preserve top
      const reversed = [...data.history].reverse();
      for (const h of reversed) {
        this.historyStack.push(h);
      }
    }

    if (data.stats) {
      this.vehiclesParkedToday = data.stats.vehiclesParkedToday || 0;
      this.vehiclesExitedToday = data.stats.vehiclesExitedToday || 0;
      this.latestEntry = data.stats.latestEntry || null;
      this.latestExit = data.stats.latestExit || null;
    }
  }

  async loadFromMongo() {
    const slots = await ParkingSlotModel.find().sort({ orderIndex: 1 });
    const queue = await WaitingVehicleModel.find().sort({ queuePosition: 1 });
    const history = await ParkingHistoryModel.find().sort({ stackDepth: 1 });

    this.slotsList.clear();
    for (const s of slots) {
      this.slotsList.insertSlot({
        slotId: s.slotId,
        vehicleNumber: s.vehicleNumber,
        vehicleType: s.vehicleType,
        ownerName: s.ownerName,
        entryTime: s.entryTime ? s.entryTime.toISOString() : null,
        status: s.status,
      });
    }

    this.waitingQueue.clear();
    for (const q of queue) {
      this.waitingQueue.enqueue({
        vehicleNumber: q.vehicleNumber,
        vehicleType: q.vehicleType,
        ownerName: q.ownerName,
        waitingSince: q.waitingSince ? q.waitingSince.toISOString() : null,
      });
    }

    this.historyStack.clear();
    const revHistory = [...history].reverse();
    for (const h of revHistory) {
      this.historyStack.push({
        vehicleNumber: h.vehicleNumber,
        vehicleType: h.vehicleType,
        ownerName: h.ownerName,
        slotId: h.slotId,
        entryTime: h.entryTime ? h.entryTime.toISOString() : null,
        exitTime: h.exitTime ? h.exitTime.toISOString() : null,
        durationMinutes: h.durationMinutes,
        fee: h.fee,
      });
    }
  }
}

export const parkingService = new ParkingService();
