import React, { useState } from "react";
import {
  X,
  ImageOff,
  CheckCircle2,
  Wind,
  Activity,
  AlertTriangle,
  Plus,
} from "lucide-react";

export default function PoseDetailModal({ pose, onClose, onAddToRoutine }) {
  const [imageError, setImageError] = useState(false);

  if (!pose) return null;

  const difficultyColors = {
    Beginner: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Intermediate: "bg-amber-100 text-amber-800 border-amber-200",
    Advanced: "bg-rose-100 text-rose-800 border-rose-200",
  };

  const categoryColors = {
    Standing: "bg-teal-100 text-teal-800 border-teal-200",
    Seated: "bg-sky-100 text-sky-800 border-sky-200",
    Inversion: "bg-purple-100 text-purple-800 border-purple-200",
    Balance: "bg-indigo-100 text-indigo-800 border-indigo-200",
    Restorative: "bg-emerald-100 text-emerald-800 border-emerald-200",
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={onClose}
      data-testid="pose-detail-modal"
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl border border-slate-100 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-4">
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${difficultyColors[pose.difficulty] || "bg-slate-100 text-slate-700"}`}
              >
                {pose.difficulty}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${categoryColors[pose.category] || "bg-slate-100 text-slate-700"}`}
              >
                {pose.category}
              </span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-slate-900">
              {pose.english_name}
            </h2>
            <p className="text-sm italic text-teal-700 font-serif">
              {pose.sanskrit_name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Visual Graphic / Image Container with Fallback */}
        <div className="bg-slate-100 rounded-xl overflow-hidden min-h-[180px] flex items-center justify-center border border-slate-200 relative">
          {pose.image_url && !imageError ? (
            <img
              src={pose.image_url}
              alt={pose.english_name}
              onError={() => setImageError(true)}
              className="w-full h-56 object-cover"
            />
          ) : (
            <div className="p-6 text-center space-y-2 bg-gradient-to-br from-teal-50 to-slate-100 w-full h-56 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center mx-auto mb-1">
                <ImageOff className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Fallback Alignment Graphic
              </p>
              <p className="text-sm font-serif italic text-teal-900">
                {pose.english_name} ({pose.sanskrit_name})
              </p>
              <p className="text-xs text-slate-500 max-w-sm">
                Visual guide loaded with plain-text alignment cues below.
              </p>
            </div>
          )}
        </div>

        {/* Alignment Cues */}
        {pose.alignment_cues && pose.alignment_cues.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-700" />
              Step-by-Step Alignment Cues
            </h3>
            <ol className="space-y-2 text-sm text-slate-700 list-decimal pl-5 marker:text-teal-700 marker:font-bold">
              {pose.alignment_cues.map((cue, idx) => (
                <li key={idx} className="pl-1">
                  {cue}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Breath Instructions */}
        {pose.breath_instructions && (
          <div className="space-y-2 bg-teal-50/70 p-4 rounded-xl border border-teal-100">
            <h3 className="text-sm font-bold text-teal-900 flex items-center gap-2">
              <Wind className="w-4 h-4 text-teal-700" />
              Breath Coordination
            </h3>
            <p className="text-sm text-teal-800 leading-relaxed">
              {pose.breath_instructions}
            </p>
          </div>
        )}

        {/* Target Muscles */}
        {pose.target_muscles && pose.target_muscles.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-700" />
              Targeted Muscles
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {pose.target_muscles.map((muscle, idx) => (
                <span
                  key={idx}
                  className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-medium border border-slate-200"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Common Mistakes */}
        {pose.common_mistakes && pose.common_mistakes.length > 0 && (
          <div className="space-y-2 bg-amber-50/80 p-4 rounded-xl border border-amber-200">
            <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              Common Mistakes to Avoid
            </h3>
            <ul className="space-y-1 text-sm text-amber-800 list-disc pl-5">
              {pose.common_mistakes.map((mistake, idx) => (
                <li key={idx}>{mistake}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex justify-between items-center border-t border-slate-200 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-lg transition-colors"
          >
            Close Guide
          </button>

          {onAddToRoutine && (
            <button
              onClick={() => {
                onAddToRoutine(pose);
                onClose();
              }}
              className="flex items-center gap-2 bg-teal-800 hover:bg-teal-900 text-white text-sm font-medium px-5 py-2 rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Routine Builder</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
