import React from "react";
import PropTypes from "prop-types";

export default function RestaurantCard({ restaurant, onClick }) {
  const defaultImage =
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60";

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-outline-variant overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="relative h-48 overflow-hidden bg-surface-container-high">
        <img
          src={restaurant.image_url || defaultImage}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <span className="material-symbols-outlined text-yellow-500 text-sm fill-1">
            star
          </span>
          <span className="font-label-sm text-xs font-bold text-on-surface">
            {restaurant.rating ? restaurant.rating.toFixed(1) : "New"}
          </span>
        </div>
      </div>
      <div className="p-5 space-y-2">
        <h4 className="font-headline-md text-on-surface text-base font-bold group-hover:text-brand-coral transition-colors">
          {restaurant.name}
        </h4>
        <p className="font-body-md text-xs text-on-surface-variant line-clamp-1">
          {restaurant.cuisine}
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/50 text-xs font-medium text-on-surface-variant">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">schedule</span>
            {restaurant.operating_hours || "09:00 - 22:00"}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">
              local_shipping
            </span>
            ${restaurant.delivery_fee?.toFixed(2) || "0.00"}
          </span>
        </div>
      </div>
    </div>
  );
}

RestaurantCard.propTypes = {
  restaurant: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    cuisine: PropTypes.string.isRequired,
    rating: PropTypes.number,
    image_url: PropTypes.string,
    operating_hours: PropTypes.string,
    delivery_fee: PropTypes.number,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};
