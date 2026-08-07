import React from "react";
import Button from "../common/Button.jsx";
import { Calendar, BookOpen, Hash, Tag, Layers, ArrowLeft } from "lucide-react";

export default function BookDetailsCard({ book, onBack, onEdit }) {
  if (!book) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Catalog
        </button>
        <Button variant="secondary" size="sm" onClick={() => onEdit(book)}>
          Edit Book
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-100">{book.title}</h3>
          <p className="text-slate-400 text-sm mt-1">by {book.author}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-800 rounded-lg">
            <Hash className="h-5 w-5 text-emerald-400" />
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">
                ISBN
              </p>
              <p className="text-sm text-slate-200 font-mono">{book.isbn}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-800 rounded-lg">
            <Tag className="h-5 w-5 text-emerald-400" />
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">
                Genre
              </p>
              <p className="text-sm text-slate-200">{book.genre || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-800 rounded-lg">
            <Calendar className="h-5 w-5 text-emerald-400" />
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">
                Publication Date
              </p>
              <p className="text-sm text-slate-200">
                {book.publication_date || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-800 rounded-lg">
            <Layers className="h-5 w-5 text-emerald-400" />
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">
                Copies
              </p>
              <p className="text-sm text-slate-200">
                {book.available_copies} / {book.total_copies} available
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <p>Added: {new Date(book.created_at).toLocaleDateString()}</p>
          <p>Last Updated: {new Date(book.updated_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
