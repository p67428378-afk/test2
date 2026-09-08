import React, { useState } from "react";
import { Link } from "react-router-dom";
import RecommendationResults from "../components/RecommendationResults";
import BudgetSummaryCard from "../components/BudgetSummaryCard";

export default function ResultsPage({ recommendation, onReset }) {
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (!recommendation) {
    return (
      <div className="p-8 text-center bg-slate-50 min-h-screen flex flex-col justify-center items-center">
        <p className="text-slate-600 mb-4">No recommendation data available.</p>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
        >
          Plan a New Trip
        </button>
      </div>
    );
  }

  const budget = recommendation.budget ?? recommendation.request?.budget ?? 0;
  const currency =
    recommendation.currency || recommendation.request?.currency || "USD";
  const items = recommendation.items || [];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <header className="max-w-6xl mx-auto bg-white shadow-sm p-4 rounded-2xl border border-slate-200 flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">✈️</span>
          <Link to="/" className="text-xl font-bold text-blue-600">
            TravelAI
          </Link>
        </div>
        <div className="flex items-center space-x-4 text-sm font-medium">
          <Link
            to="/"
            className="text-slate-600 hover:text-blue-600 transition"
          >
            Plan Trip
          </Link>
          <Link
            to="/admin/codebase-report"
            className="text-slate-600 hover:text-blue-600 transition"
          >
            Codebase Report
          </Link>
          <button
            onClick={onReset}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition pl-2 border-l border-slate-200"
          >
            + New Search
          </button>
        </div>
      </header>

      {saveSuccess && (
        <div className="max-w-6xl mx-auto mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-semibold">
          ✓ Recommendation saved successfully!
        </div>
      )}

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="md:col-span-2">
          <RecommendationResults
            recommendation={recommendation}
            onReset={onReset}
          />
        </section>

        <aside>
          <BudgetSummaryCard
            budget={budget}
            currency={currency}
            items={items}
            onSave={handleSave}
          />
        </aside>
      </main>
    </div>
  );
}
