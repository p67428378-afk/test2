import React, { useState } from "react";
import { Star, MessageSquare, CheckCircle, User, Filter } from "lucide-react";

export default function ReviewListAndSummary({
  reviews = [],
  averageRating = 0,
  totalReviews = 0,
  onOpenReviewModal,
}) {
  const [filterRating, setFilterRating] = useState(0);

  // Rating Distribution
  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => Math.round(r.rating) === stars).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { stars, count, percentage };
  });

  const filteredReviews =
    filterRating === 0
      ? reviews
      : reviews.filter((r) => Math.round(r.rating) === filterRating);

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Subscriber Reviews & Ratings
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Authentic feedback from verified box subscribers
          </p>
        </div>
        <button
          onClick={onOpenReviewModal}
          className="px-5 py-2.5 bg-primary hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm self-start sm:self-auto"
        >
          Write a Review
        </button>
      </div>

      {/* Summary Score & Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100 items-center">
        <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0 md:pr-6">
          <div className="font-serif text-5xl font-extrabold text-slate-900">
            {averageRating ? averageRating.toFixed(1) : "0.0"}
          </div>
          <div className="flex justify-center md:justify-start text-amber-400 my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-5 h-5 ${
                  s <= Math.round(averageRating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-200 fill-slate-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </span>
        </div>

        <div className="md:col-span-8 space-y-2">
          {distribution.map(({ stars, count, percentage }) => (
            <div key={stars} className="flex items-center gap-3 text-xs">
              <span className="w-12 text-slate-600 font-medium flex items-center gap-1">
                {stars}{" "}
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </span>
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="w-8 text-right text-slate-400 font-medium">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Rating Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-2">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        <button
          onClick={() => setFilterRating(0)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            filterRating === 0
              ? "bg-primary text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          All ({totalReviews})
        </button>
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = reviews.filter(
            (r) => Math.round(r.rating) === stars,
          ).length;
          return (
            <button
              key={stars}
              onClick={() => setFilterRating(stars)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                filterRating === stars
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{stars} Stars</span>
              <span className="opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Review Cards List */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6">
          <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-600 text-sm font-medium">
            No reviews match the selected rating.
          </p>
          <button
            onClick={() => setFilterRating(0)}
            className="mt-3 text-xs text-primary font-bold hover:underline"
          >
            Show all reviews
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl border border-slate-100 bg-white shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-primary font-bold text-sm">
                    {rev.user_name ? (
                      rev.user_name.charAt(0).toUpperCase()
                    ) : (
                      <User className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <span>{rev.user_name || "Subscriber"}</span>
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-normal">
                        <CheckCircle className="w-3 h-3" /> Verified Subscriber
                      </span>
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {rev.created_at
                        ? new Date(rev.created_at).toLocaleDateString()
                        : "Recently"}
                    </span>
                  </div>
                </div>

                <div className="flex text-amber-400 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= rev.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200 fill-slate-100"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                {rev.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
