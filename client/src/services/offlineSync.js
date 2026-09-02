import { openDB } from "idb";
import { syncBatchOfflineLogs, getOfflineSyncStatus } from "./api";

const DB_NAME = "archexcav_pwa_db";
const DB_VERSION = 1;
const STORE_NAME = "offline_queue";

// Safe DB initialization with in-memory fallback for environments without IndexedDB
async function getDB() {
  if (typeof window === "undefined" || !window.indexedDB) {
    return null;
  }
  try {
    return await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "client_tx_id" });
        }
      },
    });
  } catch (err) {
    console.warn(
      "IndexedDB initialization failed, falling back to memory:",
      err,
    );
    return null;
  }
}

// In-memory queue fallback
let memoryQueue = [];

export async function queueOfflineTransaction(payloadType, payload) {
  const txItem = {
    client_tx_id: `TX-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    payload_type: payloadType,
    payload: payload,
    client_timestamp: new Date().toISOString(),
    status: "QUEUED",
  };

  const db = await getDB();
  if (db) {
    try {
      await db.put(STORE_NAME, txItem);
    } catch (err) {
      console.warn("Failed to store in IndexedDB, using memory queue:", err);
      memoryQueue.push(txItem);
    }
  } else {
    memoryQueue.push(txItem);
  }

  return txItem;
}

export async function getQueuedTransactions() {
  const db = await getDB();
  if (db) {
    try {
      return await db.getAll(STORE_NAME);
    } catch (err) {
      console.warn("Error reading IndexedDB queue:", err);
      return memoryQueue;
    }
  }
  return memoryQueue;
}

export async function removeQueuedTransaction(clientTxId) {
  const db = await getDB();
  if (db) {
    try {
      await db.delete(STORE_NAME, clientTxId);
    } catch (err) {
      console.warn("Error deleting from IndexedDB:", err);
    }
  }
  memoryQueue = memoryQueue.filter((tx) => tx.client_tx_id !== clientTxId);
}

export async function clearQueuedTransactions() {
  const db = await getDB();
  if (db) {
    try {
      const tx = db.transaction(STORE_NAME, "readwrite");
      await tx.objectStore(STORE_NAME).clear();
      await tx.done;
    } catch (err) {
      console.warn("Error clearing IndexedDB:", err);
    }
  }
  memoryQueue = [];
}

export async function processSyncQueue() {
  const queued = await getQueuedTransactions();
  if (!queued || queued.length === 0) {
    return { synced_count: 0, failed_count: 0, results: [] };
  }

  const payload = {
    transactions: queued.map((t) => ({
      client_tx_id: t.client_tx_id,
      payload_type: t.payload_type,
      payload: t.payload,
      client_timestamp: t.client_timestamp,
    })),
  };

  try {
    const res = await syncBatchOfflineLogs(payload);
    if (res && res.results) {
      for (const result of res.results) {
        if (result.status === "synced") {
          await removeQueuedTransaction(result.client_tx_id);
        }
      }
    }
    return res;
  } catch (err) {
    console.error("Batch sync request failed:", err);
    return {
      total_received: queued.length,
      synced_count: 0,
      failed_count: queued.length,
      results: queued.map((q) => ({
        client_tx_id: q.client_tx_id,
        status: "failed",
        detail: err.message || "Network error",
      })),
    };
  }
}

export async function checkServerStatus() {
  try {
    const res = await getOfflineSyncStatus();
    return res;
  } catch (err) {
    return {
      status: "offline",
      server_time: new Date().toISOString(),
      total_synced_transactions: 0,
    };
  }
}
