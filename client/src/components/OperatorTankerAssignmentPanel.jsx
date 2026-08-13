import React, { useState, useEffect } from "react";
import { dispatchApi, tankersApi, usersApi } from "../services/api";
import {
  Truck,
  User,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Send,
} from "lucide-react";

export const OperatorTankerAssignmentPanel = ({
  selectedBooking,
  onAssignmentComplete,
}) => {
  const [tankers, setTankers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedTankerId, setSelectedTankerId] = useState("");
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      setError("");
      try {
        const [tankersList, driversList] = await Promise.all([
          tankersApi.list(),
          usersApi.listByRole("DRIVER"),
        ]);
        setTankers(tankersList);
        setDrivers(driversList);
      } catch (err) {
        console.error("Failed to load fleet data:", err);
        setError("Failed to load tankers or drivers fleet list.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [selectedBooking]);

  if (!selectedBooking) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center text-slate-400">
        <Truck className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-200">
          No Booking Selected
        </h3>
        <p className="text-sm mt-1">
          Select a pending request from the queue to assign fleet assets.
        </p>
      </div>
    );
  }

  const selectedTanker = tankers.find((t) => t.id === selectedTankerId);

  const handleAssign = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!selectedTankerId) {
      setError("Please select an active tanker.");
      return;
    }
    if (!selectedDriverId) {
      setError("Please select an available driver.");
      return;
    }

    if (selectedTanker) {
      if (selectedTanker.status === "IN_MAINTENANCE") {
        setError(
          `Tanker ${selectedTanker.registration_number} is currently IN_MAINTENANCE and cannot be assigned.`,
        );
        return;
      }
      if (selectedTanker.capacity_liters < selectedBooking.volume_liters) {
        setError(
          `Tanker capacity (${selectedTanker.capacity_liters.toLocaleString()}L) is less than requested volume (${selectedBooking.volume_liters.toLocaleString()}L).`,
        );
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const result = await dispatchApi.assign(
        selectedBooking.id,
        selectedDriverId,
        selectedTankerId,
      );
      setSuccessMsg(
        `Booking #${selectedBooking.id.substring(0, 8)} successfully assigned to driver and tanker.`,
      );
      setSelectedTankerId("");
      setSelectedDriverId("");
      if (onAssignmentComplete) {
        onAssignmentComplete(result);
      }
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Failed to complete dispatch assignment.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
        <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-400">
          <Truck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-100">
            Fleet Assignment
          </h3>
          <p className="text-xs text-slate-400">
            Booking{" "}
            <span className="font-mono text-sky-400">
              #{selectedBooking.id.substring(0, 8)}
            </span>{" "}
            ({selectedBooking.volume_liters.toLocaleString()} Liters)
          </p>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="p-3.5 bg-rose-900/30 border border-rose-700/50 rounded-lg text-rose-300 flex items-start gap-2.5 text-sm"
        >
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div
          role="status"
          className="p-3.5 bg-emerald-900/30 border border-emerald-700/50 rounded-lg text-emerald-300 flex items-start gap-2.5 text-sm"
        >
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleAssign} className="space-y-4">
        <div>
          <label
            htmlFor="tanker_select"
            className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5"
          >
            <Truck className="w-4 h-4 text-blue-400" />
            <span>Select Tanker Asset</span>
          </label>
          <select
            id="tanker_select"
            value={selectedTankerId}
            onChange={(e) => setSelectedTankerId(e.target.value)}
            disabled={loadingData}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 transition"
            required
          >
            <option value="">-- Choose Tanker --</option>
            {tankers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.registration_number} ({t.capacity_liters.toLocaleString()}L)
                - {t.status}
              </option>
            ))}
          </select>
        </div>

        {selectedTanker &&
          selectedTanker.capacity_liters < selectedBooking.volume_liters && (
            <div
              role="alert"
              className="p-3 bg-amber-950/60 border border-amber-700/60 rounded-lg text-amber-300 text-xs flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                Warning: Tanker capacity ({selectedTanker.capacity_liters}L) is
                below required booking volume ({selectedBooking.volume_liters}
                L).
              </span>
            </div>
          )}

        <div>
          <label
            htmlFor="driver_select"
            className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5"
          >
            <User className="w-4 h-4 text-blue-400" />
            <span>Select Active Driver</span>
          </label>
          <select
            id="driver_select"
            value={selectedDriverId}
            onChange={(e) => setSelectedDriverId(e.target.value)}
            disabled={loadingData}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 transition"
            required
          >
            <option value="">-- Choose Driver --</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.email} ({d.role})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || loadingData}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg shadow-md flex items-center justify-center gap-2 transition mt-2"
        >
          <Send className="w-4 h-4" />
          <span>
            {isSubmitting
              ? "Dispatching Asset..."
              : "Confirm Dispatch & Notify Driver"}
          </span>
        </button>
      </form>
    </div>
  );
};

export default OperatorTankerAssignmentPanel;
