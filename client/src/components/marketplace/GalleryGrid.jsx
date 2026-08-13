import React from "react";
import PaintingCard from "./PaintingCard";

export default function GalleryGrid({ paintings = [] }) {
  if (!paintings || paintings.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-outline-variant rounded-lg bg-surface">
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          No paintings available at the moment. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
      {paintings.map((painting) => (
        <PaintingCard key={painting.id} painting={painting} />
      ))}
    </div>
  );
}
