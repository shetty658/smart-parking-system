/**
 * ============================================================================
 * Stack Implementation for Parking History / Recent Exit (LIFO)
 * ============================================================================
 * Maintains a Last-In-First-Out (LIFO) stack of all exited vehicles.
 * The most recently exited vehicle sits at the TOP of the stack.
 *
 * Pointers:
 *   - TOP: Points to the most recently exited vehicle record.
 *   - next: Each node points to the node below it in the stack.
 *
 * Time Complexities:
 *   - Push: O(1)
 *   - Pop: O(1)
 *   - Peek: O(1)
 *   - IsEmpty: O(1)
 *   - Size: O(1)
 * Space Complexity: O(m) where m is the number of history records.
 */

export class StackNode {
  constructor(record) {
    this.record = {
      id: record.id || `EXIT-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      vehicleNumber: record.vehicleNumber.trim().toUpperCase(),
      vehicleType: record.vehicleType || 'Car',
      ownerName: record.ownerName || 'Guest',
      slotId: record.slotId || 'Unknown',
      entryTime: record.entryTime,
      exitTime: record.exitTime || new Date().toISOString(),
      durationMinutes: record.durationMinutes ?? this.calculateDuration(record.entryTime, record.exitTime),
      fee: record.fee ?? this.calculateFee(record.durationMinutes, record.vehicleType),
    };
    this.next = null; // Pointer to node below in the stack
  }

  calculateDuration(entryTime, exitTime) {
    if (!entryTime) return 15; // default fallback
    const start = new Date(entryTime).getTime();
    const end = exitTime ? new Date(exitTime).getTime() : Date.now();
    const diffMs = Math.max(0, end - start);
    return Math.max(1, Math.round(diffMs / (1000 * 60)));
  }

  calculateFee(durationMinutes, vehicleType) {
    const ratesPerHour = {
      Bike: 10,
      Car: 30,
      SUV: 40,
      EV: 25,
      Truck: 60,
    };
    const rate = ratesPerHour[vehicleType] || 30;
    const hours = Math.ceil((durationMinutes || 15) / 60);
    return hours * rate;
  }

  toJSON() {
    return {
      ...this.record,
      hasNext: this.next !== null,
    };
  }
}

export class ParkingHistoryStack {
  constructor(maxCapacity = 100) {
    this.top = null;
    this.size = 0;
    this.maxCapacity = maxCapacity; // Prevent unbounded memory growth if desired
  }

  /**
   * Push a newly exited vehicle record to the TOP of the stack.
   * Time Complexity: O(1)
   */
  push(record) {
    const newNode = new StackNode(record);
    newNode.next = this.top;
    this.top = newNode;
    this.size++;

    // Optional capacity trimming at the very bottom
    if (this.size > this.maxCapacity) {
      this.trimBottom();
    }

    return newNode;
  }

  /**
   * Pop the latest record from TOP of the stack (e.g. Undo exit or inspect).
   * Time Complexity: O(1)
   */
  pop() {
    if (this.isEmpty()) {
      return null;
    }

    const poppedNode = this.top;
    this.top = this.top.next;
    this.size--;

    return poppedNode;
  }

  /**
   * Peek at the latest exit record at TOP without removing it.
   * Time Complexity: O(1)
   */
  peek() {
    return this.top ? this.top.toJSON() : null;
  }

  /**
   * Check if stack is empty.
   * Time Complexity: O(1)
   */
  isEmpty() {
    return this.size === 0 || this.top === null;
  }

  /**
   * Get stack size.
   * Time Complexity: O(1)
   */
  getSize() {
    return this.size;
  }

  /**
   * Convert stack to array from TOP down to bottom.
   */
  toArray() {
    const list = [];
    let current = this.top;
    let depth = 1;

    while (current !== null) {
      list.push({
        depth,
        isTop: depth === 1,
        ...current.record,
      });
      current = current.next;
      depth++;
    }

    return list;
  }

  /**
   * Formats a text visualization of the Stack for academic demonstration.
   */
  toTraceString() {
    if (this.isEmpty()) return 'TOP -> [EMPTY STACK]';

    const items = [];
    let current = this.top;
    while (current !== null) {
      items.push(`[${current.record.vehicleNumber}]`);
      current = current.next;
    }

    return `TOP -> ${items.join(' -> ')} -> BOTTOM`;
  }

  /**
   * Trim bottom if capacity exceeded (maintains O(n) worst-case only when max exceeded).
   */
  trimBottom() {
    let current = this.top;
    for (let i = 1; i < this.maxCapacity && current !== null; i++) {
      current = current.next;
    }
    if (current) {
      current.next = null;
      this.size = this.maxCapacity;
    }
  }

  /**
   * Clear all records in the stack.
   */
  clear() {
    this.top = null;
    this.size = 0;
  }
}
