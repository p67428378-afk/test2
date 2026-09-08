import React, { useState, useEffect } from "react";
import RecurringPassForm from "../components/RecurringPassForm";
import RecurringPassTable from "../components/RecurringPassTable";
import OverstayParkingMonitor from "../components/OverstayParkingMonitor";
import ParkingAllocationGrid from "../components/ParkingAllocationGrid";
import { getRecurringPasses, getActiveOverstays } from "../services/api";
import { RefreshCw, Repeat, ParkingCircle } from "lucide-react";

export default function RecurringPassesPage() {
  const [passes, setPasses] = useState([]);
  const [activeOverstays, setActiveOverstays] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPasses = async () => {
    setLoading(true);
    try {
      const data = await getRecurringPasses();
      setPasses(data || []);

      const overstayData = await getActiveOverstays();
      setActiveOverstays(overstayData || []);
    } catch (err) {
      console.error("Failed to load recurring passes or overstays:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasses();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Recurring Passes & Parking Allocation Center
          </h1>
          <p className="text-sm text-slate-600">
            Manage multi-day recurring service staff passes and monitor 50-slot
            vehicle parking allocations.
          </p>
        </div>

        <button
          onClick={fetchPasses}
          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 px-3 rounded-lg border border-slate-300 transition"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
          />{" "}
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecurringPassForm onPassCreated={fetchPasses} />
        <RecurringPassTable passes={passes} onRefresh={fetchPasses} />
      </div>

      <div className="space-y-6">
        <OverstayParkingMonitor />
        <ParkingAllocationGrid activeOverstays={activeOverstays} />
      </div>
    </div>
  );
}
