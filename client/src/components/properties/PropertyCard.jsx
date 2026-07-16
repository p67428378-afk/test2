import React from "react";

export default function PropertyCard({ property, isSelected, onClick }) {
  const { title, location, price, bedrooms, bathrooms, image_urls } = property;
  const displayImage =
    image_urls && image_urls.length > 0
      ? image_urls[0]
      : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80";

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <div
      onClick={onClick}
      className={`bg-surface-container-lowest rounded-lg shadow-sm border overflow-hidden hover:shadow-md hover:border-primary-container/50 transition-all duration-300 group cursor-pointer ${
        isSelected
          ? "ring-2 ring-primary border-transparent"
          : "border-outline-variant/30"
      }`}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={displayImage}
        />
        <div className="absolute top-3 left-3 bg-emerald-50 text-primary-container px-2 py-1 rounded font-label-sm text-[12px] uppercase tracking-wide">
          Featured
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-label-md text-label-md font-semibold text-slate-900 mb-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="font-body-sm text-body-sm text-slate-500 flex items-center gap-1 mb-3">
          <span className="material-symbols-outlined text-[16px]">
            location_on
          </span>{" "}
          {location}
        </p>
        <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-100">
          <span className="font-headline-md text-headline-md font-bold text-slate-900">
            {formattedPrice}
          </span>
          <span className="font-body-sm text-body-sm text-slate-500">
            {bedrooms} Beds | {bathrooms} Baths
          </span>
        </div>
      </div>
    </div>
  );
}
