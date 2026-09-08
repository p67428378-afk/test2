import React, { useState } from "react";

const INTEREST_OPTIONS = [
  "Food & Dining",
  "Temples & Culture",
  "Anime & Pop Culture",
  "Outdoor & Nature",
  "Art & Museums",
  "Shopping & Fashion",
];

export default function RecommendationForm({
  onSubmit,
  isLoading,
  error: externalError,
}) {
  const [destination, setDestination] = useState("Tokyo, Japan");
  const [budget, setBudget] = useState("150.00");
  const [currency, setCurrency] = useState("USD");
  const [selectedInterests, setSelectedInterests] = useState([
    "Food & Dining",
    "Temples & Culture",
    "Anime & Pop Culture",
  ]);
  const [customInterest, setCustomInterest] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleInterestToggle = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest],
    );
  };

  const handleAddCustomInterest = (e) => {
    e.preventDefault();
    const trimmed = customInterest.trim();
    if (trimmed && !selectedInterests.includes(trimmed)) {
      setSelectedInterests([...selectedInterests, trimmed]);
      setCustomInterest("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");

    if (!destination.trim()) {
      setValidationError("Destination is required and cannot be empty.");
      return;
    }

    const numBudget = parseFloat(budget);
    if (isNaN(numBudget) || numBudget <= 0) {
      setValidationError("Budget must be a positive numerical value.");
      return;
    }

    if (selectedInterests.length === 0) {
      setValidationError(
        "Please select or enter at least one interest category.",
      );
      return;
    }

    onSubmit({
      destination: destination.trim(),
      budget: numBudget,
      currency,
      interests: selectedInterests,
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Plan Your Trip</h2>
      <p className="text-slate-500 mb-6">
        Specify destination, budget, and interests for AI suggestions.
      </p>

      {(validationError || externalError) && (
        <div
          role="alert"
          className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium"
        >
          {validationError || externalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="destination"
            className="block text-sm font-semibold text-slate-700 mb-1"
          >
            Destination <span className="text-red-500">*</span>
          </label>
          <input
            id="destination"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g., Tokyo, Japan"
            className="w-full p-3 bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="budget"
              className="block text-sm font-semibold text-slate-700 mb-1"
            >
              Daily Budget ($) <span className="text-red-500">*</span>
            </label>
            <input
              id="budget"
              type="number"
              step="0.01"
              min="0.01"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="150.00"
              className="w-full p-3 bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>

          <div>
            <label
              htmlFor="currency"
              className="block text-sm font-semibold text-slate-700 mb-1"
            >
              Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-3 bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Interests <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {INTEREST_OPTIONS.map((interest) => (
              <label
                key={interest}
                className="flex items-center space-x-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  checked={selectedInterests.includes(interest)}
                  onChange={() => handleInterestToggle(interest)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-slate-800 font-medium">{interest}</span>
              </label>
            ))}
          </div>

          {/* Additional selected custom interests */}
          {selectedInterests.filter((i) => !INTEREST_OPTIONS.includes(i))
            .length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedInterests
                .filter((i) => !INTEREST_OPTIONS.includes(i))
                .map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200"
                  >
                    <span>{interest}</span>
                    <button
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className="text-blue-500 hover:text-blue-800 font-bold ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
            </div>
          )}

          <div className="flex space-x-2">
            <input
              type="text"
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              placeholder="Add custom interest..."
              className="flex-1 p-2.5 text-sm bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
            <button
              type="button"
              onClick={handleAddCustomInterest}
              className="px-4 py-2.5 bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-300 transition"
            >
              Add
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2 shadow-sm"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Generating AI Recommendations...</span>
            </>
          ) : (
            <span>Generate AI Recommendations</span>
          )}
        </button>
      </form>
    </div>
  );
}
