import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ParkingSlotLinkedList } from '../src/data-structures/LinkedList.js';
import { WaitingQueue } from '../src/data-structures/Queue.js';
import { ParkingHistoryStack } from '../src/data-structures/Stack.js';

describe('1. ParkingSlotLinkedList Tests', () => {
  it('should insert parking slots and maintain order and size', () => {
    const list = new ParkingSlotLinkedList();
    assert.equal(list.size, 0);

    const s1 = list.insertSlot({ slotId: 'P-01' });
    const s2 = list.insertSlot({ slotId: 'P-02' });
    const s3 = list.insertSlot({ slotId: 'P-03' });

    assert.equal(list.size, 3);
    assert.equal(list.head.slotId, 'P-01');
    assert.equal(list.head.next.slotId, 'P-02');
    assert.equal(list.head.next.next.slotId, 'P-03');
    assert.equal(list.head.next.next.next, null);
    assert.equal(list.countAvailable(), 3);
    assert.equal(list.countOccupied(), 0);
  });

  it('should occupy first available slot and update status', () => {
    const list = new ParkingSlotLinkedList();
    list.insertSlot({ slotId: 'P-01' });
    list.insertSlot({ slotId: 'P-02' });

    const result = list.occupyFirstAvailable({
      vehicleNumber: 'KA01AB1234',
      vehicleType: 'Car',
      ownerName: 'Alice',
    });

    assert.ok(result.node);
    assert.equal(result.node.slotId, 'P-01');
    assert.equal(result.node.status, 'OCCUPIED');
    assert.equal(result.node.vehicleNumber, 'KA01AB1234');
    assert.equal(list.countAvailable(), 1);
    assert.equal(list.countOccupied(), 1);

    // Next vehicle should occupy P-02
    const result2 = list.occupyFirstAvailable({
      vehicleNumber: 'KA02CD5678',
      vehicleType: 'SUV',
      ownerName: 'Bob',
    });
    assert.equal(result2.node.slotId, 'P-02');
    assert.equal(list.countAvailable(), 0);
    assert.equal(list.countOccupied(), 2);

    // Third attempt should return null (parking full)
    const result3 = list.occupyFirstAvailable({
      vehicleNumber: 'KA03EF9012',
      vehicleType: 'Bike',
      ownerName: 'Charlie',
    });
    assert.equal(result3.node, null);
  });

  it('should search vehicle by vehicle number and return step-by-step trace', () => {
    const list = new ParkingSlotLinkedList();
    list.insertSlot({ slotId: 'P-01' });
    list.insertSlot({ slotId: 'P-02' });
    list.occupyFirstAvailable({ vehicleNumber: 'KA01AB1234', vehicleType: 'Car', ownerName: 'Alice' });
    list.occupyFirstAvailable({ vehicleNumber: 'KA02CD5678', vehicleType: 'SUV', ownerName: 'Bob' });

    const searchRes = list.searchVehicle('KA02CD5678');
    assert.ok(searchRes.node);
    assert.equal(searchRes.node.slotId, 'P-02');
    assert.equal(searchRes.index, 1);
    assert.equal(searchRes.steps.length, 2);
    assert.equal(searchRes.steps[0].match, false);
    assert.equal(searchRes.steps[1].match, true);
  });

  it('should release vehicle and mark slot available', () => {
    const list = new ParkingSlotLinkedList();
    list.insertSlot({ slotId: 'P-01' });
    list.occupyFirstAvailable({ vehicleNumber: 'KA01AB1234', vehicleType: 'Car', ownerName: 'Alice' });

    const { releasedData, node } = list.releaseVehicle('KA01AB1234');
    assert.ok(releasedData);
    assert.equal(releasedData.vehicleNumber, 'KA01AB1234');
    assert.equal(node.status, 'AVAILABLE');
    assert.equal(node.vehicleNumber, null);
    assert.equal(list.countAvailable(), 1);
  });

  it('should delete a slot by ID and rewire pointers', () => {
    const list = new ParkingSlotLinkedList();
    list.insertSlot({ slotId: 'P-01' });
    list.insertSlot({ slotId: 'P-02' });
    list.insertSlot({ slotId: 'P-03' });

    // Delete middle node P-02
    const deleted = list.deleteSlot('P-02');
    assert.equal(deleted.slotId, 'P-02');
    assert.equal(list.size, 2);
    assert.equal(list.head.slotId, 'P-01');
    assert.equal(list.head.next.slotId, 'P-03');
    assert.equal(list.head.next.next, null);
  });
});

