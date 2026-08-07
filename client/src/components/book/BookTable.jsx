import React from "react";
import { Edit, Trash2, Eye } from "lucide-react";

export default function BookTable({ books, onEdit, onDelete, onViewDetails }) {
  if (!books || books.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400">
        No books found in the catalog.
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 border-b border-slate-800">
              <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Title
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Author
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                ISBN
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Genre
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Publication Date
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
            {books.map((book) => (
              <tr
                key={book.id}
                className="hover:bg-slate-800/30 transition-colors"
              >
                <td className="py-4 px-6 font-medium text-slate-100">
                  <button
                    onClick={() => onViewDetails(book)}
                    className="hover:text-emerald-400 hover:underline text-left focus:outline-none"
                  >
                    {book.title}
                  </button>
                </td>
                <td className="py-4 px-6 text-slate-300">{book.author}</td>
                <td className="py-4 px-6 font-mono text-xs text-slate-400">
                  {book.isbn}
                </td>
                <td className="py-4 px-6 text-slate-400">
                  {book.genre || "N/A"}
                </td>
                <td className="py-4 px-6 text-slate-400">
                  {book.publication_date || "N/A"}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      book.available_copies > 0
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {book.available_copies > 0 ? "Available" : "Loaned"}
                  </span>
                </td>
                <td className="py-4 px-6 text-right space-x-2">
                  <button
                    onClick={() => onViewDetails(book)}
                    className="text-slate-400 hover:text-emerald-400 transition-colors p-1"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEdit(book)}
                    className="text-slate-400 hover:text-emerald-400 transition-colors p-1"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(book.id)}
                    className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
