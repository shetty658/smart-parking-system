# Smart Parking Management System — Academic DSA Project

A complete, college-level Computer Science project demonstrating practical implementations of fundamental **Data Structures and Algorithms (DSA)** in a real-world software engineering application.

Developed with **Node.js, Express.js, MongoDB / Dual Persistence, React, Vite, and Tailwind CSS**.

---

## Table of Contents
1. [Project Title](#1-project-title)
2. [Problem Statement](#2-problem-statement)
3. [Objectives](#3-objectives)
4. [Proposed Solution](#4-proposed-solution)
5. [Features](#5-features)
6. [System Architecture](#6-system-architecture)
7. [Technologies Used](#7-technologies-used)
8. [DSA Concepts Used](#8-dsa-concepts-used)
9. [Linked List Implementation](#9-linked-list-implementation)
10. [Queue Implementation (FIFO)](#10-queue-implementation-fifo)
11. [Stack Implementation (LIFO)](#11-stack-implementation-lifo)
12. [Algorithms & Step-by-Step Logic](#12-algorithms--step-by-step-logic)
13. [Flowcharts & Workflow Diagrams](#13-flowcharts--workflow-diagrams)
14. [Database Design & Schemas](#14-database-design--schemas)
15. [API Documentation](#15-api-documentation)
16. [Screenshots & Visual Design](#16-screenshots--visual-design)
17. [Time Complexity Analysis](#17-time-complexity-analysis)
18. [Space Complexity Analysis](#18-space-complexity-analysis)
19. [Future Enhancements](#19-future-enhancements)
20. [Conclusion](#20-conclusion)

---

## 1. Project Title
**ParkDSA — Smart Parking Management System**  
*A Real-Time Parking Orchestration Platform Driven by Custom Singly Linked List, FIFO Queue, and LIFO Stack.*

---

## 2. Problem Statement
Urban parking facilities suffer from inefficient manual tracking, lack of real-time availability visibility, disorderly queueing when capacity is exhausted, and loss of audit history. In academic computer science curriculums, Data Structures are often taught theoretically with abstract examples (e.g., reversing an arbitrary array or balancing parentheses). There is a critical need for an intuitive, visual, and practical software system that directly connects classic data structures (**Linked Lists, Queues, and Stacks**) to real-world industrial resource allocation.

---

## 3. Objectives
- **Demonstrate Data Structures in Action**: Prove how abstract data types manage slots, queues, and transaction histories.
- **Dynamic Slot Management**: Use a Singly Linked List to insert, delete, search, occupy, and free parking slots dynamically.
- **Fair Waiting Queue**: Use a First-In-First-Out (FIFO) Queue to hold incoming vehicles when all slots are occupied and automatically assign them the next freed slot.
- **Instant Audit History**: Use a Last-In-First-Out (LIFO) Stack to record exit receipts, compute parking fees, and support fast recent-transaction queries.
- **Real-Time Visualization**: Provide an interactive graphical UI showing pointer movements (`HEAD`, `curr = curr.next`, `FRONT`, `REAR`, `TOP`), state transitions, and Big-O complexities.

---

## 4. Proposed Solution
The system models the parking lifecycle around 3 core data structures:
1. **Parking Facility $\rightarrow$ Singly Linked List**: Each parking bay is a node containing slot metadata, vehicle information, and a pointer (`.next`) to the subsequent bay.
2. **Traffic Congestion $\rightarrow$ FIFO Queue**: Arriving vehicles when capacity is $100\%$ enter a waiting queue at the `REAR`. When any vehicle exits, the vehicle at the `FRONT` is dequeued and allocated the freed slot in $O(1)$ queue time.
3. **Exit & Checkout History $\rightarrow$ LIFO Stack**: Every vehicle departure creates an exit transaction pushed onto the `TOP` of the history stack, enabling immediate $O(1)$ inspection of recent exits.

---

## 5. Features
- **Interactive Parking Lot Matrix**: Live grid showing status badges (`FREE` vs `BUSY`), vehicle plates, owner names, duration counters, and Linked List pointer links.
- **Smart Entry Flow**: Automatic detection of available slots vs. waiting queue fallback.
- **Smart Exit & Auto-Reassignment**: Releasing a slot pushes the receipt to the stack and automatically pops the waiting queue front vehicle into the newly vacated slot.
- **Live DSA Visualizer**: Graphical rendering of the Singly Linked List chain (`HEAD ➔ [Slot 1] ➔ [Slot 2] ➔ NULL`), Queue (`FRONT ➔ [Car A] ➔ [Car B] ➔ REAR`), and Stack (`TOP ➔ [Exit C] ➔ [Exit B]`).
- **DSA Operations & Pointer Trace Panel**: Real-time inspection showing Before State, Algorithmic Step-by-Step Execution, After State, and Big-O complexity metrics.
- **Linear Traversal Search Engine**: Searches vehicles by plate number with animated step-by-step visual tracking along the Linked List.
- **Admin Control Center**: Dynamic insertion and deletion of slots, stack pop/clear, and pre-seeded testing presets (College Demo Preset & Clean Slate Preset).
- **Dual Persistence Architecture**: Persists state directly to MongoDB with an automatic resilient local JSON file fallback (`backend/data/parking-state.json`) so the app runs smoothly anywhere.
- **Academic Viva Voce Helper**: Built-in reference containing manual JavaScript & C++ classes and 10 frequently asked viva questions.

---

## 6. System Architecture

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    CLIENT BROWSER (React + Vite + Tailwind)             │
│  ┌────────────────────┐ ┌────────────────────┐ ┌─────────────────────┐  │
│  │  Dashboard & Grid  │ │   DSA Visualizer   │ │  DSA Operations Log │  │
│  └────────────────────┘ └────────────────────┘ └─────────────────────┘  │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTP REST Calls (Port 5000)
┌────────────────────────────────────▼────────────────────────────────────┐
│                    BACKEND (Node.js + Express.js)                       │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    PARKING ORCHESTRATION SERVICE                  │  │
│  │                                                                   │  │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌───────────────┐  │  │
│  │  │  Linked List    │    │   FIFO Queue    │    │  LIFO Stack   │  │  │
│  │  │ (Parking Slots) │    │(Waiting Vehicle)│    │(Exit History) │  │  │
│  │  │  HEAD ➔ ... ➔ N │    │ FRONT ➔ ... ➔ R │    │ TOP ➔ ... ➔ B │  │  │
│  │  └────────┬────────┘    └────────┬────────┘    └───────┬───────┘  │  │
│  └───────────┼──────────────────────┼─────────────────────┼──────────┘  │
└──────────────┼──────────────────────┼─────────────────────┼─────────────┘
               │                      │                     │
               ▼                      ▼                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              PERSISTENCE LAYER (Dual Storage: MongoDB + JSON)           │
│  • ParkingSlots Collection / File Snapshot                              │
│  • WaitingQueue Collection / File Snapshot                              │
│  • ParkingHistory Collection / File Snapshot                            │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Technologies Used
- **Frontend**:
  - React 19
  - Vite 8
  - Tailwind CSS 3.4
  - Lucide Icons
  - Glassmorphic CSS Design System
- **Backend**:
  - Node.js (ES Modules)
  - Express.js 4
  - Mongoose 8
  - Native Node Test Runner (`node:test`)
- **Database**:
  - MongoDB (with graceful fallback to local file persistence)

---

## 8. DSA Concepts Used

| Concept | System Component | Real-World Role |
|---|---|---|
| **Singly Linked List** | Parking Slot Matrix | Dynamic allocation, insertion, deletion, and linear search of parking bays. |
| **Queue (FIFO)** | Waiting Vehicle Pool | First-Come, First-Served fairness when facility reaches maximum capacity. |
| **Stack (LIFO)** | Exit History & Billing | Audit log of recent exits where the latest transaction sits at the TOP. |
| **Pointers & References** | `HEAD`, `next`, `FRONT`, `REAR`, `TOP` | Direct memory pointer management without array index shifting. |

---

## 9. Linked List Implementation

### Node Structure (`ParkingSlotNode`)
```javascript
class ParkingSlotNode {
  constructor({ slotId, vehicleNumber = null, vehicleType = null, ownerName = null, status = 'AVAILABLE' }) {
    this.slotId = slotId;               // e.g. "P-01"
    this.vehicleNumber = vehicleNumber; // e.g. "KA01AB1234"
    this.vehicleType = vehicleType;     // "Car" | "Bike" | "SUV" | "EV" | "Truck"
    this.ownerName = ownerName;         // e.g. "Aarav Sharma"
    this.entryTime = null;              // Timestamp
    this.status = status;               // "AVAILABLE" | "OCCUPIED"
    this.next = null;                   // Pointer to next node or null
  }
}
```

### Linked List Class (`ParkingSlotLinkedList`)
- `insertSlot(slotData)`: Traverses to tail, sets `current.next = newNode`.
- `deleteSlot(slotId)`: Rewires `prev.next = current.next` to remove node.
- `searchSlot(slotId)`: Linear scan checking `slotId`.
- `searchVehicle(vehicleNumber)`: Linear scan checking `vehicleNumber` and returning traversal steps.
- `occupyFirstAvailable(vehicleData)`: Finds first node with `status === 'AVAILABLE'`, sets vehicle info, marks `OCCUPIED`.
- `releaseVehicle(vehicleNumber)`: Resets node data and marks `AVAILABLE`.

---

## 10. Queue Implementation (FIFO)

### Node Structure (`QueueNode`)
```javascript
class QueueNode {
  constructor({ vehicleNumber, vehicleType, ownerName }) {
    this.vehicleNumber = vehicleNumber;
    this.vehicleType = vehicleType;
    this.ownerName = ownerName;
    this.waitingSince = new Date().toISOString();
    this.next = null;
  }
}
```

### Queue Class (`WaitingQueue`)
- `enqueue(vehicleData)`: Adds to `rear`. If empty, `front = rear = newNode`. Else `rear.next = newNode; rear = newNode`.
- `dequeue()`: Removes from `front`. `front = front.next`. If empty, `rear = null`.
- `peek()`: Returns `front` data in $O(1)$.
- `isEmpty()`: Checks `this.size === 0`.

---

## 11. Stack Implementation (LIFO)

### Node Structure (`StackNode`)
```javascript
class StackNode {
  constructor(record) {
    this.record = {
      vehicleNumber: record.vehicleNumber,
      vehicleType: record.vehicleType,
      slotId: record.slotId,
      entryTime: record.entryTime,
      exitTime: record.exitTime,
      durationMinutes: record.durationMinutes,
      fee: record.fee,
    };
    this.next = null; // Pointer to node below in stack
  }
}
```

### Stack Class (`ParkingHistoryStack`)
- `push(record)`: `newNode.next = top; top = newNode; size++`.
- `pop()`: `popped = top; top = top.next; size--; return popped`.
- `peek()`: Returns `top` record in $O(1)$.
- `isEmpty()`: Checks `top === null`.

---

## 12. Algorithms & Step-by-Step Logic

### Algorithm 1: Vehicle Entry
```text
1. Input: vehicleNumber, vehicleType, ownerName
2. Check if vehicle is already parked in Linked List:
     If found -> Return Error "Vehicle already parked"
3. Traverse Linked List from HEAD:
     For each node:
       If node.status == 'AVAILABLE':
         node.status = 'OCCUPIED'
         node.vehicleNumber = vehicleNumber
         node.entryTime = NOW
         Return Success (Parked in slot)
4. If end of list reached (All slots OCCUPIED):
     Enqueue vehicle into WaitingQueue at REAR pointer
     Return Success (Added to Waiting Queue)
```

### Algorithm 2: Vehicle Exit & Queue Auto-Reassignment
```text
1. Input: vehicleNumber
2. Traverse Linked List to find matching vehicle:
     If not found -> Return Error "Vehicle not in facility"
3. Identify slotId, calculate parking duration & fee
4. Reset slot:
     node.status = 'AVAILABLE'
     node.vehicleNumber = NULL
5. Push exit receipt to History Stack at TOP pointer:
     newNode.next = TOP
     TOP = newNode
6. Check Waiting Queue:
     If Queue is NOT EMPTY:
       waitingVehicle = Dequeue() from FRONT pointer
       Assign freed slot to waitingVehicle:
         node.status = 'OCCUPIED'
         node.vehicleNumber = waitingVehicle.vehicleNumber
         node.entryTime = NOW
7. Return Exit receipt & Auto-Assignment details
```

---

## 13. Flowcharts & Workflow Diagrams

### Vehicle Entry & Exit Lifecycle

```text
[ Vehicle Arrives ]
        │
        ▼
Is any slot AVAILABLE in Linked List?
   ├── YES ──> [ Occupy First Slot in Linked List ] ──> Status: OCCUPIED
   │
   └── NO ───> [ Enqueue to Waiting Queue at REAR ] ──> Status: WAITING
                                                               │
┌──────────────────────────────────────────────────────────────┘
│
▼
[ Vehicle Departs ]
        │
        ▼
Linear search in Linked List ➔ Free Slot (Status: AVAILABLE)
        │
        ▼
Push receipt to Parking History Stack (LIFO: TOP pointer)
        │
        ▼
Are vehicles in Waiting Queue?
   ├── YES ──> Dequeue from FRONT ➔ Auto-allocate to freed slot
   │
   └── NO ───> Slot remains AVAILABLE for next arrival
```

---

## 14. Database Design & Schemas

### 1. `ParkingSlot` Schema
```javascript
{
  slotId: { type: String, required: true, unique: true },
  vehicleNumber: { type: String, default: null },
  vehicleType: { type: String, default: null },
  ownerName: { type: String, default: null },
  entryTime: { type: Date, default: null },
  status: { type: String, enum: ['AVAILABLE', 'OCCUPIED', 'RESERVED'], default: 'AVAILABLE' },
  orderIndex: { type: Number, required: true }
}
```

### 2. `WaitingVehicle` Schema
```javascript
{
  vehicleNumber: { type: String, required: true },
  vehicleType: { type: String, default: 'Car' },
  ownerName: { type: String, default: 'Guest' },
  waitingSince: { type: Date, default: Date.now },
  queuePosition: { type: Number, required: true }
}
```

### 3. `ParkingHistory` Schema
```javascript
{
  vehicleNumber: { type: String, required: true },
  vehicleType: { type: String, default: 'Car' },
  ownerName: { type: String, default: 'Guest' },
  slotId: { type: String, required: true },
  entryTime: { type: Date, required: true },
  exitTime: { type: Date, default: Date.now },
  durationMinutes: { type: Number, required: true },
  fee: { type: Number, required: true },
  stackDepth: { type: Number, required: true }
}
```

---

## 15. API Documentation

| Method | Endpoint | Description | Request Body / Param |
|---|---|---|---|
| `POST` | `/api/parking/park` | Park vehicle or enqueue | `{ vehicleNumber, vehicleType, ownerName }` |
| `POST` | `/api/parking/exit` | Exit vehicle, push stack, dequeue queue | `{ vehicleNumber }` |
| `GET` | `/api/parking/slots` | Get all slots in Linked List order | None |
| `GET` | `/api/parking/vehicle/:vehicleNumber` | Search vehicle with traversal steps | `:vehicleNumber` |
| `GET` | `/api/parking/queue` | Get waiting queue in FIFO order | None |
| `DELETE` | `/api/parking/queue/:vehicleNumber` | Cancel waiting vehicle | `:vehicleNumber` |
| `GET` | `/api/parking/history` | Get parking history stack (TOP down) | None |
| `POST` | `/api/parking/history/pop` | Pop latest record from Stack | None |
| `DELETE` | `/api/parking/history` | Clear history stack | None |
| `POST` | `/api/parking/slots` | Admin: Add new slot node | `{ slotId }` |
| `DELETE` | `/api/parking/slots/:id` | Admin: Delete slot node | `:id` |
| `GET` | `/api/parking/stats` | Dashboard statistics & occupancy % | None |
| `GET` | `/api/parking/dsa-state` | Full live snapshot of all 3 structures | None |
| `POST` | `/api/parking/reset` | System preset reset | `{ preset: 'DEFAULT' \| 'EMPTY' }` |

---

## 16. Screenshots & Visual Design

### 1. Dashboard & Slot Matrix
- Shows real-time occupancy meter, status badges (`FREE` vs `BUSY`), vehicle cards, and Linked List order indicators (`Node #1 ➔ Node #2 ➔ ... ➔ NULL`).
- Displays live feeds of Waiting Queue and Recent Exits directly below the matrix.

### 2. Dedicated DSA Visualizer Page
- **Linked List Section**: Interactive glowing node chain showing `HEAD` pointer, internal fields, next pointers, and `NULL` terminator.
- **Queue Section**: Shows `FRONT` pointer (next vehicle in line) and `REAR` pointer (latest arrived).
- **Stack Section**: Visual stack tower showing `TOP` pointer and level depths.
- **Node Inspector Modal**: Click on any node to view its exact in-memory JSON structure.

### 3. DSA Operations Trace Panel
- Live execution view showing:
  - Operation: `PARK_VEHICLE`, `WAITING_QUEUE_ENQUEUE`, `EXIT_VEHICLE`, `AUTO_ASSIGN_FROM_QUEUE`
  - State Before vs State After
  - Step-by-Step pointer rewiring steps
  - Time & Space complexity badges

### 4. Vehicle Search Engine
- Search by registration plate with animated step-by-step linear traversal trace showing every node inspected.

---

## 17. Time Complexity Analysis

| Operation | Data Structure | Best Case | Average Case | Worst Case | Algorithmic Reason |
|---|---|---|---|---|---|
| **Add Slot (Tail)** | Linked List | $O(1)$ | $O(n)$ | $O(n)$ | Traverses from HEAD to last node unless tail pointer is maintained. |
| **Search Vehicle** | Linked List | $O(1)$ | $O(n)$ | $O(n)$ | Linear scan through linked nodes until plate is found or NULL reached. |
| **Occupy First Free** | Linked List | $O(1)$ | $O(n)$ | $O(n)$ | Traverses until first node with status 'AVAILABLE' is found. |
| **Release Slot (Exit)** | Linked List | $O(1)$ | $O(n)$ | $O(n)$ | Traverses to locate vehicle, then updates status in-place. |
| **Enqueue Waiting** | Queue (FIFO) | $O(1)$ | $O(1)$ | $O(1)$ | Direct insertion at REAR pointer (`rear.next = node; rear = node`). |
| **Dequeue Waiting** | Queue (FIFO) | $O(1)$ | $O(1)$ | $O(1)$ | Direct removal from FRONT pointer (`front = front.next`). |
| **Push Exit History** | Stack (LIFO) | $O(1)$ | $O(1)$ | $O(1)$ | Direct insertion at TOP pointer (`node.next = top; top = node`). |
| **Pop Exit History** | Stack (LIFO) | $O(1)$ | $O(1)$ | $O(1)$ | Direct removal from TOP pointer (`top = top.next`). |

---

## 18. Space Complexity Analysis

| Data Structure | Auxiliary Space | Total Space Complexity | Notes |
|---|---|---|---|
| **Linked List** | $O(1)$ per operation | $O(n)$ | Exactly $n$ nodes allocated for $n$ parking slots. |
| **Waiting Queue** | $O(1)$ per operation | $O(k)$ | Exactly $k$ nodes allocated for $k$ waiting vehicles. |
| **History Stack** | $O(1)$ per operation | $O(m)$ | Exactly $m$ nodes allocated for $m$ transaction records. |
| **Total System Memory** | — | $O(n + k + m)$ | Linear space proportional to facility scale. |

---

## 19. Future Enhancements
- **IoT Ultrasonic / Infrared Sensors**: ESP32 integration for hardware-based slot occupancy detection.
- **ANPR (Automatic Number Plate Recognition)**: Computer vision camera integration for automated vehicle number reading.
- **QR Code Gate Pass**: Instant mobile QR generation at entry and scanning at exit barrier.
- **Dynamic Pricing Engine**: Algorithmic surge pricing based on real-time occupancy percentages.
- **Google Maps Integration**: Navigation routing and ETA estimation to vacant parking slots.

---

## 20. Conclusion
The **Smart Parking Management System** successfully validates that classical Computer Science data structures (**Singly Linked List, FIFO Queue, and LIFO Stack**) are foundational, elegant, and efficient solutions to modern resource allocation and queue management problems. By coupling manual, library-free data structure logic with an interactive, modern user interface, the project provides both strong academic pedagogical value and a real-world, production-ready system.

---

## How to Run the Project Locally

### Prerequisites
- Node.js (v18+)
- MongoDB (Optional — the system includes an automatic resilient JSON persistence engine if MongoDB is not running!)

### 1. Start Backend Server
```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:5000`*

### 2. Run Backend DSA Unit Tests
```bash
cd backend
npm test
```

### 3. Start Frontend Client
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*
