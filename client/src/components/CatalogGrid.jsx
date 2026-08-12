import React from "react";
import { Sparkles, Sliders, ShoppingBag, Eye, Info, Check } from "lucide-react";

export default function CatalogGrid({
  paintings = [],
  suggestions = null,
  total = 0,
  onSelectPainting,
  onConfigure,
  onAddToCart,
}) {
  if (paintings.length === 0) {
    return (
      <div className="space-y-8">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
            <Info className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">
            No Matching Wall Paintings Found
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            We couldn't find any artwork matching your exact search or filter
            criteria. Try adjusting your filters or explore our recommended
            popular collection below.
          </p>
        </div>

        {suggestions && suggestions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <h4 className="text-lg font-bold text-slate-100">
                Recommended Popular Collection
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.map((painting) => (
                <PaintingCard
                  key={painting.id}
                  painting={painting}
                  onSelectPainting={onSelectPainting}
                  onConfigure={onConfigure}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {paintings.map((painting) => (
        <PaintingCard
          key={painting.id}
          painting={painting}
          onSelectPainting={onSelectPainting}
          onConfigure={onConfigure}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

function PaintingCard({
  painting,
  onSelectPainting,
  onConfigure,
  onAddToCart,
}) {
  const isSoldOut =
    painting.stock_quantity < 1 || painting.status === "SOLD_OUT";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-slate-700 transition-all flex flex-col group">
      {/* Image & Badges Container */}
      <div
        className="relative aspect-[4/3] bg-slate-950 overflow-hidden cursor-pointer"
        onClick={() => onSelectPainting(painting)}
      >
        <img
          src={
            painting.image_url ||
            "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80"
          }
          alt={painting.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <span className="text-xs font-semibold text-slate-200 flex items-center gap-1">
            <Eye className="h-4 w-4 text-amber-400" />
            Click to view detail
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {painting.is_original_one_of_one && (
            <span className="px-2.5 py-1 text-[11px] font-bold bg-amber-500/90 backdrop-blur-md text-slate-950 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              1-of-1 Original
            </span>
          )}
          {painting.is_configurable && (
            <span className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-500/90 backdrop-blur-md text-white rounded-full shadow-md flex items-center gap-1">
              <Sliders className="h-3 w-3" />
              Configurable Size
            </span>
          )}
        </div>

        {isSoldOut && (
          <div className="absolute top-3 right-3 px-3 py-1 text-[11px] font-bold bg-rose-500/90 text-white rounded-full uppercase tracking-wider shadow-md">
            Sold Out
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3
              onClick={() => onSelectPainting(painting)}
              className="text-lg font-bold text-slate-100 hover:text-amber-400 cursor-pointer transition-colors line-clamp-1"
            >
              {painting.title}
            </h3>
            <span className="text-lg font-extrabold text-amber-400 whitespace-nowrap">
              ${parseFloat(painting.base_price).toFixed(2)}
            </span>
          </div>

          <p className="text-xs text-slate-400 font-medium mb-2">
            By {painting.artist_name || "Featured Artist"} &bull;{" "}
            {painting.medium || "Oil on Canvas"}
          </p>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {painting.description ||
              "Original handcrafted wall artwork created with premium archival materials."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-800 flex gap-2">
          {painting.is_configurable ? (
            <button
              onClick={() => onConfigure(painting)}
              className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sliders className="h-3.5 w-3.5" />
              Customize & Preview
            </button>
          ) : (
            <button
              disabled={isSoldOut}
              onClick={() => onAddToCart(painting)}
              className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                isSoldOut
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800"
                  : "bg-amber-500 hover:bg-amber-400 text-slate-950"
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              {isSoldOut ? "Sold Out" : "Add to Cart"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
