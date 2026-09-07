import React from "react";
import { Link } from "react-router-dom";
import { Star, ArrowRight, PackageX, Sparkles } from "lucide-react";

export default function BoxCatalogGrid({
  boxes = [],
  loading,
  onResetFilters,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm animate-pulse space-y-4"
          >
            <div className="h-48 bg-slate-200 rounded-xl w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-6 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 bg-slate-200 rounded w-1/4"></div>
              <div className="h-8 bg-slate-200 rounded-lg w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!boxes || boxes.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm max-w-xl mx-auto my-8">
        <div className="inline-flex p-4 rounded-full bg-amber-50 text-amber-700 mb-4">
          <PackageX className="w-10 h-10" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">
          No Subscription Boxes Found
        </h3>
        <p className="text-slate-600 text-sm mb-6">
          No curations match your current filter selections. Try adjusting your
          category, price range, or rating threshold.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-6 py-2.5 bg-primary hover:bg-slate-800 text-white font-medium rounded-full text-sm transition-colors shadow-sm"
          >
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {boxes.map((box) => (
        <div
          key={box.id}
          className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group"
        >
          {/* Card Image */}
          <div className="relative h-48 bg-slate-100 overflow-hidden">
            {box.image_url ? (
              <img
                src={box.image_url}
                alt={box.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-800 to-indigo-950 flex items-center justify-center p-6 text-center text-white">
                <div>
                  <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-80" />
                  <span className="font-serif font-bold text-lg text-amber-100">
                    {box.title}
                  </span>
                </div>
              </div>
            )}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-primary uppercase tracking-wider shadow-sm">
              {box.category_name || "Curated Box"}
            </div>
            <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-amber-400 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>
                {box.average_rating ? box.average_rating.toFixed(1) : "New"}
              </span>
              <span className="text-slate-400 text-[10px]">
                ({box.total_reviews || 0})
              </span>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                {box.title}
              </h3>
              <p className="text-slate-600 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                {box.description ||
                  "Monthly curation featuring handpicked items delivered straight to your doorstep."}
              </p>
            </div>

            {/* Price & Billing */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xl font-bold text-primary font-serif">
                  ${Number(box.price).toFixed(2)}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  /{box.billing_frequency || "mo"}
                </span>
              </div>
              <Link
                to={`/boxes/${box.id}`}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-amber-800 bg-slate-100 hover:bg-amber-50 px-3 py-2 rounded-xl transition-all"
              >
                <span>View Curation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
