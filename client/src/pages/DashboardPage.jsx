import React, { useEffect, useState } from "react";
import MetricGroup from "../components/inventory/MetricGroup";
import LowStockAlerts from "../components/inventory/LowStockAlerts";
import WarehouseDistribution from "../components/inventory/WarehouseDistribution";
import QuickActions from "../components/inventory/QuickActions";
import { itemService, inventoryService } from "../services/api";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const [items, setItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [itemsData, invData, lowStockData, warehousesData] =
        await Promise.all([
          itemService.list(0, 500),
          inventoryService.list(),
          inventoryService.listLowStock(),
          inventoryService.listWarehouses(),
        ]);

      setItems(itemsData.items || []);
      setInventory(invData || []);
      setLowStockAlerts(lowStockData || []);
      setWarehouses(warehousesData || []);
    } catch (err) {
      setError(
        "Failed to fetch dashboard data. Please check your connection or try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
        <p className="text-sm text-gray-500 font-medium">
          Loading dashboard data...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Inventory Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Real-time stock levels and warehouse distribution
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-1.5 text-sm text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards */}
      <MetricGroup
        items={items}
        lowStockCount={lowStockAlerts.length}
        inventory={inventory}
        warehouses={warehouses}
      />

      {/* Quick Actions */}
      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Alerts Table */}
        <div className="lg:col-span-2">
          <LowStockAlerts alerts={lowStockAlerts} />
        </div>

        {/* Warehouse Distribution */}
        <div>
          <WarehouseDistribution
            warehouses={warehouses}
            inventory={inventory}
          />
        </div>
      </div>
    </div>
  );
}
