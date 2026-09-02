import React from "react";
import {
  RefreshCw,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function SyncQueueTable({
  transactions = [],
  onForceSync,
  onClearQueue,
  syncing = false,
}) {
  return (
    <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden space-y-4 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-stone-900 flex items-center space-x-2">
            <span>Pending Offline Transaction Queue</span>
            <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-900 font-mono rounded-full font-bold">
              {transactions.length} Queued
            </span>
          </h3>
          <p className="text-xs text-stone-500">
            Offline field logs stored in local IndexedDB auto-sync upon server
            reconnect
          </p>
        </div>
        <div className="flex space-x-2">
          {transactions.length > 0 && (
            <button
              onClick={onClearQueue}
              disabled={syncing}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded flex items-center space-x-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Queue</span>
            </button>
          )}
          <button
            onClick={onForceSync}
            disabled={syncing || transactions.length === 0}
            className={`px-4 py-2 text-white text-xs font-bold rounded shadow-sm flex items-center space-x-2 transition-colors ${
              syncing || transactions.length === 0
                ? "bg-amber-800/50 cursor-not-allowed"
                : "bg-amber-900 hover:bg-amber-800"
            }`}
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`}
            />
            <span>{syncing ? "Syncing Batch..." : "Force Immediate Sync"}</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-stone-200 rounded-lg">
        <table className="w-full text-xs font-mono text-left text-stone-700">
          <thead className="bg-stone-100 uppercase text-stone-500 font-bold border-b border-stone-200">
            <tr>
              <th className="p-3">TX ID</th>
              <th className="p-3">Payload Type</th>
              <th className="p-3">Client Timestamp</th>
              <th className="p-3">Payload Details</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-stone-500 italic"
                >
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <span>
                    No queued offline transactions. IndexedDB queue is empty &
                    fully synced.
                  </span>
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.client_tx_id} className="hover:bg-stone-50">
                  <td className="p-3 font-bold text-amber-900">
                    {tx.client_tx_id}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-stone-200 text-stone-800 rounded font-sans font-semibold">
                      {tx.payload_type}
                    </span>
                  </td>
                  <td className="p-3 text-stone-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(tx.client_timestamp).toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 max-w-xs truncate text-[11px] text-stone-600">
                    {JSON.stringify(tx.payload)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center space-x-1 ${
                        tx.status === "synced"
                          ? "bg-emerald-100 text-emerald-800"
                          : tx.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {tx.status === "failed" && (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      <span>{tx.status?.toUpperCase() || "QUEUED"}</span>
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
