import React from "react";
import {
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  AlertCircle,
  XCircle,
} from "lucide-react";

const STEPS = [
  { status: "Order Placed", label: "Order Placed", icon: Clock },
  { status: "In Production", label: "In Production", icon: Clock },
  { status: "Shipped", label: "Shipped", icon: Truck },
  { status: "Delivered", label: "Delivered", icon: PackageCheck },
];

export default function TrackingStepper({ order, onCancelOrder }) {
  if (!order) return null;

  const isCancelled = order.status === "Cancelled";

  const getStepIndex = (status) => {
    switch (status) {
      case "Order Placed":
        return 0;
      case "In Production":
        return 1;
      case "Shipped":
        return 2;
      case "Delivered":
        return 3;
      default:
        return 0;
    }
  };

  const currentIndex = isCancelled ? -1 : getStepIndex(order.status);
  const canCancel = order.status === "Order Placed";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-8">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-extrabold text-slate-100">
              Order {order.order_number}
            </h3>
            <span
              className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                isCancelled
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  : order.status === "Delivered"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              }`}
            >
              {order.status}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Customer:{" "}
            <span className="text-slate-200">{order.customer_email}</span>{" "}
            &bull; Placed:{" "}
            <span className="text-slate-200">
              {new Date(order.created_at || Date.now()).toLocaleDateString()}
            </span>
          </p>
        </div>

        {canCancel && (
          <button
            onClick={() => onCancelOrder(order.id || order.order_number)}
            className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <XCircle className="h-4 w-4" />
            Cancel Order
          </button>
        )}
      </div>

      {/* 4-Step Progress Bar */}
      {!isCancelled ? (
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400/90">
            Fulfillment Progress
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
            {STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              const isCompleted = idx < currentIndex;
              const isCurrent = idx === currentIndex;

              return (
                <div
                  key={step.status}
                  className={`p-4 rounded-xl border flex flex-col items-center text-center gap-2 transition-all ${
                    isCurrent
                      ? "bg-amber-500/10 border-amber-500 text-amber-400 shadow-lg"
                      : isCompleted
                        ? "bg-slate-800/80 border-slate-700 text-slate-200"
                        : "bg-slate-900/50 border-slate-800/80 text-slate-600"
                  }`}
                >
                  <div
                    className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs ${
                      isCurrent
                        ? "bg-amber-500 text-slate-950"
                        : isCompleted
                          ? "bg-emerald-500 text-slate-950"
                          : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span className="text-xs font-bold">{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-semibold flex items-center gap-2">
          <XCircle className="h-5 w-5 shrink-0" />
          <span>This order has been cancelled by customer request.</span>
        </div>
      )}

      {/* Tracking Number Link if Shipped */}
      {order.tracking_number && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
            <Truck className="h-5 w-5" />
            <span>Fulfillment Dispatch Tracking Number:</span>
          </div>
          <span className="text-sm font-extrabold text-slate-100 tracking-wider font-mono">
            {order.tracking_number}
          </span>
        </div>
      )}

      {/* Items & Shipping Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Shipping Address
          </h4>
          <div className="text-xs text-slate-300 space-y-1 bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
            <p className="font-semibold text-slate-100">
              {order.shipping_address?.full_name}
            </p>
            <p>{order.shipping_address?.address_line1}</p>
            <p>
              {order.shipping_address?.city}, {order.shipping_address?.state}{" "}
              {order.shipping_address?.postal_code}
            </p>
            <p>{order.shipping_address?.country}</p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Financial Summary
          </h4>
          <div className="text-xs text-slate-300 space-y-1.5 bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-400">Subtotal:</span>
              <span className="font-semibold">
                ${parseFloat(order.subtotal || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Freight:</span>
              <span className="font-semibold">
                ${parseFloat(order.shipping_fee || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sales Tax:</span>
              <span className="font-semibold">
                ${parseFloat(order.tax_amount || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between pt-1.5 border-t border-slate-700 font-bold text-amber-400 text-sm">
              <span>Total:</span>
              <span>${parseFloat(order.total_amount || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
