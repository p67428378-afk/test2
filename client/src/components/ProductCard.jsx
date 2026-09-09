import React from "react";
import { Star, ShoppingCart, Tag, CheckCircle2, XCircle } from "lucide-react";

export default function ProductCard({
  product,
  onAddToCart,
  matchScore = null,
}) {
  if (!product) return null;

  const {
    id,
    name = "Unnamed Product",
    category = "General",
    description = "",
    price = 0,
    rating = 0,
    tags = [],
    in_stock = true,
  } = product;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
      <div>
        {/* Top Header / Image Area */}
        <div className="relative h-44 bg-gradient-to-br from-slate-100 to-indigo-50/40 p-4 flex flex-col justify-between border-b border-slate-100">
          <div className="flex justify-between items-start">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-indigo-700 shadow-sm border border-indigo-100 backdrop-blur-sm">
              {category}
            </span>

            {/* In-Stock Badge */}
            <span
              className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                in_stock
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              {in_stock ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>In Stock</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 text-rose-500" />
                  <span>Out of Stock</span>
                </>
              )}
            </span>
          </div>

          {/* AI Match Score Badge (if passed) */}
          {matchScore !== null && (
            <div className="self-end">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 text-white shadow-sm">
                {(matchScore * 100).toFixed(1)}% Match
              </span>
            </div>
          )}

          {/* Visual Product Icon Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
            <Tag className="w-24 h-24 text-indigo-900" />
          </div>
        </div>

        {/* Content Details */}
        <div className="p-4 space-y-2.5">
          <h3
            className="font-bold text-base text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors"
            title={name}
          >
            {name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px]">
            {description ||
              "High-quality product tailored to user preferences and requirements."}
          </p>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((tag) => (
                <span
                  key={`${id}-tag-${tag}`}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200/80"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer / Price & Action */}
      <div className="p-4 pt-0">
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            <div className="flex items-center space-x-1 text-amber-500 text-xs font-semibold mb-0.5">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{rating ? rating.toFixed(1) : "4.5"}</span>
            </div>
            <div className="text-lg font-extrabold text-slate-900">
              ${price.toFixed(2)}
            </div>
          </div>

          <button
            type="button"
            disabled={!in_stock}
            onClick={() => onAddToCart && onAddToCart(product)}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all ${
              in_stock
                ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
