import React from "react";
import Badge from "../common/Badge";
import Button from "../common/Button";

export default function OrderCard({ order, onStatusUpdate }) {
  return (
    <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-outline-variant pb-3">
        <div>
          <h4 className="font-bold text-on-surface">
            Order #{order.id.substring(0, 8)}
          </h4>
          <p className="text-xs text-on-surface-variant">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <Badge variant={order.status === "pending" ? "primary" : "warning"}>
          {order.status.replace("_", " ").toUpperCase()}
        </Badge>
      </div>

      {/* Customer Details */}
      <div className="text-sm space-y-1">
        <p className="text-on-surface font-medium">
          <span className="text-on-surface-variant font-normal">Customer:</span>{" "}
          {order.user?.full_name || "Guest"}
        </p>
        <p className="text-on-surface font-medium">
          <span className="text-on-surface-variant font-normal">Address:</span>{" "}
          {order.delivery_address}
        </p>
      </div>

      {/* Items List */}
      <div className="divide-y divide-outline-variant border border-outline-variant rounded-xl overflow-hidden bg-surface-container-lowest text-sm">
        {order.items &&
          order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3"
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

      <div className="flex justify-between items-center font-bold text-on-surface text-sm pt-2">
        <span>Total Earnings</span>
        <span className="text-brand-coral text-base">
          ${order.total_amount.toFixed(2)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant">
        {order.status === "pending" && (
          <>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onStatusUpdate(order.id, "cancelled")}
            >
              Decline
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={() => onStatusUpdate(order.id, "preparing")}
            >
              Accept & Prepare
            </Button>
          </>
        )}

        {order.status === "preparing" && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onStatusUpdate(order.id, "ready_for_pickup")}
          >
            Mark as Ready for Pickup
          </Button>
        )}
      </div>
    </div>
  );
}
