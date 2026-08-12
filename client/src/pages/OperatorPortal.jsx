import React, { useState, useEffect } from "react";
import OperatorKanbanBoard from "../components/OperatorKanbanBoard";
import { ordersAPI } from "../services/api";
import {
  WashingMachine,
  RefreshCw,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function OperatorPortal() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await ordersAPI.getOrders();
      setOrders(data || []);
    } catch (err) {
      setOrders([
        {
          id: "1001-order-uuid",
          service_type: "Wash & Fold",
          status: "Received",
          weight_kg: 5.5,
          item_count: 12,
        },
        {
          id: "1002-order-uuid",
          service_type: "Dry Cleaning",
          status: "Washing",
          weight_kg: 3.2,
          item_count: 5,
        },
        {
          id: "1003-order-uuid",
          service_type: "Ironing Only",
          status: "Ready_for_Delivery",
          weight_kg: 4.0,
          item_count: 8,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderUpdated = (updatedOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)),
    );
  };

  const totalOrders = orders.length;
  const washingCount = orders.filter(
    (o) => o.status === "Washing" || o.status === "Drying",
  ).length;
  const readyCount = orders.filter(
    (o) => o.status === "Ready_for_Delivery",
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Laundry Operator Management Portal
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage multi-stage washing workflows, log actual garment weights,
            and flag special processing.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
          />
          <span>Refresh Workflow</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
            <WashingMachine className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              {totalOrders}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Total Orders Active
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-lg">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              {washingCount}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              In Washing / Drying
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              {readyCount}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Ready for Dispatch
            </div>
          </div>
        </div>
      </div>

      <OperatorKanbanBoard
        orders={orders}
        onOrderUpdated={handleOrderUpdated}
      />
    </div>
  );
}
