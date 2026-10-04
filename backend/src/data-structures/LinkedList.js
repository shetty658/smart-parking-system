/**
 * ============================================================================
 * Linked List Implementation for Parking Slot Management
 * ============================================================================
 * Each parking slot in the facility is represented as a Node in a Singly Linked List.
 * Pointers:
 *   - HEAD: points to the first parking slot node.
 *   - next: each node points to the subsequent parking slot node (or null for the last).
 *
 * Time Complexities:
 *   - Insertion at Tail / Head: O(1) with tail pointer / O(n) traversal
 *   - Deletion by Slot ID: O(n) traversal to find node and rewire pointers
 *   - Search Slot by ID: O(n) linear search
 *   - Search Vehicle by Number: O(n) linear search
 *   - Update Slot: O(n) linear search + O(1) update
 *   - Display / Serialization: O(n)
 * Space Complexity: O(n) for n parking slots.
 */

export class ParkingSlotNode {
  constructor({
    slotId,
    vehicleNumber = null,
    vehicleType = null,
    ownerName = null,
    entryTime = null,
    status = 'AVAILABLE',
  }) {
    this.slotId = slotId;                     // e.g. "P-01"
    this.vehicleNumber = vehicleNumber;       // e.g. "KA01AB1234"
    this.vehicleType = vehicleType;           // "Car", "Bike", "SUV", "EV", "Truck"
    this.ownerName = ownerName;               // e.g. "John Doe"
    this.entryTime = entryTime;               // ISO Timestamp or string
    this.status = status;                     // "AVAILABLE" | "OCCUPIED" | "RESERVED"
    this.next = null;                         // Pointer to next ParkingSlotNode
  }

  toJSON() {
    return {
      slotId: this.slotId,
      vehicleNumber: this.vehicleNumber,
      vehicleType: this.vehicleType,
      ownerName: this.ownerName,
      entryTime: this.entryTime,
      status: this.status,
      hasNext: this.next !== null,
    };
  }
}

