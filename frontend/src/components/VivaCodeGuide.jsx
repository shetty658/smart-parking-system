import React, { useState } from 'react';
import { 
  BookOpen, 
  Code2, 
  CheckCircle2, 
  HelpCircle, 
  Table, 
  FileCode, 
  Copy, 
  Check 
} from 'lucide-react';

export default function VivaCodeGuide() {
  const [activeCodeTab, setActiveCodeTab] = useState('LL_JS');
  const [copied, setCopied] = useState(false);

  const codeSnippets = {
    LL_JS: `// ==========================================
// Singly Linked List for Parking Slot Management
// ==========================================
class ParkingSlotNode {
  constructor(slotId, vehicleNumber = null, status = 'AVAILABLE') {
    this.slotId = slotId;               // e.g. "P-01"
    this.vehicleNumber = vehicleNumber; // e.g. "KA01AB1234"
    this.status = status;               // "AVAILABLE" | "OCCUPIED"
    this.next = null;                   // Pointer to next node
  }
}

class ParkingSlotLinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  // Insert slot at end: O(n) or O(1)
  insertSlot(slotId) {
    const newNode = new ParkingSlotNode(slotId);
    if (!this.head) {
      this.head = newNode;
    } else {
      let curr = this.head;
      while (curr.next !== null) curr = curr.next;
      curr.next = newNode;
    }
    this.size++;
  }

  // Linear search: O(n)
  searchVehicle(vehicleNumber) {
    let curr = this.head;
    while (curr !== null) {
      if (curr.status === 'OCCUPIED' && curr.vehicleNumber === vehicleNumber) {
        return curr;
      }
      curr = curr.next;
    }
    return null;
  }
}`,

    QUEUE_JS: `// ==========================================
// Waiting Queue (FIFO) for Overcrowded Parking
// ==========================================
class QueueNode {
  constructor(vehicleNumber, vehicleType = 'Car') {
    this.vehicleNumber = vehicleNumber;
    this.vehicleType = vehicleType;
    this.next = null;
  }
}

class WaitingQueue {
  constructor() {
    this.front = null;
    this.rear = null;
    this.size = 0;
  }

  // Enqueue at REAR: O(1)
  enqueue(vehicleNumber, vehicleType) {
    const newNode = new QueueNode(vehicleNumber, vehicleType);
    if (this.isEmpty()) {
      this.front = newNode;
      this.rear = newNode;
    } else {
      this.rear.next = newNode;
      this.rear = newNode;
    }
    this.size++;
  }

  // Dequeue from FRONT: O(1)
  dequeue() {
    if (this.isEmpty()) return null;
    const removed = this.front;
    this.front = this.front.next;
    if (!this.front) this.rear = null;
    this.size--;
    return removed;
  }

  isEmpty() { return this.size === 0; }
}`,

    STACK_JS: `// ==========================================
// Parking History Stack (LIFO) for Recent Exits
// ==========================================
class StackNode {
  constructor(record) {
    this.record = record; // { vehicleNumber, slotId, exitTime, fee }
    this.next = null;     // Pointer to node below
  }
}

class ParkingHistoryStack {
  constructor() {
    this.top = null;
    this.size = 0;
  }

  // Push to TOP: O(1)
  push(record) {
    const newNode = new StackNode(record);
    newNode.next = this.top;
    this.top = newNode;
    this.size++;
  }

  // Pop from TOP: O(1)
  pop() {
    if (this.isEmpty()) return null;
    const popped = this.top;
    this.top = this.top.next;
    this.size--;
    return popped.record;
  }

  peek() { return this.top ? this.top.record : null; }
  isEmpty() { return this.top === null; }
}`,

    CPP_EQUIVALENT: `// ==========================================
// C++ Equivalent Implementation for Viva Demo
// ==========================================
#include <iostream>
#include <string>
using namespace std;

// 1. Linked List Node
struct SlotNode {
    string slotId;
    string vehicleNumber;
    bool isOccupied;
    SlotNode* next;
    SlotNode(string id) : slotId(id), isOccupied(false), next(nullptr) {}
};

// 2. Queue Node (FIFO)
struct QueueNode {
    string vehicleNumber;
    QueueNode* next;
    QueueNode(string v) : vehicleNumber(v), next(nullptr) {}
};

// 3. Stack Node (LIFO)
struct StackNode {
    string vehicleNumber;
    string slotId;
    StackNode* next;
    StackNode(string v, string s) : vehicleNumber(v), slotId(s), next(nullptr) {}
};`,
  };

  const copyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const vivaQuestions = [
    {
      q: 'Why use a Singly Linked List for Parking Slot Management instead of a simple fixed Array?',
      a: 'A Linked List enables dynamic slot allocation and deletion without memory fragmentation or costly shift operations. In an actual multi-level parking lot, slots can be added, decommissioned, or reconfigured dynamically in O(1) time at head/tail.',
    },
    {
      q: 'Why is a Queue (FIFO) strictly necessary for Waiting Vehicles?',
      a: 'Fairness (First-Come, First-Served). The vehicle that arrived first has priority to receive the next newly released parking slot. A Queue naturally enforces FIFO in O(1) enqueue at the REAR and O(1) dequeue at the FRONT.',
    },
    {
      q: 'Why is a Stack (LIFO) used for Parking Exit History?',
      a: 'Recent exits and undo actions strictly follow LIFO principles: the most recently departed vehicle is immediately accessible at the TOP in O(1) time for barrier clearance, audit checks, or re-entry reversal without iterating through older history.',
    },
    {
      q: 'What is the time complexity to search for a parked vehicle?',
      a: 'O(n) linear search, because each node in the Singly Linked List must be traversed sequentially from HEAD until the matching vehicle plate is located or NULL is reached.',
    },
    {
      q: 'What happens when a vehicle exits and the waiting queue is not empty?',
      a: 'The system performs a coordinated atomic operation: (1) Frees slot in Linked List, (2) Pushes exit receipt to Stack (O(1)), (3) Dequeues front vehicle from Queue (O(1)), (4) Immediately allocates the freed slot to the dequeued vehicle.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-3">
          <BookOpen className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          DSA Academic Source Code & Viva Presentation Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl mx-auto">
          Reference manual DSA class definitions, Big-O complexity tables, and high-frequency examination questions for laboratory assessment.
        </p>
      </div>

      {/* Section 16 Master Big-O Complexity Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-800">
          <Table className="w-5 h-5 text-brand-400" />
          <h2 className="text-base font-bold text-white uppercase tracking-wider">
            Time & Space Complexity Master Reference (Section 16)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/50">
                <th className="py-3 px-4 font-bold uppercase">Operation</th>
                <th className="py-3 px-4 font-bold uppercase">Data Structure</th>
                <th className="py-3 px-4 font-bold uppercase">Time Complexity</th>
                <th className="py-3 px-4 font-bold uppercase">Space Complexity</th>
                <th className="py-3 px-4 font-bold uppercase">Pointer Mechanism</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              <tr className="hover:bg-slate-900/40">
                <td className="py-3 px-4 font-semibold text-white">Add Parking Slot</td>
                <td className="py-3 px-4 text-indigo-400">Linked List</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">O(1) / O(n)</td>
                <td className="py-3 px-4 text-cyan-400">O(1)</td>
                <td className="py-3 px-4 text-slate-400">tail.next = newNode</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-3 px-4 font-semibold text-white">Search Vehicle</td>
                <td className="py-3 px-4 text-indigo-400">Linked List</td>
                <td className="py-3 px-4 text-amber-400 font-bold">O(n)</td>
                <td className="py-3 px-4 text-cyan-400">O(1)</td>
                <td className="py-3 px-4 text-slate-400">curr = curr.next</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-3 px-4 font-semibold text-white">Remove Vehicle (Exit)</td>
                <td className="py-3 px-4 text-indigo-400">Linked List</td>
                <td className="py-3 px-4 text-amber-400 font-bold">O(n)</td>
                <td className="py-3 px-4 text-cyan-400">O(1)</td>
                <td className="py-3 px-4 text-slate-400">node.status = 'AVAILABLE'</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-3 px-4 font-semibold text-white">Add Waiting Vehicle</td>
                <td className="py-3 px-4 text-cyan-400">Queue (FIFO)</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">O(1)</td>
                <td className="py-3 px-4 text-cyan-400">O(1)</td>
                <td className="py-3 px-4 text-slate-400">rear.next = newNode; rear = newNode</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-3 px-4 font-semibold text-white">Remove Waiting Vehicle</td>
                <td className="py-3 px-4 text-cyan-400">Queue (FIFO)</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">O(1)</td>
                <td className="py-3 px-4 text-cyan-400">O(1)</td>
                <td className="py-3 px-4 text-slate-400">front = front.next</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-3 px-4 font-semibold text-white">Push Parking History</td>
                <td className="py-3 px-4 text-purple-400">Stack (LIFO)</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">O(1)</td>
                <td className="py-3 px-4 text-cyan-400">O(1)</td>
                <td className="py-3 px-4 text-slate-400">newNode.next = top; top = newNode</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-3 px-4 font-semibold text-white">Pop Parking History</td>
                <td className="py-3 px-4 text-purple-400">Stack (LIFO)</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">O(1)</td>
                <td className="py-3 px-4 text-cyan-400">O(1)</td>
                <td className="py-3 px-4 text-slate-400">top = top.next</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Viewer */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Manual DSA Class Implementation Source
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono">
              {[
                { id: 'LL_JS', label: 'LinkedList.js' },
                { id: 'QUEUE_JS', label: 'Queue.js' },
                { id: 'STACK_JS', label: 'Stack.js' },
                { id: 'CPP_EQUIVALENT', label: 'C++ Equivalent' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCodeTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeCodeTab === tab.id
                      ? 'bg-brand-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => copyCode(codeSnippets[activeCodeTab])}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Copy snippet"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto max-h-96 selection:bg-brand-800 leading-relaxed">
          {codeSnippets[activeCodeTab]}
        </pre>
      </div>

      {/* Viva Questions */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-white uppercase tracking-wider">
            Viva Voce & Interview Preparation (Frequently Asked Questions)
          </h2>
        </div>

        <div className="space-y-4">
          {vivaQuestions.map((vq, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <h4 className="font-bold text-sm text-amber-300 mb-1.5 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-xs flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{vq.q}</span>
              </h4>
              <p className="text-xs text-slate-300 pl-7 leading-relaxed">
                {vq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
