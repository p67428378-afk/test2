import React from "react";
import {
  Sparkles,
  MapPin,
  Calendar,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

export default function MatchList({ matches, itemCategory, onBack, onClaim }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Items</span>
        </button>
        <div className="flex items-center gap-2 text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Matching</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">
          AI Matches for "{itemCategory}"
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          These are the most similar items reported in the system based on
          category, description, color, and location.
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">
            No matches found yet
          </h3>
          <p className="text-gray-500 mt-1">
            Our AI algorithm will continue to scan new reports. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => {
            const scorePercent = Math.round(match.similarity_score * 100);
            return (
              <div
                key={match.matched_item_id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow relative"
              >
                {/* Similarity Badge */}
                <div className="absolute top-3 left-3 bg-purple-600 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm z-10">
                  <Sparkles className="w-3 h-3" />
                  <span>{scorePercent}% Match</span>
                </div>

                {/* Image or Placeholder */}
                <div className="h-48 bg-gray-100 relative flex items-center justify-center overflow-hidden">
                  {match.image_url ? (
                    <img
                      src={match.image_url}
                      alt={match.category}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <Sparkles className="w-12 h-12 text-purple-300 mx-auto mb-2" />
                      <span className="text-xs text-gray-400">No Image</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 truncate">
                      {match.category}
                    </h3>
                    {match.brand && (
                      <p className="text-sm text-gray-500 font-medium mt-1">
                        Brand: {match.brand}
                      </p>
                    )}
                    {match.color && (
                      <p className="text-sm text-gray-500 font-medium">
                        Color: {match.color}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="truncate">{match.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{match.item_date}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2">
                    <button
                      onClick={() => onClaim(match.matched_item_id)}
                      className="w-full py-2 px-4 bg-secondary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      Claim This Item
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
