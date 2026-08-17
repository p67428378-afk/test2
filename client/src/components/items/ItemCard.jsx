import React from "react";
import { MapPin, Calendar, Tag, AlertCircle, CheckCircle } from "lucide-react";

export default function ItemCard({ item, isActive, onClick }) {
  const isLost = item.status?.toLowerCase() === "lost";
  const formattedDate = item.report_date
    ? new Date(item.report_date).toLocaleDateString()
    : "";

  // Fallback image if none provided
  const imageUrl =
    item.images && item.images.length > 0
      ? item.images[0].image_url
      : "https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80";

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-4 shadow-sm border-2 cursor-pointer hover:shadow-md transition-all flex gap-4 relative overflow-hidden group ${
        isActive
          ? "border-indigo-600"
          : "border-slate-200/60 hover:border-indigo-300"
      }`}
    >
      <div className="w-24 h-24 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden relative">
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex flex-col justify-between flex-grow min-w-0">
        <div>
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className="text-base font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
              {item.name}
            </h3>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                isLost
                  ? "bg-rose-50 text-rose-700 border border-rose-100"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-100"
              }`}
            >
              {isLost ? (
                <AlertCircle className="h-3.5 w-3.5" />
              ) : (
                <CheckCircle className="h-3.5 w-3.5" />
              )}
              <span className="capitalize">{item.status}</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
            <Tag className="h-3.5 w-3.5" />
            <span className="truncate">{item.category}</span>
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1 min-w-0">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{item.location}</span>
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap">
            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{formattedDate}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
