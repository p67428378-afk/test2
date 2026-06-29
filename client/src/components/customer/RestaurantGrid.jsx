import React from "react";
import PropTypes from "prop-types";
import RestaurantCard from "./RestaurantCard";

export default function RestaurantGrid({ restaurants, onSelectRestaurant }) {
  if (restaurants.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-outline-variant p-8">
        <span className="material-symbols-outlined text-on-surface-variant text-5xl mb-3">
          search_off
        </span>
        <h3 className="font-headline-md text-on-surface text-lg font-bold mb-1">
          No restaurants found
        </h3>
        <p className="font-body-md text-sm text-on-surface-variant">
          Try adjusting your search or filters.
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
          onClick={() => onSelectRestaurant(restaurant)}
        />
      ))}
    </div>
  );
}

RestaurantGrid.propTypes = {
  restaurants: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelectRestaurant: PropTypes.func.isRequired,
};
