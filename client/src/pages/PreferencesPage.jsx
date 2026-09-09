import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PreferenceForm from "../components/PreferenceForm";
import {
  Sliders,
  Sparkles,
  BrainCircuit,
  Target,
  CheckCircle,
} from "lucide-react";

export default function PreferencesPage({ userId = "user-123" }) {
  const navigate = useNavigate();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handlePreferencesSaved = () => {
    setSavedSuccess(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <Sliders className="w-3.5 h-3.5" />
          <span>Preference Management</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Customize Your Shopping Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          The AI recommendation engine combines your preferred categories, price
          boundaries, and feature tags with product embeddings to calculate
          precision match scores.
        </p>
      </div>

      {/* 3 Step Explainer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              1. Select Categories
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Choose categories of interest to anchor candidate product pools.
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 shrink-0">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              2. Budget Boundaries
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Set minimum and maximum price constraints for budget gating.
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              3. AI Vector Scoring
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Tag affinity vectors are scored and ranked with cosine similarity.
            </p>
          </div>
        </div>
      </div>

      {/* Main Preference Form */}
      <PreferenceForm
        initialUserId={userId}
        onPreferencesSaved={handlePreferencesSaved}
      />

      {/* Next Step Action Callout */}
      {savedSuccess && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-indigo-900">
                Profile synchronized!
              </h4>
              <p className="text-[11px] text-indigo-700">
                Ready to view personalized AI product suggestions.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/recommendations")}
            className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow hover:bg-indigo-700 flex items-center space-x-1.5 transition-colors shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>View AI Recommendations</span>
          </button>
        </div>
      )}
    </div>
  );
}
