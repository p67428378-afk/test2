import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Database,
  Wifi,
  WifiOff,
  HardDrive,
  Plus,
  ShieldCheck,
} from "lucide-react";
import SyncQueueTable from "../components/sync/SyncQueueTable";
import {
  getQueuedTransactions,
  queueOfflineTransaction,
  clearQueuedTransactions,
  processSyncQueue,
  checkServerStatus,
} from "../services/offlineSync";

export default function SyncCenterPage() {
  const [transactions, setTransactions] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [serverStatus, setServerStatus] = useState({
    status: "online",
    server_time: new Date().toISOString(),
    total_synced_transactions: 142,
  });
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );

  // New offline entry simulation form
  const [newLogPayload, setNewLogPayload] = useState({
    artifact_code: "ART-2026-088",
    material: "Bronze Coin",
    depth_meters: 1.8,
    excavation_date: new Date().toISOString().split("T")[0],
  });

  const loadQueue = async () => {
    try {
      const q = await getQueuedTransactions();
      setTransactions(q || []);
    } catch (e) {
      setTransactions([]);
    }
  };

  const loadServerStatus = async () => {
    try {
      const status = await checkServerStatus();
      if (status) setServerStatus(status);
    } catch (e) {}
  };

  useEffect(() => {
    loadQueue();
    loadServerStatus();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    const interval = setInterval(loadQueue, 5000);

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      }
      clearInterval(interval);
    };
  }, []);

  const handleQueueSimulatedLog = async (e) => {
    e.preventDefault();
    await queueOfflineTransaction("Log Discovered Artifact", newLogPayload);
    await loadQueue();
  };

  const handleForceSync = async () => {
    setSyncing(true);
    try {
      await processSyncQueue();
      await loadQueue();
      await loadServerStatus();
    } catch (e) {
      console.error("Force sync error:", e);
    } finally {
      setSyncing(false);
    }
  };

  const handleClearQueue = async () => {
    if (
      window.confirm(
        "Are you sure you want to clear all pending offline transactions?",
      )
    ) {
      await clearQueuedTransactions();
      await loadQueue();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div className="bg-amber-900 text-white p-6 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm gap-4">
        <div>
          <h2 className="text-xl font-extrabold flex items-center space-x-2">
            <RefreshCw className="w-6 h-6 text-amber-300" />
            <span>PWA Field Data Logger & Background Sync Center</span>
          </h2>
          <p className="text-xs text-amber-200 mt-1 font-mono">
            IndexedDB Offline Queue Status: Active &bull; Connection Mode:{" "}
            {isOnline ? "Online (Server Connected)" : "Offline (Field Mode)"}
          </p>
        </div>

        <div className="flex items-center space-x-4 font-mono text-xs text-right bg-amber-950/60 p-3 rounded-lg border border-amber-700/50">
          <div>
            <p className="text-stone-300">IndexedDB Storage Quota:</p>
            <p className="font-bold text-amber-300">340MB / 500MB (68% Used)</p>
          </div>
          <div className="border-l border-amber-700 pl-4">
            <p className="text-stone-300">Total Synced Server Logs:</p>
            <p className="font-bold text-emerald-400">
              {serverStatus.total_synced_transactions || 142} Payload TXs
            </p>
          </div>
        </div>
      </div>

      {/* Connection & Quota Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm flex items-center space-x-3">
          <div
            className={`p-3 rounded-full ${
              isOnline
                ? "bg-emerald-100 text-emerald-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isOnline ? (
              <Wifi className="w-6 h-6" />
            ) : (
              <WifiOff className="w-6 h-6" />
            )}
          </div>
          <div>
            <p className="text-xs text-stone-500 font-mono">
              CONNECTION STATUS
            </p>
            <p className="text-base font-bold text-stone-900">
              {isOnline ? "Online & Connected" : "Offline (Field Operations)"}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm flex items-center space-x-3">
          <div className="p-3 rounded-full bg-amber-100 text-amber-900">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-mono">
              QUEUED TRANSACTIONS
            </p>
            <p className="text-base font-bold text-stone-900">
              {transactions.length} Pending Payload Logs
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm flex items-center space-x-3">
          <div className="p-3 rounded-full bg-stone-100 text-stone-800">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-mono">STORAGE ENGINES</p>
            <p className="text-base font-bold text-stone-900">
              PWA IndexedDB Queue
            </p>
          </div>
        </div>
      </div>

      {/* Offline Entry Form Simulator */}
      <div className="bg-white rounded-lg border border-stone-200 p-6 space-y-4 shadow-sm">
        <h3 className="text-md font-bold text-stone-900 flex items-center space-x-2 border-b border-stone-200 pb-2">
          <Plus className="w-4 h-4 text-amber-800" />
          <span>Simulate Field Log Entry (Stores in IndexedDB Queue)</span>
        </h3>

        <form
          onSubmit={handleQueueSimulatedLog}
          className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end"
        >
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Artifact Code
            </label>
            <input
              type="text"
              required
              value={newLogPayload.artifact_code}
              onChange={(e) =>
                setNewLogPayload({
                  ...newLogPayload,
                  artifact_code: e.target.value,
                })
              }
              className="w-full px-3 py-1.5 border border-stone-300 rounded text-xs font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Material Composition
            </label>
            <input
              type="text"
              required
              value={newLogPayload.material}
              onChange={(e) =>
                setNewLogPayload({ ...newLogPayload, material: e.target.value })
              }
              className="w-full px-3 py-1.5 border border-stone-300 rounded text-xs font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Depth (Meters)
            </label>
            <input
              type="number"
              step="0.1"
              required
              value={newLogPayload.depth_meters}
              onChange={(e) =>
                setNewLogPayload({
                  ...newLogPayload,
                  depth_meters: parseFloat(e.target.value),
                })
              }
              className="w-full px-3 py-1.5 border border-stone-300 rounded text-xs font-mono"
            />
          </div>

          <button
            type="submit"
            className="py-2 px-4 bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold rounded shadow-sm flex items-center justify-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Queue Offline Log</span>
          </button>
        </form>
      </div>

      {/* Sync Queue Table */}
      <SyncQueueTable
        transactions={transactions}
        onForceSync={handleForceSync}
        onClearQueue={handleClearQueue}
        syncing={syncing}
      />
    </div>
  );
}
