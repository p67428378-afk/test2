import React, { useState, useEffect } from "react";
import CustomerBookingCard from "../components/CustomerBookingCard";
import LiveTrackingTimeline from "../components/LiveTrackingTimeline";
import InvoicePaymentWidget from "../components/InvoicePaymentWidget";
import { ordersAPI } from "../services/api";
import { Package, RefreshCw, AlertCircle } from "lucide-react";

export default function CustomerDashboard() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ordersAPI.getOrders();
      setOrders(data || []);
      if (data && data.length > 0) {
        setSelectedOrder(data[0]);
      }
    } catch (err) {
      setError(
        "Could not fetch existing orders. Local dev default state loaded.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderCreated = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrder(newOrder);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Customer Laundry Portal
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Schedule pickup time slots, track multi-stage garment status, and
            complete Stripe payments.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
          />
          <span>Refresh Orders</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <CustomerBookingCard onOrderCreated={handleOrderCreated} />
        </div>

        <div className="lg:col-span-7 space-y-6">
          {orders.length > 0 && (
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center space-x-1">
                <Package className="h-4 w-4 text-blue-600" />
                <span>Your Active Orders ({orders.length})</span>
              </h3>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {orders.map((ord) => {
                  const isSel = selectedOrder?.id === ord.id;
                  return (
                    <button
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className={`px-3 py-2 rounded-xl text-xs text-left border transition-all flex-shrink-0 ${
                        isSel
                          ? "border-blue-600 bg-blue-50/60 font-bold text-blue-900"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <div className="font-mono">#{ord.id?.slice(0, 8)}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {ord.service_type}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <LiveTrackingTimeline order={selectedOrder || orders[0]} />

          <InvoicePaymentWidget order={selectedOrder || orders[0]} />
        </div>
      </div>
    </div>
  );
}
