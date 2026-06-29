import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Badge from "../common/Badge";
import { orderService } from "../../services/api";

export default function ActiveOrderTracker({ orderId, onClose }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrderDetails = async () => {
    try {
      const data = await orderService.get(orderId);
      setOrder(data);
      setError("");
    } catch (err) {
      setError("Failed to load order tracking details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    const interval = setInterval(fetchOrderDetails, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-coral"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6 text-center text-error bg-error-container/20 rounded-2xl border border-error/20">
        <p className="font-semibold">{error || "Order not found"}</p>
      </div>
    );
  }

  const steps = [
    { label: "Pending", status: "pending", icon: "pending_actions" },
    { label: "Accepted", status: "accepted", icon: "thumb_up" },
    { label: "Preparing", status: "preparing", icon: "cooking" },
    {
      label: "Ready for Pickup",
      status: "ready_for_pickup",
      icon: "local_mall",
    },
    {
      label: "Out for Delivery",
      status: "out_for_delivery",
      icon: "delivery_dining",
    },
    { label: "Delivered", status: "delivered", icon: "sports_motorsports" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.status === order.status);

  return (
    <div className="bg-white rounded-2xl border border-outline-variant p-6 space-y-6 shadow-sm">
      <div className="flex justify-between items-start border-b border-outline-variant pb-4">
        <div>
          <h3 className="font-headline-md text-on-surface text-lg font-bold">
            Track Order #{order.id.slice(0, 8)}
          </h3>
          <p className="font-body-md text-xs text-on-surface-variant mt-1">
            Placed on {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge status={order.status} />
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-surface-container-high text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="relative flex justify-between items-center max-w-xl mx-auto py-4">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-surface-container-highest -z-10">
          <div
            className="h-full bg-brand-coral transition-all duration-500"
            style={{
              width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%`,
            }}
          ></div>
        </div>
        {steps.map((step, idx) => {
          const isCompleted = idx <= currentStepIndex;
          const isActive = idx === currentStepIndex;
          return (
            <div
              key={step.status}
              className="flex flex-col items-center gap-2 bg-white px-2"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isActive
                    ? "bg-brand-coral border-brand-coral text-white scale-110 shadow-md"
                    : isCompleted
                      ? "bg-brand-coral/10 border-brand-coral text-brand-coral"
                      : "bg-white border-outline-variant text-on-surface-variant"
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {step.icon}
                </span>
              </div>
              <span
                className={`font-label-sm text-[10px] text-center max-w-[70px] ${
                  isActive
                    ? "text-brand-coral font-bold"
                    : "text-on-surface-variant"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Simulated Map / Delivery Partner Info */}
      {order.delivery && (
        <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center">
                <span className="material-symbols-outlined">
                  sports_motorsports
                </span>
              </div>
              <div>
                <p className="font-label-md text-sm text-on-surface font-bold">
                  {order.delivery.delivery_partner?.full_name ||
                    "Delivery Partner Assigned"}
                </p>
                <p className="font-label-sm text-xs text-on-surface-variant mt-0.5">
                  {order.delivery.delivery_partner?.phone ||
                    "Contacting driver..."}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-green/10 text-brand-green border border-brand-green/20 capitalize">
              {order.delivery.status.replace(/_/g, " ")}
            </span>
          </div>

          {/* Simulated Map Visual */}
          <div className="h-48 bg-surface-container-highest rounded-lg relative overflow-hidden border border-outline-variant flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#8e706f_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="absolute flex flex-col items-center gap-1 left-1/4 top-1/3">
              <span className="material-symbols-outlined text-brand-coral text-3xl animate-bounce">
                restaurant
              </span>
              <span className="bg-white px-2 py-0.5 rounded shadow-sm text-[10px] font-bold">
                Restaurant
              </span>
            </div>
            <div className="absolute flex flex-col items-center gap-1 right-1/4 bottom-1/3">
              <span className="material-symbols-outlined text-brand-green text-3xl">
                home
              </span>
              <span className="bg-white px-2 py-0.5 rounded shadow-sm text-[10px] font-bold">
                Your Home
              </span>
            </div>
            {order.status === "out_for_delivery" && (
              <div className="absolute flex flex-col items-center gap-1 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
                <span className="material-symbols-outlined text-indigo-600 text-3xl">
                  sports_motorsports
                </span>
                <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded shadow-sm text-[10px] font-bold">
                  Driver
                </span>
              </div>
            )}
            <p className="absolute bottom-3 left-3 text-[10px] font-semibold text-on-surface-variant bg-white/80 px-2 py-1 rounded backdrop-blur-sm">
              GPS: {order.delivery.current_latitude?.toFixed(4) || "37.7749"},{" "}
              {order.delivery.current_longitude?.toFixed(4) || "-122.4194"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

ActiveOrderTracker.propTypes = {
  orderId: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};
