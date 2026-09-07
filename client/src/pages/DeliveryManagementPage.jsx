import React, { useState, useEffect } from "react";
import PackageLogForm from "../components/PackageLogForm";
import DeliveryTable from "../components/DeliveryTable";
import { getDeliveries, getOverdueDeliveries } from "../services/api";
import { RefreshCw, AlertTriangle, Package } from "lucide-react";

export default function DeliveryManagementPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [overdueCount, setOverdueCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const data = await getDeliveries();
      setDeliveries(data);

      const overdueData = await getOverdueDeliveries();
      setOverdueCount(overdueData.length);
    } catch (err) {
      console.error("Failed to load deliveries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleDeliveryLogged = () => {
    fetchDeliveries();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Delivery Package Management
          </h1>
          <p className="text-sm text-slate-600">
            Log incoming courier parcels for resident units, trigger push
            alerts, and track pickup.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {overdueCount > 0 && (
            <div className="bg-red-100 text-red-800 border border-red-300 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-pulse">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>{overdueCount} Package(s) Overdue (&gt;48h)</span>
            </div>
          )}

          <button
            onClick={fetchDeliveries}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 px-3 rounded-lg border border-slate-300 transition"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />{" "}
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <PackageLogForm onDeliveryLogged={handleDeliveryLogged} />
        <DeliveryTable deliveries={deliveries} onRefresh={fetchDeliveries} />
      </div>
    </div>
  );
}
