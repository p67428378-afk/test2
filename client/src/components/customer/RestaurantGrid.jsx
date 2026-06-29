import React from "react";
import RestaurantCard from "./RestaurantCard";

export default function RestaurantGrid({ restaurants, onRestaurantClick }) {
  if (restaurants.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-outline-variant p-8">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">
          restaurant_menu
        </span>
        <h3 className="text-lg font-bold text-on-surface mb-2">
          No Restaurants Found
        </h3>
        <p className="text-sm text-on-surface-variant">
          Try adjusting your search or filters to find what you are looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          onClick={() => onRestaurantClick(restaurant)}
        />
      ))}
    </div>
  );
}
