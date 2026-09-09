import React, { useState, useEffect } from "react";
import {
  Sliders,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Sparkles,
} from "lucide-react";
import { api } from "../services/api";

const AVAILABLE_CATEGORIES = [
  "Electronics",
  "Audio",
  "Wearables",
  "Accessories",
  "Home & Kitchen",
  "Computers",
  "Gaming",
  "Fitness",
];

const SUGGESTED_TAGS = [
  "wireless",
  "noise-cancelling",
  "smart",
  "portable",
  "bluetooth",
  "battery",
  "waterproof",
  "premium",
  "budget",
  "ergonomic",
];

export default function PreferenceForm({
  initialUserId = "user-123",
  onPreferencesSaved,
}) {
  const [userId, setUserId] = useState(initialUserId);
  const [selectedCategories, setSelectedCategories] = useState([
    "Electronics",
    "Audio",
  ]);
  const [minPrice, setMinPrice] = useState(20);
  const [maxPrice, setMaxPrice] = useState(500);
  const [tags, setTags] = useState(["wireless", "smart"]);
  const [newTagInput, setNewTagInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetchingExisting, setFetchingExisting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch existing preference when userId changes or on mount
  useEffect(() => {
    let isMounted = true;
    async function loadExisting() {
      if (!userId.trim()) return;
      setFetchingExisting(true);
      try {
        const data = await api.getPreferences(userId.trim());
        if (isMounted && data) {
          if (Array.isArray(data.category_preferences)) {
            setSelectedCategories(data.category_preferences);
          }
          if (typeof data.min_price === "number") {
            setMinPrice(data.min_price);
          }
          if (typeof data.max_price === "number") {
            setMaxPrice(data.max_price);
          }
          if (Array.isArray(data.preferred_tags)) {
            setTags(data.preferred_tags);
          }
        }
      } catch (err) {
        // Not found or not set yet - ignore error
      } finally {
        if (isMounted) setFetchingExisting(false);
      }
    }

    loadExisting();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const handleAddTag = (tagToAdd) => {
    const cleanTag = (tagToAdd || newTagInput).trim().toLowerCase();
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags((prev) => [...prev, cleanTag]);
      setNewTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!userId.trim()) {
      setErrorMessage("User ID cannot be empty.");
      return;
    }

    if (selectedCategories.length === 0) {
      setErrorMessage("Please select at least one preferred category.");
      return;
    }

    if (Number(minPrice) > Number(maxPrice)) {
      setErrorMessage("Minimum price cannot exceed maximum price.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        user_id: userId.trim(),
        category_preferences: selectedCategories,
        min_price: Number(minPrice),
        max_price: Number(maxPrice),
        preferred_tags: tags,
      };

      const result = await api.savePreferences(payload);
      setSuccessMessage("Preference profile successfully saved and updated!");
      if (onPreferencesSaved) {
        onPreferencesSaved(result);
      }
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        err.message ||
        "Failed to save preferences.";
      setErrorMessage(
        `Error saving preferences: ${typeof detail === "string" ? detail : JSON.stringify(detail)}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-3xl mx-auto">
      <div className="flex items-center space-x-3 pb-6 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Personalize Recommendation Profile
          </h2>
          <p className="text-xs text-slate-500">
            Configure your category interests, budget envelope, and feature
            affinities for AI matching.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* User ID Field */}
        <div>
          <label
            htmlFor="user-id"
            className="block text-xs font-semibold text-slate-700 mb-1.5"
          >
            User Identifier (Account / Profile Key)
          </label>
          <input
            id="user-id"
            type="text"
            required
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
            placeholder="e.g. user-123 or test@example.com"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Test account identifier:{" "}
            <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">
              user-123
            </code>
          </p>
        </div>

        {/* Categories Checkboxes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Interested Categories <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {AVAILABLE_CATEGORIES.map((cat) => {
              const checked = selectedCategories.includes(cat);
              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                    checked
                      ? "bg-indigo-50/80 border-indigo-300 text-indigo-700 shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>{cat}</span>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border ${
                      checked
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {checked && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Budget Range Slider / Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="min-price"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Minimum Price ($)
            </label>
            <input
              id="min-price"
              type="number"
              min="0"
              step="5"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="max-price"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Maximum Price ($)
            </label>
            <input
              id="max-price"
              type="number"
              min="0"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Preferred Tags */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Feature Tags & Keywords
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add tag (e.g., bluetooth, compact)..."
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              className="flex-1 px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => handleAddTag()}
              className="px-3.5 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700 transition-colors flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Active Tags */}
          <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-slate-50 rounded-lg border border-slate-100 mb-3">
            {tags.length === 0 ? (
              <span className="text-[11px] text-slate-400 italic">
                No specific tags selected
              </span>
            ) : (
              tags.map((tag) => (
                <span
                  key={`tag-chip-${tag}`}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-600 focus:outline-none"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Suggested Tags Quick Add */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1">
              Suggested affinities:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_TAGS.map((sTag) => (
                <button
                  type="button"
                  key={sTag}
                  disabled={tags.includes(sTag)}
                  onClick={() => handleAddTag(sTag)}
                  className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
                    tags.includes(sTag)
                      ? "bg-slate-100 text-slate-400 border-slate-200 cursor-default"
                      : "bg-white text-slate-600 border-slate-200 hover:border-indigo-400 hover:text-indigo-600"
                  }`}
                >
                  +{sTag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback Messages */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start space-x-2.5 text-emerald-800 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{successMessage}</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Head to the <strong>AI Recommendations</strong> tab to view
                personalized suggestions.
              </p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2.5 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Failed to save preferences</p>
              <p className="text-[11px] text-rose-700 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || fetchingExisting}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span>Saving Preferences...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save & Sync AI Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
