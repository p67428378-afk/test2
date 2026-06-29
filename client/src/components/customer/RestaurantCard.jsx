import React from "react";

export default function RestaurantCard({ restaurant, onClick }) {
  const defaultImage =
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden bg-surface-container-high">
        <img
          src={restaurant.image_url || defaultImage}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <span className="material-symbols-outlined text-amber-500 text-sm fill-current">
            star
          </span>
          <span className="text-xs font-bold text-on-surface">
            {restaurant.rating ? restaurant.rating.toFixed(1) : "New"}
          </span>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-headline-md text-base font-bold text-on-surface mb-1 group-hover:text-brand-coral transition-colors">
            {restaurant.name}
          </h3>
          <p className="text-xs text-on-surface-variant font-medium mb-2 capitalize">
            {restaurant.cuisine}
          </p>
          <p className="text-xs text-on-surface-variant line-clamp-2 mb-4">
            {restaurant.address}
          </p>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-outline-variant text-xs text-on-surface-variant font-medium">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">schedule</span>
            {restaurant.operating_hours || "09:00 - 22:00"}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">
              delivery_dining
            </span>
            $
            {restaurant.delivery_fee
              ? restaurant.delivery_fee.toFixed(2)
              : "0.00"}
          </span>
        </div>
      </div>
    </div>
  );
}
