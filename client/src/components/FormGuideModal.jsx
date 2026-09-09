import React, { useState } from "react";
import { poseService } from "../services/api";

export default function FormGuideModal({ pose, onClose, onFavoriteToggle }) {
  const [isFavorite, setIsFavorite] = useState(pose?.is_favorite || false);
  const [loadingFav, setLoadingFav] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!pose) return null;

  const handleToggleFav = async () => {
    try {
      setLoadingFav(true);
      if (isFavorite) {
        await poseService.removeFavorite(pose.id);
        setIsFavorite(false);
        if (onFavoriteToggle) onFavoriteToggle(pose.id, false);
      } else {
        await poseService.addFavorite(pose.id);
        setIsFavorite(true);
        if (onFavoriteToggle) onFavoriteToggle(pose.id, true);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    } finally {
      setLoadingFav(false);
    }
  };

  const parseList = (text) => {
    if (!text) return [];
    if (Array.isArray(text)) return text;
    return text
      .split(/\n|\r\n|\.\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  };

  const alignmentCues = parseList(pose.alignment_cues);
  const commonMistakes = parseList(pose.common_mistakes);

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-2xl font-bold p-2"
        >
          &times;
        </button>

        <div className="flex justify-between items-start border-b pb-4 pr-8">
          <div>
            <div className="flex gap-2 mb-1.5 flex-wrap">
              <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                {pose.difficulty || "Beginner"}
              </span>
              <span className="bg-teal-100 text-teal-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                {pose.category || "Standing"}
              </span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-slate-900">
              {pose.english_name}
            </h2>
            {pose.sanskrit_name && (
              <p className="text-sm italic text-teal-700">
                {pose.sanskrit_name}
              </p>
            )}
          </div>
          <button
            onClick={handleToggleFav}
            disabled={loadingFav}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
              isFavorite
                ? "bg-amber-50 text-amber-800 border-amber-300 shadow-sm"
                : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-amber-50"
            }`}
          >
            {isFavorite ? "★ Favorited" : "☆ Add Favorite"}
          </button>
        </div>

        {/* Pose Image or Fallback Graphics */}
        <div className="bg-slate-100 rounded-xl p-4 flex items-center justify-center border border-slate-200 min-h-[160px]">
          {pose.image_url && !imgError ? (
            <img
              src={pose.image_url}
              alt={pose.english_name}
              onError={() => setImgError(true)}
              className="max-h-48 object-contain rounded"
            />
          ) : (
            <div className="text-center p-6 space-y-2">
              <span className="text-5xl" role="img" aria-label="yoga pose">
                🧘‍♂️
              </span>
              <p className="text-xs text-slate-500 font-medium">
                Form Guide Illustration Placeholder ({pose.english_name})
              </p>
            </div>
          )}
        </div>

        {/* Alignment Cues */}
        {alignmentCues.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Step-by-Step Alignment Cues
            </h3>
            <ol className="space-y-1.5 text-sm text-slate-700 list-decimal pl-5">
              {alignmentCues.map((cue, idx) => (
                <li key={idx}>{cue}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Breath Instructions */}
        {pose.breath_instructions && (
          <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-3.5 space-y-1">
            <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>🫁</span> Breath Synchronization
            </h4>
            <p className="text-sm text-teal-800">{pose.breath_instructions}</p>
          </div>
        )}

        {/* Target Muscles */}
        {pose.target_muscles && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Targeted Muscles & Anatomy
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {pose.target_muscles.split(/,\s*/).map((muscle, idx) => (
                <span
                  key={idx}
                  className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md border border-slate-200"
                >
                  💪 {muscle}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Common Mistakes */}
        {commonMistakes.length > 0 && (
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-1.5">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>⚠️</span> Common Form Mistakes to Avoid
            </h4>
            <ul className="list-disc pl-5 text-sm text-amber-900 space-y-1">
              {commonMistakes.map((mistake, idx) => (
                <li key={idx}>{mistake}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
