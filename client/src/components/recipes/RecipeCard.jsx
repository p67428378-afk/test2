import React from "react";
import { Link } from "react-router-dom";
import { Heart, Clock, Users, Edit3, Trash2 } from "lucide-react";

export default function RecipeCard({
  recipe,
  currentUserId,
  onToggleFavorite,
  onDelete,
}) {
  if (!recipe) return null;

  const isOwner = currentUserId && recipe.user_id === currentUserId;
  const isFavorite = recipe.is_favorite;

  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between h-full">
      <div className="p-5">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="bg-[#e05929]/10 text-[#e05929] text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {recipe.category_name || "General"}
          </span>
          <button
            type="button"
            onClick={() =>
              onToggleFavorite && onToggleFavorite(recipe.id, isFavorite)
            }
            className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </button>
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-[#171c29] mb-2 line-clamp-1 hover:text-[#e05929] transition">
          <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
        </h3>

        {/* Description */}
        {recipe.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {recipe.description}
          </p>
        )}

        {/* Dietary Tags */}
        {recipe.dietary_tags && recipe.dietary_tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {recipe.dietary_tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="px-5 py-3 bg-[#f7fafc] border-t border-[#e3e8f0] flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>{totalTime} mins</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-gray-400" />
            <span>{recipe.servings} serv</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isOwner && (
            <>
              <Link
                to={`/recipes/${recipe.id}/edit`}
                className="p-1 hover:text-[#e05929] transition"
                title="Edit recipe"
              >
                <Edit3 className="w-4 h-4" />
              </Link>
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(recipe.id)}
                  className="p-1 hover:text-red-600 transition"
                  title="Delete recipe"
                  aria-label="Delete recipe"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </>
          )}
          <Link
            to={`/recipes/${recipe.id}`}
            className="bg-[#e05929] hover:bg-[#c8491f] text-white px-3 py-1 rounded font-medium text-xs transition"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
