import React, { useEffect, useState } from "react";
import AdjustmentForm from "../components/adjustments/AdjustmentForm";
import AuditLogTable from "../components/adjustments/AuditLogTable";
import { itemService, inventoryService } from "../services/api";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function AdjustmentsPage() {
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [adjustments, setAdjustments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [itemsData, warehousesData, adjustmentsData] = await Promise.all([
        itemService.list(0, 500),
        inventoryService.listWarehouses(),
        inventoryService.listAdjustments(),
      ]);

      setItems(itemsData.items || []);
      setWarehouses(warehousesData || []);
      setAdjustments(adjustmentsData || []);
    } catch (err) {
      setError("Failed to fetch adjustments data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSuccess = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
        <p className="text-sm text-gray-500 font-medium">
          Loading adjustments data...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto px-4 py-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Stock Adjustments & Transfers
        </h1>
        <p className="text-sm text-gray-500">
          Record manual stock adjustments, transfers, and view audit logs
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Adjustment Form */}
        <div className="lg:col-span-1">
          <AdjustmentForm
            items={items}
            warehouses={warehouses}
            onSuccess={handleSuccess}
          />
        </div>

        {/* Audit Log Table */}
        <div className="lg:col-span-2">
          <AuditLogTable adjustments={adjustments} />
        </div>
      </div>
    </div>
  );
}
