import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Play, Edit2, Trash2 } from "lucide-react";

export default function DeckCard({
  deck,
  cardCount,
  onEdit,
  onDelete,
  onStartQuiz,
}) {
  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="font-bold text-lg text-text_primary line-clamp-1">
            {deck.title}
          </h3>
          <div className="flex items-center gap-1 text-xs font-medium text-primary bg-blue-50 px-2.5 py-1 rounded-full shrink-0">
            <BookOpen className="size-3.5" />
            <span>
              {cardCount} {cardCount === 1 ? "card" : "cards"}
            </span>
          </div>
        </div>
        <p className="text-text_secondary text-sm mb-6 line-clamp-2 h-10">
          {deck.description || "No description provided."}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(deck)}
            className="p-2 text-text_secondary hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Deck"
          >
            <Edit2 className="size-4" />
          </button>
          <button
            onClick={() => onDelete(deck.id)}
            className="p-2 text-text_secondary hover:text-error hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Deck"
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/decks/${deck.id}`}
            className="px-3 py-1.5 text-xs font-medium text-text_secondary hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
          >
            Manage Cards
          </Link>
          {cardCount > 0 ? (
            <button
              onClick={() => onStartQuiz(deck.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-primary hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
            >
              <Play className="size-3 fill-current" />
              <span>Study</span>
            </button>
          ) : (
            <button
              disabled
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
              title="Add cards first to study"
            >
              <Play className="size-3" />
              <span>Empty</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
