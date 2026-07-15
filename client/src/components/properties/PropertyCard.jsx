import React from "react";

export default function PropertyCard({ property, onViewDetails }) {
  const defaultImage =
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80";
  const imageUrl =
    property.images && property.images.length > 0
      ? property.images[0].image_url
      : defaultImage;

  return (
    <div
      onClick={() => onViewDetails(property)}
      className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] transition-all duration-300 border border-outline-variant/50 group cursor-pointer"
    >
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
        <div className="absolute top-sm left-sm bg-secondary-container/90 text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-xs backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-secondary"></span>
          For Sale
        </div>
      </div>
      <div className="p-md">
        <div className="flex justify-between items-start mb-sm">
          <div>
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
              ${property.price ? property.price.toLocaleString() : "N/A"}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant truncate w-48">
              {property.title}
            </p>
          </div>
          <div className="text-right">
            <p className="font-label-sm text-label-sm text-outline">
              {property.location}
            </p>
          </div>
        </div>
        <div className="flex gap-md mb-md pb-md border-b border-outline-variant/40">
          <div className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant bg-surface-container py-1 px-2 rounded">
            <span className="material-symbols-outlined text-[16px]">bed</span>{" "}
            {property.bedrooms} Beds
          </div>
          <div className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant bg-surface-container py-1 px-2 rounded">
            <span className="material-symbols-outlined text-[16px]">
              shower
            </span>{" "}
            {property.bathrooms} Baths
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-sm">
            <div className="w-6 h-6 rounded-full bg-primary-fixed-dim text-on-primary-fixed flex items-center justify-center font-label-sm text-[10px] font-bold">
              BR
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Broker Listing
            </span>
          </div>
          <button className="text-primary font-label-sm text-label-sm hover:underline">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
