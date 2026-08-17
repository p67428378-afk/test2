import React, { useState, useEffect } from "react";
import {
  Brain,
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { itemService, claimService } from "../../services/api";

export default function AIMatchesSection({ item, onMatchClaimed }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [claimingMatchId, setClaimingItemId] = useState(null);
  const [claimantDetails, setClaimantDetails] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (item) {
      fetchMatches();
    } else {
      setMatches([]);
    }
  }, [item]);

  const fetchMatches = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      const data = await itemService.getItemMatches(item.id);
      // Sort matches by score descending
      const sortedMatches = (data || []).sort((a, b) => b.score - a.score);
      setMatches(sortedMatches);
    } catch (err) {
      setError("Failed to load AI matches.");
    } finally {
      setLoading(false);
    }
  };

  const handleClaimSubmit = async (e, matchedItemId) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!claimantDetails.trim()) {
      setError("Please provide details to verify your ownership.");
      return;
    }

    try {
      await claimService.submitClaim({
        item_id: matchedItemId,
        claimant_details: claimantDetails,
        claim_date: new Date().toISOString(),
      });
      setSuccessMessage("Claim submitted successfully for the matched item!");
      setClaimantDetails("");
      setClaimingItemId(null);
      if (onMatchClaimed) {
        onMatchClaimed();
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to submit claim. Please try again.",
      );
    }
  };

  if (!item) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden relative">
      {/* Ambient gradient background for AI section */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-transparent pointer-events-none"></div>
      <div className="p-6 relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Brain className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            AI Suggested Matches
          </h3>
        </div>

        {loading ? (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-xs text-slate-500 mt-2">
              Analyzing items for potential matches...
            </p>
          </div>
        ) : error ? (
          <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-lg text-sm">
            {error}
          </div>
        ) : matches.length === 0 ? (
          <p className="text-sm text-slate-500 ml-11">
            No potential matches found in the system yet.
          </p>
        ) : (
          <>
            <p className="text-sm text-slate-600 mb-6 ml-11">
              AI found{" "}
              <strong className="text-slate-900">
                {matches.length} potential matches
              </strong>{" "}
              in the system based on visual and textual analysis.
            </p>

            {successMessage && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg text-sm">
                {successMessage}
              </div>
            )}

            <div className="flex flex-col gap-4">
              {matches.map((match, idx) => {
                const matchedItem = match.item;
                const matchScore = Math.round(match.score * 100);
                const isLost = matchedItem.status?.toLowerCase() === "lost";
                const formattedDate = matchedItem.report_date
                  ? new Date(matchedItem.report_date).toLocaleDateString()
                  : "";

                return (
                  <div
                    key={matchedItem.id || idx}
                    className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 shadow-sm flex flex-col gap-4 transition-all hover:shadow-md hover:border-indigo-200"
                  >
                    <div className="flex-grow flex flex-col gap-1 w-full">
                      <div className="flex justify-between items-start w-full gap-2">
                        <h4 className="text-base font-bold text-slate-900">
                          {matchedItem.name}
                        </h4>
                        <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-semibold border border-indigo-100 shadow-sm whitespace-nowrap">
                          <Sparkles className="h-3.5 w-3.5" />
                          {matchScore}% Match
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                        {matchedItem.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span
                          className={`font-semibold ${isLost ? "text-rose-600" : "text-emerald-600"}`}
                        >
                          {isLost ? "Lost" : "Found"}
                        </span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {matchedItem.location}
                        </span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formattedDate}
                        </span>
                      </div>
                    </div>

                    {/* Claim matched item form */}
                    {claimingMatchId === matchedItem.id ? (
                      <form
                        onSubmit={(e) => handleClaimSubmit(e, matchedItem.id)}
                        className="mt-2 space-y-3 bg-white p-3 rounded-lg border border-slate-200"
                      >
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">
                            Verification Details (prove ownership of this
                            matched item)
                          </label>
                          <textarea
                            value={claimantDetails}
                            onChange={(e) => setClaimantDetails(e.target.value)}
                            rows={2}
                            placeholder="Describe unique features, contents, or proof..."
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                            required
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 rounded font-semibold text-xs transition-colors"
                          >
                            Submit Claim
                          </button>
                          <button
                            type="button"
                            onClick={() => setClaimingItemId(null)}
                            className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-1.5 rounded font-semibold text-xs transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      // Only allow claiming if the matched item is "found" and the current item is "lost"
                      !isLost &&
                      item.status?.toLowerCase() === "lost" && (
                        <button
                          onClick={() => {
                            setClaimingItemId(matchedItem.id);
                            setClaimantDetails("");
                          }}
                          className="w-full sm:w-auto px-4 py-2 bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-bold transition-colors whitespace-nowrap self-end"
                        >
                          Submit Claim
                        </button>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
