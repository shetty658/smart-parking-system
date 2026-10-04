/**
 * ============================================================================
 * Queue Implementation for Waiting Vehicle Management (FIFO)
 * ============================================================================
 * When all parking slots in the facility are OCCUPIED, newly arriving vehicles
 * enter a First-In-First-Out (FIFO) Waiting Queue.
 *
 * Pointers:
 *   - FRONT: Points to the first vehicle in queue (next to be allocated a slot).
 *   - REAR: Points to the latest vehicle added to the queue.
 *
 * Time Complexities:
 *   - Enqueue: O(1)
 *   - Dequeue: O(1)
 *   - Peek: O(1)
 *   - IsEmpty: O(1)
 *   - Size: O(1)
 *   - Remove by Vehicle Number (cancellation): O(n)
 * Space Complexity: O(k) where k is the number of waiting vehicles.
 */

export class QueueNode {
  constructor({ vehicleNumber, vehicleType = 'Car', ownerName = 'Guest', waitingSince = null }) {
    this.vehicleNumber = vehicleNumber.trim().toUpperCase();
    this.vehicleType = vehicleType;
    this.ownerName = ownerName;
    this.waitingSince = waitingSince || new Date().toISOString();
    this.id = `WAIT-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    this.next = null; // Pointer to next node towards REAR
  }

  toJSON() {
    return {
      id: this.id,
      vehicleNumber: this.vehicleNumber,
      vehicleType: this.vehicleType,
      ownerName: this.ownerName,
      waitingSince: this.waitingSince,
      hasNext: this.next !== null,
    };
  }
}

export class WaitingQueue {
  constructor() {
    this.front = null;
    this.rear = null;
    this.size = 0;
  }

  /**
   * Enqueue a waiting vehicle at the REAR of the queue.
   * Time Complexity: O(1)
   */
  enqueue(vehicleData) {
    const newNode = new QueueNode(vehicleData);

    if (this.isEmpty()) {
      this.front = newNode;
      this.rear = newNode;
    } else {
      this.rear.next = newNode;
      this.rear = newNode;
    }

    this.size++;
    return newNode;
  }

  /**
   * Dequeue the first vehicle from the FRONT of the queue.
   * Time Complexity: O(1)
   */
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }

    const removedNode = this.front;
    this.front = this.front.next;

    // If queue is now empty, rear must also become null
    if (this.front === null) {
      this.rear = null;
    }

    this.size--;
    return removedNode;
  }

  /**
   * Peek at the front vehicle without removing it.
   * Time Complexity: O(1)
   */
  peek() {
    return this.front ? this.front.toJSON() : null;
  }

  /**
   * Check if queue is empty.
   * Time Complexity: O(1)
   */
  isEmpty() {
    return this.size === 0 || this.front === null;
  }

  /**
   * Get queue size.
   * Time Complexity: O(1)
   */
  getSize() {
    return this.size;
  }

  /**
   * Remove a specific waiting vehicle if they leave early.
   * Time Complexity: O(n)
   */
  removeVehicle(vehicleNumber) {
    if (this.isEmpty()) return null;

    const cleanNum = vehicleNumber.trim().toUpperCase();

    // Case 1: Target is at FRONT
    if (this.front.vehicleNumber === cleanNum) {
      return this.dequeue();
    }

    // Case 2: Traverse
    let prev = this.front;
    let current = this.front.next;

    while (current !== null) {
      if (current.vehicleNumber === cleanNum) {
        prev.next = current.next;

        // If target was REAR, update REAR to prev
        if (current === this.rear) {
          this.rear = prev;
        }

        this.size--;
        return current;
      }
      prev = current;
      current = current.next;
    }

    return null;
  }

  /**
   * Convert waiting queue to array for UI display and serialization.
   */
  toArray() {
    const list = [];
    let current = this.front;
    let position = 1;

    while (current !== null) {
      list.push({
        position,
        id: current.id,
        vehicleNumber: current.vehicleNumber,
        vehicleType: current.vehicleType,
        ownerName: current.ownerName,
        waitingSince: current.waitingSince,
        isFront: position === 1,
        isRear: current.next === null,
      });
      current = current.next;
      position++;
    }

    return list;
  }

  /**
   * Formats a text visualization of the Queue for academic demonstration.
   */
  toTraceString() {
    if (this.isEmpty()) return 'FRONT -> [EMPTY QUEUE] <- REAR';

    const items = [];
    let current = this.front;
    while (current !== null) {
      items.push(`[${current.vehicleNumber}]`);
      current = current.next;
    }

    return `FRONT -> ${items.join(' -> ')} <- REAR`;
  }

  /**
   * Clear all waiting vehicles.
   */
  clear() {
    this.front = null;
    this.rear = null;
    this.size = 0;
  }
}
