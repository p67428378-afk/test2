import React from "react";
import Badge from "../common/Badge";

export default function ActiveOrderTracker({
  order,
  onCancel,
  onSubmitFeedback,
}) {
  const [rating, setRating] = React.useState(5);
  const [feedback, setFeedback] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const getStatusStep = (status) => {
    const steps = [
      "pending",
      "preparing",
      "ready_for_pickup",
      "out_for_delivery",
      "delivered",
    ];
    return steps.indexOf(status);
  };

  const currentStep = getStatusStep(order.status);

  const steps = [
    { label: "Placed", icon: "receipt" },
    { label: "Preparing", icon: "cooking" },
    { label: "Ready", icon: "inventory_2" },
    { label: "On the Way", icon: "delivery_dining" },
    { label: "Delivered", icon: "sports_motorsports" },
  ];

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmitFeedback(order.id, rating, feedback);
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit feedback", err);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-outline-variant pb-4">
        <div>
          <h3 className="font-headline-md text-lg font-bold text-on-surface">
            Order #{order.id.substring(0, 8)}
          </h3>
          <p className="text-xs text-on-surface-variant">
            Placed on {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <Badge variant={order.status === "delivered" ? "success" : "warning"}>
          {order.status.replace("_", " ").toUpperCase()}
        </Badge>
      </div>

      {/* Progress Bar */}
      {order.status !== "cancelled" && (
        <div className="py-4">
          <div className="relative flex items-center justify-between">
            {/* Progress Line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-surface-container-high z-0">
              <div
                className="h-full bg-brand-coral transition-all duration-500"
                style={{
                  width: `${(currentStep / (steps.length - 1)) * 100}%`,
                }}
              ></div>
            </div>

            {/* Steps */}
            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStep;
              const isActive = idx === currentStep;
              return (
                <div
                  key={step.label}
                  className="relative z-10 flex flex-col items-center"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? "bg-brand-coral text-white shadow-md"
                        : "bg-white border-2 border-outline-variant text-on-surface-variant"
                    } ${isActive ? "ring-4 ring-brand-coral/20 scale-110" : ""}`}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {step.icon}
                    </span>
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      isCompleted
                        ? "text-on-surface font-bold"
                        : "text-on-surface-variant"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delivery Partner Info */}
      {order.delivery && order.delivery.delivery_partner && (
        <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-coral/10 flex items-center justify-center text-brand-coral">
              <span className="material-symbols-outlined text-2xl">
                sports_motorsports
              </span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-medium">
                Your Delivery Partner
              </p>
              <p className="font-bold text-on-surface">
                {order.delivery.delivery_partner.full_name}
              </p>
              <p className="text-xs text-on-surface-variant">
                {order.delivery.delivery_partner.phone}
              </p>
            </div>
          </div>
          {order.status === "out_for_delivery" && (
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-xs text-brand-green font-bold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-brand-green"></span>
                Sharing Live Location
              </span>
              <p className="text-[10px] text-on-surface-variant mt-1">
                Lat: {order.delivery.current_latitude?.toFixed(4)}, Lng:{" "}
                {order.delivery.current_longitude?.toFixed(4)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Order Items Summary */}
      <div className="space-y-3">
        <h4 className="font-bold text-sm text-on-surface">Items Summary</h4>
        <div className="divide-y divide-outline-variant border border-outline-variant rounded-xl overflow-hidden bg-surface-container-lowest">
          {order.items &&
            order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-brand-coral">
                    {item.quantity}x
                  </span>
                  <span className="text-on-surface">
                    {item.menu_item?.name || "Menu Item"}
                  </span>
                </div>
                <span className="font-medium text-on-surface">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
        </div>
        <div className="flex justify-between items-center pt-2 font-bold text-on-surface">
          <span>Total Amount (incl. delivery)</span>
          <span className="text-lg text-brand-coral">
            ${order.total_amount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
        {order.status === "pending" && onCancel && (
          <button
            onClick={() => onCancel(order.id)}
            className="px-4 py-2 border border-error text-error hover:bg-error/5 rounded-brand font-label-md text-label-md transition-all"
          >
            Cancel Order
          </button>
        )}

        {order.status === "delivered" && !order.rating && !submitted && (
          <form
            onSubmit={handleFeedbackSubmit}
            className="w-full space-y-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant"
          >
            <h4 className="font-bold text-sm text-on-surface">
              Rate your experience
            </h4>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-2xl focus:outline-none"
                >
                  <span
                    className={`material-symbols-outlined ${star <= rating ? "text-amber-500 fill-current" : "text-on-surface-variant"}`}
                  >
                    star
                  </span>
                </button>
              ))}
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Leave a comment about the food or delivery..."
              className="w-full p-3 border border-outline-variant rounded-brand text-sm focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none bg-white"
              rows="3"
              required
            />
            <button
              type="submit"
              className="w-full bg-brand-coral hover:bg-brand-coral/90 text-white font-label-md text-label-md py-2 rounded-brand transition-all"
            >
              Submit Feedback
            </button>
          </form>
        )}

        {order.status === "delivered" && (order.rating || submitted) && (
          <div className="w-full bg-brand-green/10 text-brand-green p-4 rounded-xl border border-brand-green/20 text-center text-sm font-medium">
            Thank you for your feedback!
          </div>
        )}
      </div>
    </div>
  );
}
