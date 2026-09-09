import React, { useState, useEffect } from "react";
import { poseService } from "../services/api";

export function FavoriteButton({ poseId, initialIsFavorite, onToggle }) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite || false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  const handleToggle = async (e) => {
    e.stopPropagation();
    try {
      setLoading(true);
      if (isFavorite) {
        await poseService.removeFavorite(poseId);
        setIsFavorite(false);
        if (onToggle) onToggle(poseId, false);
      } else {
        await poseService.addFavorite(poseId);
        setIsFavorite(true);
        if (onToggle) onToggle(poseId, true);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      className={`p-2 rounded-full transition-all text-sm font-medium ${
        isFavorite
          ? "bg-amber-100 text-amber-800 border border-amber-300 shadow-sm"
          : "bg-slate-100 text-slate-500 hover:text-amber-600 hover:bg-amber-50"
      }`}
    >
      {isFavorite ? "★" : "☆"}
    </button>
  );
}

export default function FavoritesManager({ onSelectPose }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await poseService.getFavorites("default_user");
      setFavorites(data || []);
    } catch (err) {
      setError("Failed to load favorited poses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (poseId, e) => {
    e.stopPropagation();
    try {
      await poseService.removeFavorite(poseId);
      setFavorites((prev) => prev.filter((p) => p.id !== poseId));
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading favorited poses...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
        {error}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 text-center space-y-2">
        <span className="text-4xl" role="img" aria-label="star">
          ⭐
        </span>
        <h3 className="text-lg font-bold text-slate-700">No Favorites Yet</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Bookmark poses in the Pose Dictionary by clicking the star icon to
          save them for quick reference and routine creation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-teal-950 font-serif">
          ⭐ Bookmarked Favorites ({favorites.length})
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {favorites.map((pose) => (
          <div
            key={pose.id}
            onClick={() => onSelectPose && onSelectPose(pose)}
            className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start gap-2 mb-2">
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded font-semibold">
                  {pose.category || "General"}
                </span>
                <button
                  onClick={(e) => handleRemove(pose.id, e)}
                  title="Remove from favorites"
                  className="text-amber-500 hover:text-red-500 font-bold text-lg"
                >
                  ★
                </button>
              </div>
              <h4 className="font-bold text-slate-900 font-serif text-base">
                {pose.english_name}
              </h4>
              {pose.sanskrit_name && (
                <p className="text-xs italic text-teal-700">
                  {pose.sanskrit_name}
                </p>
              )}
            </div>
            <div className="mt-3 pt-2 border-t flex justify-between items-center text-xs text-slate-500">
              <span>{pose.difficulty || "Beginner"}</span>
              <span className="text-teal-700 font-semibold">View Guide →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