describe('2. WaitingQueue (FIFO) Tests', () => {
  it('should enqueue vehicles and maintain FRONT and REAR pointers', () => {
    const queue = new WaitingQueue();
    assert.ok(queue.isEmpty());
    assert.equal(queue.getSize(), 0);

    const v1 = queue.enqueue({ vehicleNumber: 'KA01AB1234', vehicleType: 'Car', ownerName: 'Alice' });
    assert.equal(queue.getSize(), 1);
    assert.equal(queue.front.vehicleNumber, 'KA01AB1234');
    assert.equal(queue.rear.vehicleNumber, 'KA01AB1234');

    const v2 = queue.enqueue({ vehicleNumber: 'KA02CD5678', vehicleType: 'Bike', ownerName: 'Bob' });
    assert.equal(queue.getSize(), 2);
    assert.equal(queue.front.vehicleNumber, 'KA01AB1234');
    assert.equal(queue.rear.vehicleNumber, 'KA02CD5678');
    assert.equal(queue.front.next, queue.rear);
  });

  it('should dequeue in FIFO order and update FRONT pointer', () => {
    const queue = new WaitingQueue();
    queue.enqueue({ vehicleNumber: 'KA01AB1234' });
    queue.enqueue({ vehicleNumber: 'KA02CD5678' });
    queue.enqueue({ vehicleNumber: 'KA03EF9012' });

    const firstOut = queue.dequeue();
    assert.equal(firstOut.vehicleNumber, 'KA01AB1234');
    assert.equal(queue.front.vehicleNumber, 'KA02CD5678');
    assert.equal(queue.getSize(), 2);

    const secondOut = queue.dequeue();
    assert.equal(secondOut.vehicleNumber, 'KA02CD5678');
    assert.equal(queue.front.vehicleNumber, 'KA03EF9012');

    const thirdOut = queue.dequeue();
    assert.equal(thirdOut.vehicleNumber, 'KA03EF9012');
    assert.ok(queue.isEmpty());
    assert.equal(queue.front, null);
    assert.equal(queue.rear, null);
  });
});

describe('3. ParkingHistoryStack (LIFO) Tests', () => {
  it('should push exit records and maintain TOP pointer in LIFO order', () => {
    const stack = new ParkingHistoryStack();
    assert.ok(stack.isEmpty());

    stack.push({
      vehicleNumber: 'KA01AB1234',
      vehicleType: 'Car',
      slotId: 'P-01',
      entryTime: new Date(Date.now() - 3600000).toISOString(),
    });
    assert.equal(stack.getSize(), 1);
    assert.equal(stack.top.record.vehicleNumber, 'KA01AB1234');

    stack.push({
      vehicleNumber: 'KA02CD5678',
      vehicleType: 'SUV',
      slotId: 'P-02',
      entryTime: new Date(Date.now() - 7200000).toISOString(),
    });
    assert.equal(stack.getSize(), 2);
    // TOP should be latest pushed
    assert.equal(stack.top.record.vehicleNumber, 'KA02CD5678');
    assert.equal(stack.top.next.record.vehicleNumber, 'KA01AB1234');
  });

  it('should pop record from TOP and return LIFO order', () => {
    const stack = new ParkingHistoryStack();
    stack.push({ vehicleNumber: 'A' });
    stack.push({ vehicleNumber: 'B' });
    stack.push({ vehicleNumber: 'C' });

    assert.equal(stack.pop().record.vehicleNumber, 'C');
    assert.equal(stack.pop().record.vehicleNumber, 'B');
    assert.equal(stack.pop().record.vehicleNumber, 'A');
    assert.equal(stack.pop(), null);
    assert.ok(stack.isEmpty());
  });
});
