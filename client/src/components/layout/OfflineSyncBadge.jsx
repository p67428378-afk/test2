import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";
import {
  getQueuedTransactions,
  processSyncQueue,
} from "../../services/offlineSync";

export default function OfflineSyncBadge() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  const [queuedCount, setQueuedCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  const updateQueueCount = async () => {
    try {
      const queued = await getQueuedTransactions();
      setQueuedCount(queued ? queued.length : 0);
    } catch (e) {
      setQueuedCount(0);
    }
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    updateQueueCount();
    const interval = setInterval(updateQueueCount, 5000);

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      }
      clearInterval(interval);
    };
  }, []);

  const handleQuickSync = async (e) => {
    e.preventDefault();
    if (syncing || queuedCount === 0) return;
    setSyncing(true);
    try {
      await processSyncQueue();
      await updateQueueCount();
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Link
      to="/sync-center"
      className={`inline-flex items-center space-x-2 px-2.5 py-1 text-xs font-mono rounded-full border transition-colors ${
        !isOnline
          ? "bg-red-100 text-red-900 border-red-300"
          : queuedCount > 0
            ? "bg-amber-100 text-amber-900 border-amber-300"
            : "bg-emerald-100 text-emerald-900 border-emerald-300"
      }`}
      title="PWA Offline Sync Center"
    >
      {!isOnline ? (
        <WifiOff className="w-3.5 h-3.5 text-red-700" />
      ) : (
        <Wifi className="w-3.5 h-3.5 text-emerald-700" />
      )}

      <span>
        {!isOnline
          ? `Offline (${queuedCount} Queued)`
          : queuedCount > 0
            ? `PWA Sync: ${queuedCount} Queued`
            : "PWA Sync: Connected"}
      </span>

      {queuedCount > 0 && isOnline && (
        <button
          onClick={handleQuickSync}
          disabled={syncing}
          className="ml-1 p-0.5 hover:bg-amber-200 rounded text-amber-800"
          title="Force Sync Now"
        >
          <RefreshCw className={`w-3 h-3 ${syncing ? "animate-spin" : ""}`} />
        </button>
      )}
    </Link>
  );
}
