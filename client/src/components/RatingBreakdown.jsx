import React from "react";
import { Star } from "lucide-react";

export default function RatingBreakdown({
  ratingBreakdown = {},
  totalReviews = 0,
  averageRating = 0,
}) {
  const getCount = (star) => {
    if (!ratingBreakdown) return 0;
    return (
      ratingBreakdown[`${star}_star`] ??
      ratingBreakdown[`${star}`] ??
      ratingBreakdown[star] ??
      0
    );
  };

  const stars = [5, 4, 3, 2, 1];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Rating Distribution
          </h3>
          <p className="text-xs text-slate-500">
            Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-amber-500 justify-end">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span className="text-2xl font-extrabold text-slate-900">
              {Number(averageRating || 0).toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ 5</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {stars.map((star) => {
          const count = getCount(star);
          const percentage =
            totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

          return (
            <div key={star} className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 w-12 text-slate-600 font-medium">
                <span>{star}</span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </div>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="w-16 text-right text-slate-500 flex justify-between">
                <span className="text-slate-700 font-semibold">{count}</span>
                <span className="text-slate-400">({percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
