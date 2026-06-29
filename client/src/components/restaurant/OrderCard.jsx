import React from "react";
import PropTypes from "prop-types";
import Badge from "../common/Badge";
import Button from "../common/Button";

export default function OrderCard({ order, onUpdateStatus }) {
  return (
    <div className="bg-white rounded-2xl border border-outline-variant p-6 space-y-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start border-b border-outline-variant/50 pb-3">
        <div>
          <h4 className="font-headline-md text-on-surface text-base font-bold">
            Order #{order.id.slice(0, 8)}
          </h4>
          <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <Badge status={order.status} />
      </div>

      <div className="space-y-2">
        <p className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">
          Items
        </p>
        <ul className="space-y-1.5">
          {order.items?.map((item) => (
            <li
              key={item.id}
              className="flex justify-between text-sm text-on-surface"
            >
              <span>
                <span className="font-bold text-brand-coral">
                  {item.quantity}x
                </span>{" "}
                {item.menu_item?.name || "Menu Item"}
              </span>
              <span className="font-medium text-on-surface-variant">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-outline-variant/50">
        <div>
          <p className="font-label-sm text-xs text-on-surface-variant">
            Total Amount
          </p>
          <p className="font-headline-md text-brand-coral text-lg font-black">
            ${order.total_amount?.toFixed(2)}
          </p>
        </div>
        <div className="flex gap-2">
          {order.status === "pending" && (
            <>
              <Button
                onClick={() => onUpdateStatus(order.id, "cancelled")}
                variant="secondary"
                className="py-1.5 px-3 text-xs"
              >
                Decline
              </Button>
              <Button
                onClick={() => onUpdateStatus(order.id, "accepted")}
                variant="primary"
                className="py-1.5 px-4 text-xs"
              >
                Accept
              </Button>
            </>
          )}
          {order.status === "accepted" && (
            <Button
              onClick={() => onUpdateStatus(order.id, "preparing")}
              variant="primary"
              className="py-1.5 px-4 text-xs"
            >
              Start Preparing
            </Button>
          )}
          {order.status === "preparing" && (
            <Button
              onClick={() => onUpdateStatus(order.id, "ready_for_pickup")}
              variant="success"
              className="py-1.5 px-4 text-xs"
            >
              Ready for Pickup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

OrderCard.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    total_amount: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
        menu_item: PropTypes.shape({
          name: PropTypes.string,
        }),
      }),
    ),
  }).isRequired,
  onUpdateStatus: PropTypes.func.isRequired,
};
