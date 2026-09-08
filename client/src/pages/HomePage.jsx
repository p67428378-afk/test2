import React, { useState } from "react";
import { Link } from "react-router-dom";
import RecommendationForm from "../components/RecommendationForm";
import { generateRecommendations } from "../services/api";

export default function HomePage({ onRecommendationGenerated }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await generateRecommendations(formData);
      if (onRecommendationGenerated) {
        onRecommendationGenerated(data);
      }
    } catch (err) {
      console.error("Error generating recommendations:", err);
      const errorMsg =
        err.response?.data?.detail ||
        "Unable to generate recommendations right now. Please try again later.";
      setError(
        typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <header className="max-w-6xl mx-auto bg-white shadow-sm p-4 rounded-2xl border border-slate-200 flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">✈️</span>
          <Link to="/" className="text-xl font-bold text-blue-600">
            TravelAI
          </Link>
        </div>
        <nav className="space-x-4 text-sm font-medium">
          <Link to="/" className="text-blue-600 font-semibold">
            Plan Trip
          </Link>
          <Link
            to="/admin/codebase-report"
            className="text-slate-600 hover:text-blue-600 transition"
          >
            Codebase Report
          </Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="md:col-span-2">
          <RecommendationForm
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
            error={error}
          />
        </section>

        <aside className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-fit space-y-4">
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Trending Destinations
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100">
              <div>
                <p className="font-semibold text-slate-900 text-sm">
                  Tokyo, Japan
                </p>
                <p className="text-xs text-slate-500">Culture, Food, Anime</p>
              </div>
              <span className="font-bold text-blue-600 text-sm">$150/day</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100">
              <div>
                <p className="font-semibold text-slate-900 text-sm">
                  Kyoto, Japan
                </p>
                <p className="text-xs text-slate-500">Temples, Gardens, Tea</p>
              </div>
              <span className="font-bold text-blue-600 text-sm">$120/day</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100">
              <div>
                <p className="font-semibold text-slate-900 text-sm">
                  Paris, France
                </p>
                <p className="text-xs text-slate-500">Museums, Dining, Art</p>
              </div>
              <span className="font-bold text-blue-600 text-sm">$200/day</span>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
