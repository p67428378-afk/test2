import React, { useState, useEffect } from "react";
import TrackingStepper from "../components/TrackingStepper.jsx";
import { orderService } from "../services/api.js";
import { Search, Truck, AlertCircle, RefreshCw } from "lucide-react";

export default function OrderTrackingPage({ initialOrderNumber = "" }) {
  const [queryInput, setQueryInput] = useState(
    initialOrderNumber || "test@example.com",
  );
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setMsg("");
    setLoading(true);

    try {
      if (queryInput.includes("@")) {
        // Search by email
        const res = await orderService.getOrders(queryInput);
        setOrders(res || []);
        if (res.length === 0) {
          setError(`No orders found for customer email '${queryInput}'.`);
        }
      } else {
        // Search by Order Number or Order UUID
        const singleOrder = await orderService.getOrderDetail(queryInput);
        setOrders([singleOrder]);
      }
    } catch (err) {
      console.error("Order search error", err);
      setError(
        err.response?.data?.detail ||
          "Order not found. Please check your order number or email.",
      );
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleCancelOrder = async (orderIdentifier) => {
    setError("");
    setMsg("");
    try {
      await orderService.cancelOrder(orderIdentifier);
      setMsg(`Order ${orderIdentifier} has been successfully cancelled.`);
      handleSearch();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          "Failed to cancel order. Cancellation is only permitted when status is 'Order Placed'.",
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-100">
              Order Status & Real-Time Tracking
            </h1>
            <p className="text-xs text-slate-400">
              Enter your Order Number (e.g. ORD-XXXXXX) or Customer Email to
              track shipment progress.
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3 pt-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              required
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Order Number or Email address..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 shrink-0"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              "Track Order"
            )}
          </button>
        </form>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-semibold">
          {msg}
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Orders Steppers List */}
      <div className="space-y-6">
        {orders.map((order) => (
          <TrackingStepper
            key={order.id || order.order_number}
            order={order}
            onCancelOrder={handleCancelOrder}
          />
        ))}
      </div>
    </div>
  );
}
