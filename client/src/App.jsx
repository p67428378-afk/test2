import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import ResultsPage from "./pages/ResultsPage";
import CodebaseReportPage from "./pages/CodebaseReportPage";
import { getRecommendationById } from "./services/api";

function HomeView({ setRecommendation }) {
  const navigate = useNavigate();

  const handleRecommendationGenerated = (data) => {
    setRecommendation(data);
    navigate("/results");
  };

  return <HomePage onRecommendationGenerated={handleRecommendationGenerated} />;
}

function ResultsView({ recommendation, setRecommendation }) {
  const navigate = useNavigate();

  const handleReset = () => {
    setRecommendation(null);
    navigate("/");
  };

  return <ResultsPage recommendation={recommendation} onReset={handleReset} />;
}

function DetailView({ setRecommendation }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      getRecommendationById(id)
        .then((res) => {
          setData(res);
          setRecommendation(res);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch recommendation by ID:", err);
          setError("Unable to load recommendation details.");
          setLoading(false);
        });
    }
  }, [id, setRecommendation]);

  if (loading) {
    return (
      <div className="p-8 text-center bg-slate-50 min-h-screen flex justify-center items-center">
        <p className="text-slate-600 font-semibold">
          Loading recommendation...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center bg-slate-50 min-h-screen flex flex-col justify-center items-center">
        <p className="text-red-600 font-semibold mb-4">
          {error || "Recommendation not found."}
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return <ResultsPage recommendation={data} onReset={() => navigate("/")} />;
}

export default function App() {
  const [recommendation, setRecommendation] = useState(null);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<HomeView setRecommendation={setRecommendation} />}
        />
        <Route
          path="/results"
          element={
            <ResultsView
              recommendation={recommendation}
              setRecommendation={setRecommendation}
            />
          }
        />
        <Route
          path="/recommendations/:id"
          element={<DetailView setRecommendation={setRecommendation} />}
        />
        <Route path="/admin/codebase-report" element={<CodebaseReportPage />} />
      </Routes>
    </Router>
  );
}
