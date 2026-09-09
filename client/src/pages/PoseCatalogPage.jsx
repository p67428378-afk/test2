import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import FormGuideModal from "../components/FormGuideModal";
import FavoritesManager, {
  FavoriteButton,
} from "../components/FavoritesManager";
import { poseService } from "../services/api";

export default function PoseCatalogPage() {
  const [poses, setPoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState("All Difficulties");
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'favorites'

  const [selectedPose, setSelectedPose] = useState(null);
  const [showAddPoseModal, setShowAddPoseModal] = useState(false);

  // New Pose Form state
  const [newPose, setNewPose] = useState({
    english_name: "",
    sanskrit_name: "",
    category: "Standing",
    difficulty: "Beginner",
    alignment_cues: "",
    breath_instructions: "",
    target_muscles: "",
    common_mistakes: "",
    image_url: "",
  });
  const [creatingPose, setCreatingPose] = useState(false);

  const fetchPoses = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (searchQuery.trim()) params.query = searchQuery.trim();
      if (selectedCategory !== "All Categories")
        params.category = selectedCategory;
      if (selectedDifficulty !== "All Difficulties")
        params.difficulty = selectedDifficulty;

      const data = await poseService.getPoses(params);
      setPoses(data || []);
    } catch (err) {
      setError("Failed to fetch yoga poses. Please check server connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoses();
  }, [selectedCategory, selectedDifficulty]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPoses();
  };

  const handleFavoriteToggleInGrid = (poseId, newStatus) => {
    setPoses((prev) =>
      prev.map((p) => (p.id === poseId ? { ...p, is_favorite: newStatus } : p)),
    );
  };

  const handleCreatePoseSubmit = async (e) => {
    e.preventDefault();
    if (!newPose.english_name.trim()) return;
    try {
      setCreatingPose(true);
      const created = await poseService.createPose(newPose);
      setPoses((prev) => [created, ...prev]);
      setShowAddPoseModal(false);
      setNewPose({
        english_name: "",
        sanskrit_name: "",
        category: "Standing",
        difficulty: "Beginner",
        alignment_cues: "",
        breath_instructions: "",
        target_muscles: "",
        common_mistakes: "",
        image_url: "",
      });
    } catch (err) {
      alert("Failed to create pose. Ensure required fields are filled.");
    } finally {
      setCreatingPose(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="max-w-6xl mx-auto p-6 space-y-6 flex-1 w-full">
        {/* Top Header Card */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold font-serif text-teal-950">
                Yoga Pose Dictionary & Asana Library
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Explore proper form guides, alignment cues, breath timing, and
                targeted anatomy.
              </p>
            </div>
            <button
              onClick={() => setShowAddPoseModal(true)}
              className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-sm font-semibold shadow-sm transition-all"
            >
              + Add Custom Pose
            </button>
          </div>

          {/* Search and Filters */}
          <form
            onSubmit={handleSearchSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by English or Sanskrit name (e.g. Downward Dog, Adho Mukha)..."
                className="w-full p-3 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-3 border rounded-lg bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option>All Categories</option>
              <option>Standing</option>
              <option>Seated</option>
              <option>Inversion</option>
              <option>Balance</option>
              <option>Restorative</option>
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="p-3 border rounded-lg bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option>All Difficulties</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </form>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-slate-200 pt-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 text-sm font-bold transition-all ${
                activeTab === "all"
                  ? "text-teal-900 border-b-2 border-teal-800"
                  : "text-slate-600 hover:text-teal-800"
              }`}
            >
              All Poses ({poses.length})
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`px-4 py-2 text-sm font-bold transition-all ${
                activeTab === "favorites"
                  ? "text-teal-900 border-b-2 border-teal-800"
                  : "text-slate-600 hover:text-teal-800"
              }`}
            >
              ⭐ My Favorites
            </button>
          </div>
        </section>

        {/* Tab Content */}
        {activeTab === "favorites" ? (
          <FavoritesManager onSelectPose={(pose) => setSelectedPose(pose)} />
        ) : (
          <section className="space-y-4">
            {loading ? (
              <div className="p-12 text-center text-slate-500 font-medium">
                Loading yoga poses...
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm">
                {error}
              </div>
            ) : poses.length === 0 ? (
              <div className="bg-white rounded-xl p-12 border border-slate-200 text-center space-y-3">
                <span className="text-4xl" role="img" aria-label="search">
                  🔍
                </span>
                <h3 className="text-xl font-bold text-slate-800">
                  No Poses Found
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  No yoga poses match your search term or selected filters. Try
                  clearing filters or searching for English or Sanskrit names
                  like "Dog" or "Adho Mukha".
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Categories");
                    setSelectedDifficulty("All Difficulties");
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg border border-slate-300"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {poses.map((pose) => (
                  <div
                    key={pose.id}
                    onClick={() => setSelectedPose(pose)}
                    className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex gap-1.5 flex-wrap">
                          <span className="bg-emerald-50 text-emerald-800 text-[11px] px-2 py-0.5 rounded font-semibold border border-emerald-200">
                            {pose.difficulty || "Beginner"}
                          </span>
                          <span className="bg-teal-50 text-teal-800 text-[11px] px-2 py-0.5 rounded font-semibold border border-teal-200">
                            {pose.category || "Standing"}
                          </span>
                        </div>
                        <FavoriteButton
                          poseId={pose.id}
                          initialIsFavorite={pose.is_favorite}
                          onToggle={(id, status) =>
                            handleFavoriteToggleInGrid(id, status)
                          }
                        />
                      </div>

                      <h3 className="text-lg font-bold font-serif text-slate-900 group-hover:text-teal-900 transition-colors">
                        {pose.english_name}
                      </h3>
                      {pose.sanskrit_name && (
                        <p className="text-xs italic text-teal-700 mt-0.5">
                          {pose.sanskrit_name}
                        </p>
                      )}

                      {pose.target_muscles && (
                        <p className="text-xs text-slate-500 mt-3 line-clamp-1">
                          💪 {pose.target_muscles}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs font-semibold text-teal-800">
                      <span>View Form Guide</span>
                      <span>→</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Form Guide Detail Modal */}
      {selectedPose && (
        <FormGuideModal
          pose={selectedPose}
          onClose={() => setSelectedPose(null)}
          onFavoriteToggle={(poseId, newStatus) =>
            handleFavoriteToggleInGrid(poseId, newStatus)
          }
        />
      )}

      {/* Add Custom Pose Modal */}
      {showAddPoseModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-xl font-bold font-serif text-teal-950">
                + Create Custom Pose
              </h3>
              <button
                onClick={() => setShowAddPoseModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

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
                  placeholder="e.g. Downward-Facing Dog"
                  value={newPose.english_name}
                  onChange={(e) =>
                    setNewPose({ ...newPose, english_name: e.target.value })
                  }
                  className="w-full p-2.5 border rounded-lg bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sanskrit Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Adho Mukha Svanasana"
                  value={newPose.sanskrit_name}
                  onChange={(e) =>
                    setNewPose({ ...newPose, sanskrit_name: e.target.value })
                  }
                  className="w-full p-2.5 border rounded-lg bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newPose.category}
                    onChange={(e) =>
                      setNewPose({ ...newPose, category: e.target.value })
                    }
                    className="w-full p-2.5 border rounded-lg bg-slate-50"
                  >
                    <option>Standing</option>
                    <option>Seated</option>
                    <option>Inversion</option>
                    <option>Balance</option>
                    <option>Restorative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={newPose.difficulty}
                    onChange={(e) =>
                      setNewPose({ ...newPose, difficulty: e.target.value })
                    }
                    className="w-full p-2.5 border rounded-lg bg-slate-50"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alignment Cues
                </label>
                <textarea
                  rows="2"
                  placeholder="Step-by-step cues..."
                  value={newPose.alignment_cues}
                  onChange={(e) =>
                    setNewPose({ ...newPose, alignment_cues: e.target.value })
                  }
                  className="w-full p-2.5 border rounded-lg bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Breath Instructions
                </label>
                <input
                  type="text"
                  placeholder="e.g. Inhale on lift, exhale on fold..."
                  value={newPose.breath_instructions}
                  onChange={(e) =>
                    setNewPose({
                      ...newPose,
                      breath_instructions: e.target.value,
                    })
                  }
                  className="w-full p-2.5 border rounded-lg bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Targeted Muscles
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hamstrings, Shoulders, Calves"
                  value={newPose.target_muscles}
                  onChange={(e) =>
                    setNewPose({ ...newPose, target_muscles: e.target.value })
                  }
                  className="w-full p-2.5 border rounded-lg bg-slate-50"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPoseModal(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingPose}
                  className="px-5 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-lg font-semibold"
                >
                  {creatingPose ? "Saving..." : "Save Pose"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
