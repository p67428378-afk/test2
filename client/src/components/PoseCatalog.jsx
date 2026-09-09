import React, { useState, useEffect } from "react";
import { getPoses, createPose } from "../api/client";
import PoseDetailModal from "./PoseDetailModal";
import {
  Search,
  Filter,
  Sparkles,
  BookOpen,
  Plus,
  ImageOff,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PoseCatalog({ onSelectPoseForRoutine }) {
  const [poses, setPoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  // Selected Pose for Modal Detail View
  const [selectedPoseModal, setSelectedPoseModal] = useState(null);

  // Add Custom Pose Form Modal
  const [showAddPoseModal, setShowAddPoseModal] = useState(false);
  const [newPoseData, setNewPoseData] = useState({
    english_name: "",
    sanskrit_name: "",
    difficulty: "Beginner",
    category: "Standing",
    alignment_cues: ["Keep spine long", "Ground feet firmly"],
    breath_instructions: "Inhale to lengthen, exhale to deepen.",
    target_muscles: ["Core", "Hamstrings"],
    common_mistakes: ["Rounding lower back"],
  });

  const navigate = useNavigate();

  const categories = [
    "Standing",
    "Seated",
    "Inversion",
    "Balance",
    "Restorative",
  ];
  const difficulties = ["Beginner", "Intermediate", "Advanced"];

  const fetchCatalogPoses = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchQuery.trim()) params.query = searchQuery.trim();
      if (selectedCategory) params.category = selectedCategory;
      if (selectedDifficulty) params.difficulty = selectedDifficulty;

      const data = await getPoses(params);
      setPoses(data || []);
    } catch (err) {
      console.error("Failed to fetch poses:", err);
      setError("Failed to load yoga pose catalog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCatalogPoses();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedDifficulty("");
  };

  const handleCreatePoseSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPose(newPoseData);
      setShowAddPoseModal(false);
      setNewPoseData({
        english_name: "",
        sanskrit_name: "",
        difficulty: "Beginner",
        category: "Standing",
        alignment_cues: ["Keep spine long"],
        breath_instructions: "Inhale to lengthen, exhale to deepen.",
        target_muscles: ["Core"],
        common_mistakes: ["Rounding back"],
      });
      fetchCatalogPoses();
    } catch (err) {
      console.error("Error creating pose:", err);
      alert("Failed to create new pose. Please check input values.");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-teal-950 via-teal-900 to-teal-800 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-teal-800/80 backdrop-blur-sm border border-teal-700/50 px-3 py-1 rounded-full text-xs font-semibold text-teal-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Form Guide & Library</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-white">
            Yoga Pose Dictionary
          </h1>
          <p className="text-teal-100/90 text-sm sm:text-base leading-relaxed">
            Explore proper alignment cues, breath timing, targeted muscles, and
            common form mistakes across English and Sanskrit pose names.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Dual-language search */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by English or Sanskrit name (e.g., Downward Dog, Adho Mukha)..."
              className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Select dropdowns */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-3 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-700"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="p-3 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-700"
            >
              <option value="">All Difficulties</option>
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowAddPoseModal(true)}
              className="flex items-center gap-1.5 bg-teal-900 hover:bg-teal-950 text-white font-medium text-sm px-4 py-3 rounded-xl transition-colors whitespace-nowrap shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Pose</span>
            </button>
          </div>
        </div>

        {/* Filter chips / Active filters indicator */}
        {(selectedCategory || selectedDifficulty || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Active filters:</span>
            {selectedCategory && (
              <span className="bg-teal-100 text-teal-800 font-semibold px-2.5 py-0.5 rounded-md">
                Category: {selectedCategory}
              </span>
            )}
            {selectedDifficulty && (
              <span className="bg-amber-100 text-amber-800 font-semibold px-2.5 py-0.5 rounded-md">
                Difficulty: {selectedDifficulty}
              </span>
            )}
            {searchQuery && (
              <span className="bg-slate-200 text-slate-800 font-semibold px-2.5 py-0.5 rounded-md">
                Query: "{searchQuery}"
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-teal-700 hover:underline font-semibold ml-2"
            >
              Reset all
            </button>
          </div>
        )}
      </section>

      {/* Loading state */}
      {loading && (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal-800 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-slate-600">
            Loading pose dictionary...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl text-center space-y-3">
          <p className="font-medium text-sm">{error}</p>
          <button
            onClick={fetchCatalogPoses}
            className="bg-rose-700 text-white text-xs px-4 py-2 rounded-lg font-semibold hover:bg-rose-800"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* Empty State when no search results */}
      {!loading && !error && poses.length === 0 && (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center max-w-lg mx-auto space-y-4 shadow-sm">
          <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-serif font-bold text-slate-800">
            No Poses Found
          </h3>
          <p className="text-sm text-slate-500">
            We couldn't find any yoga poses matching your query or active
            filters.
          </p>
          <div className="pt-2">
            <button
              onClick={handleClearFilters}
              className="bg-teal-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-teal-900 transition-colors"
            >
              Clear Search & Filters
            </button>
          </div>
        </div>
      )}

      {/* Poses Grid */}
      {!loading && !error && poses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {poses.map((pose) => (
            <div
              key={pose.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md hover:border-teal-300 transition-all flex flex-col group"
            >
              {/* Header tags & image preview */}
              <div
                className="bg-slate-100 h-44 flex items-center justify-center relative cursor-pointer overflow-hidden"
                onClick={() => setSelectedPoseModal(pose)}
              >
                {pose.image_url ? (
                  <img
                    src={pose.image_url}
                    alt={pose.english_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                    <ImageOff className="w-8 h-8 mb-1 text-slate-300" />
                    <span className="text-xs font-semibold text-slate-500">
                      Form Guide Preview
                    </span>
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="bg-white/95 backdrop-blur-sm text-slate-800 font-bold text-[11px] px-2.5 py-0.5 rounded-full shadow-sm">
                    {pose.difficulty}
                  </span>
                  <span className="bg-teal-900/90 text-white font-semibold text-[11px] px-2.5 py-0.5 rounded-full backdrop-blur-sm shadow-sm">
                    {pose.category}
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div
                  className="space-y-1 cursor-pointer"
                  onClick={() => setSelectedPoseModal(pose)}
                >
                  <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-teal-900 transition-colors">
                    {pose.english_name}
                  </h3>
                  <p className="text-xs italic text-teal-700 font-serif font-medium">
                    {pose.sanskrit_name}
                  </p>

                  {pose.alignment_cues && pose.alignment_cues.length > 0 && (
                    <p className="text-xs text-slate-600 line-clamp-2 pt-2 leading-relaxed">
                      {pose.alignment_cues[0]}
                    </p>
                  )}
                </div>

                {/* Target muscles preview */}
                {pose.target_muscles && pose.target_muscles.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {pose.target_muscles.slice(0, 3).map((m, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded"
                      >
                        {m}
                      </span>
                    ))}
                    {pose.target_muscles.length > 3 && (
                      <span className="text-[10px] text-slate-400 px-1 py-0.5">
                        +{pose.target_muscles.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Card Actions */}
                <div className="flex gap-2 border-t border-slate-100 pt-3 mt-auto">
                  <button
                    onClick={() => setSelectedPoseModal(pose)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <span>View Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (onSelectPoseForRoutine) {
                        onSelectPoseForRoutine(pose);
                      } else {
                        navigate("/routines/new", { state: { addPose: pose } });
                      }
                    }}
                    className="bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                    title="Add pose to Routine Builder"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Routine</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail View */}
      {selectedPoseModal && (
        <PoseDetailModal
          pose={selectedPoseModal}
          onClose={() => setSelectedPoseModal(null)}
          onAddToRoutine={(pose) => {
            if (onSelectPoseForRoutine) {
              onSelectPoseForRoutine(pose);
            } else {
              navigate("/routines/new", { state: { addPose: pose } });
            }
          }}
        />
      )}

      {/* Add Custom Pose Modal */}
      {showAddPoseModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h2 className="text-xl font-bold font-serif text-slate-900">
              Add New Pose to Catalog
            </h2>
            <form
              onSubmit={handleCreatePoseSubmit}
              className="space-y-3 text-sm"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  English Name *
                </label>
                <input
                  type="text"
                  required
                  value={newPoseData.english_name}
                  onChange={(e) =>
                    setNewPoseData({
                      ...newPoseData,
                      english_name: e.target.value,
                    })
                  }
                  placeholder="e.g. Warrior I"
                  className="w-full p-2.5 border rounded-lg bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sanskrit Name *
                </label>
                <input
                  type="text"
                  required
                  value={newPoseData.sanskrit_name}
                  onChange={(e) =>
                    setNewPoseData({
                      ...newPoseData,
                      sanskrit_name: e.target.value,
                    })
                  }
                  placeholder="e.g. Virabhadrasana I"
                  className="w-full p-2.5 border rounded-lg bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={newPoseData.category}
                    onChange={(e) =>
                      setNewPoseData({
                        ...newPoseData,
                        category: e.target.value,
                      })
                    }
                    className="w-full p-2.5 border rounded-lg bg-slate-50"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Difficulty *
                  </label>
                  <select
                    value={newPoseData.difficulty}
                    onChange={(e) =>
                      setNewPoseData({
                        ...newPoseData,
                        difficulty: e.target.value,
                      })
                    }
                    className="w-full p-2.5 border rounded-lg bg-slate-50"
                  >
                    {difficulties.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddPoseModal(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-800 text-white rounded-lg font-medium hover:bg-teal-900"
                >
                  Create Pose
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