export class ParkingSlotLinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  /**
   * Insert a new parking slot at the end of the Linked List.
   * Time Complexity: O(n) or O(1) if empty.
   */
  insertSlot(slotData) {
    const newNode = new ParkingSlotNode(slotData);

    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next !== null) {
        current = current.next;
      }
      current.next = newNode;
    }

    this.size++;
    return newNode;
  }

  /**
   * Delete a parking slot by slotId.
   * Rewires prev.next = current.next
   * Time Complexity: O(n)
   */
  deleteSlot(slotId) {
    if (!this.head) return null;

    // Case 1: Slot to delete is HEAD
    if (this.head.slotId === slotId) {
      const deletedNode = this.head;
      this.head = this.head.next;
      this.size--;
      return deletedNode;
    }

    // Case 2: Traverse to find slot
    let prev = this.head;
    let current = this.head.next;

    while (current !== null) {
      if (current.slotId === slotId) {
        prev.next = current.next;
        this.size--;
        return current;
      }
      prev = current;
      current = current.next;
    }

    return null; // Not found
  }

  /**
   * Search for a slot by slotId.
   * Returns { node, index, steps } for visualization trace.
   * Time Complexity: O(n)
   */
  searchSlot(slotId) {
    let current = this.head;
    let index = 0;
    const steps = [];

    while (current !== null) {
      steps.push({
        index,
        slotId: current.slotId,
        match: current.slotId === slotId,
      });

      if (current.slotId === slotId) {
        return { node: current, index, steps };
      }
      current = current.next;
      index++;
    }

    return { node: null, index: -1, steps };
  }

  /**
   * Search for a vehicle by vehicleNumber.
   * Returns { node, index, steps } for visual animation.
   * Time Complexity: O(n)
   */
  searchVehicle(vehicleNumber) {
    if (!vehicleNumber) return { node: null, index: -1, steps: [] };

    const cleanQuery = vehicleNumber.trim().toUpperCase();
    let current = this.head;
    let index = 0;
    const steps = [];

    while (current !== null) {
      const isMatch =
        current.status === 'OCCUPIED' &&
        current.vehicleNumber &&
        current.vehicleNumber.toUpperCase() === cleanQuery;

      steps.push({
        index,
        slotId: current.slotId,
        checkedVehicle: current.vehicleNumber || 'EMPTY',
        match: isMatch,
      });

      if (isMatch) {
        return { node: current, index, steps };
      }
      current = current.next;
      index++;
    }

    return { node: null, index: -1, steps };
  }

  /**
   * Update an existing slot's metadata.
   * Time Complexity: O(n)
   */
  updateSlot(slotId, updateData) {
    const { node } = this.searchSlot(slotId);
    if (!node) return null;

    if (updateData.status !== undefined) node.status = updateData.status;
    if (updateData.vehicleNumber !== undefined) node.vehicleNumber = updateData.vehicleNumber;
    if (updateData.vehicleType !== undefined) node.vehicleType = updateData.vehicleType;
    if (updateData.ownerName !== undefined) node.ownerName = updateData.ownerName;
    if (updateData.entryTime !== undefined) node.entryTime = updateData.entryTime;

    return node;
  }

  /**
   * Find the first AVAILABLE slot and occupy it with vehicle details.
   * Time Complexity: O(n)
   */
  occupyFirstAvailable({ vehicleNumber, vehicleType, ownerName, entryTime }) {
    let current = this.head;
    let index = 0;
    const steps = [];

    while (current !== null) {
      const isAvailable = current.status === 'AVAILABLE';
      steps.push({
        index,
        slotId: current.slotId,
        status: current.status,
        selected: isAvailable,
      });

      if (isAvailable) {
        current.status = 'OCCUPIED';
        current.vehicleNumber = vehicleNumber.trim().toUpperCase();
        current.vehicleType = vehicleType || 'Car';
        current.ownerName = ownerName || 'Unknown Owner';
        current.entryTime = entryTime || new Date().toISOString();

        return { node: current, index, steps };
      }

      current = current.next;
      index++;
    }

    return { node: null, index: -1, steps }; // Parking full
  }

  /**
   * Release a slot by vehicle number (sets status to AVAILABLE and clears vehicle details).
   * Time Complexity: O(n)
   */
  releaseVehicle(vehicleNumber) {
    const { node, index, steps } = this.searchVehicle(vehicleNumber);
    if (!node) return { releasedData: null, node: null, steps };

    const releasedData = {
      slotId: node.slotId,
      vehicleNumber: node.vehicleNumber,
      vehicleType: node.vehicleType,
      ownerName: node.ownerName,
      entryTime: node.entryTime,
      exitTime: new Date().toISOString(),
    };

    // Mark slot as AVAILABLE
    node.status = 'AVAILABLE';
    node.vehicleNumber = null;
    node.vehicleType = null;
    node.ownerName = null;
    node.entryTime = null;

    return { releasedData, node, steps };
  }

  /**
   * Release a specific slot by slotId directly.
   */
  releaseSlot(slotId) {
    const { node } = this.searchSlot(slotId);
    if (!node || node.status !== 'OCCUPIED') return null;

    const releasedData = {
      slotId: node.slotId,
      vehicleNumber: node.vehicleNumber,
      vehicleType: node.vehicleType,
      ownerName: node.ownerName,
      entryTime: node.entryTime,
      exitTime: new Date().toISOString(),
    };

    node.status = 'AVAILABLE';
    node.vehicleNumber = null;
    node.vehicleType = null;
    node.ownerName = null;
    node.entryTime = null;

    return releasedData;
  }

  /**
   * Count available slots.
   */
  countAvailable() {
    let count = 0;
    let current = this.head;
    while (current !== null) {
      if (current.status === 'AVAILABLE') count++;
      current = current.next;
    }
    return count;
  }

  /**
   * Count occupied slots.
   */
  countOccupied() {
    let count = 0;
    let current = this.head;
    while (current !== null) {
      if (current.status === 'OCCUPIED') count++;
      current = current.next;
    }
    return count;
  }

  /**
   * Convert linked list to an array of objects for API responses & UI rendering.
   */
  toArray() {
    const array = [];
    let current = this.head;
    let index = 0;

    while (current !== null) {
      array.push({
        index,
        slotId: current.slotId,
        vehicleNumber: current.vehicleNumber,
        vehicleType: current.vehicleType,
        ownerName: current.ownerName,
        entryTime: current.entryTime,
        status: current.status,
        nextSlotId: current.next ? current.next.slotId : null,
      });
      current = current.next;
      index++;
    }

    return array;
  }

  /**
   * Formats a text visualization of the Linked List for academic demonstration.
   */
  toTraceString() {
    if (!this.head) return 'HEAD -> NULL';

    const parts = ['HEAD'];
    let current = this.head;

    while (current !== null) {
      const info =
        current.status === 'OCCUPIED'
          ? `[${current.slotId}: ${current.vehicleNumber}]`
          : `[${current.slotId}: FREE]`;
      parts.push(info);
      current = current.next;
    }

    parts.push('NULL');
    return parts.join(' -> ');
  }

  /**
   * Clear all slots.
   */
  clear() {
    this.head = null;
    this.size = 0;
  }
}
