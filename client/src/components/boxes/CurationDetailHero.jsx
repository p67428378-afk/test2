import React from "react";
import {
  Star,
  ShieldCheck,
  Truck,
  RefreshCw,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function CurationDetailHero({ box, onOpenReviewModal }) {
  if (!box) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Image or Gradient Card */}
        <div className="lg:col-span-5 relative h-64 md:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-indigo-950 flex items-center justify-center p-6 text-center shadow-inner">
          {box.image_url ? (
            <img
              src={box.image_url}
              alt={box.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-white space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-amber-100">
                {box.title}
              </h2>
              <span className="inline-block bg-slate-800/90 border border-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
                {box.category_name || "Subscription Curation"}
              </span>
            </div>
          )}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary uppercase tracking-wider shadow-sm">
            {box.category_name || "Curated"}
          </div>
        </div>

        {/* Right Column: Key Details */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                {box.billing_frequency || "Monthly"} Curation
              </span>
              <div className="flex items-center gap-1.5 text-slate-700 text-sm font-semibold">
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= Math.round(box.average_rating || 0)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200 fill-slate-100"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-slate-900">
                  {box.average_rating ? box.average_rating.toFixed(1) : "New"}
                </span>
                <span className="text-slate-400 font-normal">
                  ({box.total_reviews || 0} reviews)
                </span>
              </div>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              {box.title}
            </h1>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              {box.description}
            </p>
          </div>

          {/* Pricing & CTA */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
                Price
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-3xl font-bold text-primary">
                  ${Number(box.price).toFixed(2)}
                </span>
                <span className="text-slate-500 text-sm font-medium">
                  /{box.billing_frequency || "mo"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={onOpenReviewModal}
                className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors"
              >
                Write Review
              </button>
              <button
                onClick={() =>
                  alert(`Subscribed to ${box.title}! (Demo Action)`)
                }
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-primary font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>Subscribe Now</span>
              </button>
            </div>
          </div>

          {/* Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 text-center border-t border-slate-100">
            <div className="flex items-center justify-center gap-1.5 text-slate-600 text-xs font-medium">
              <Truck className="w-4 h-4 text-secondary" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-slate-600 text-xs font-medium">
              <RefreshCw className="w-4 h-4 text-secondary" />
              <span>Cancel Anytime</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-slate-600 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              <span>Verified Reviews</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
