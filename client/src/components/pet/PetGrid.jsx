import React from "react";
import PetCard from "./PetCard";

export const PetGrid = ({ pets, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-100 h-96 animate-pulse"
          >
            <div className="h-48 bg-slate-200" />
            <div className="p-5 space-y-4">
              <div className="h-6 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="h-4 bg-slate-200 rounded w-5/6" />
              <div className="h-10 bg-slate-200 rounded mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!pets || pets.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-100 shadow-sm">
        <p className="text-slate-500 text-lg">
          No pets found matching your criteria.
        </p>
        <p className="text-slate-400 text-sm mt-1">
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet} />
      ))}
    </div>
  );
};

export default PetGrid;
