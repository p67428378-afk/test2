import React from "react";
import GreetingCard from "./GreetingCard.jsx";

export default function GreetingsGrid({ greetings, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] overflow-hidden p-6 animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <span className="material-symbols-outlined text-red-500 text-4xl mb-2">
          error
        </span>
        <h3 className="text-lg font-semibold text-red-800 mb-1">
          Failed to load greetings
        </h3>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (greetings.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12 text-center">
        <span className="material-symbols-outlined text-gray-400 text-5xl mb-3">
          search_off
        </span>
        <h3 className="text-lg font-semibold text-gray-700 mb-1">
          No greetings found
        </h3>
        <p className="text-sm text-gray-500">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {greetings.map((greeting) => (
        <GreetingCard key={greeting.id} greeting={greeting} />
      ))}
    </div>
  );
}
