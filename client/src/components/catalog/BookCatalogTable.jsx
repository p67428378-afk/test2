import React from "react";
import Button from "../common/Button.jsx";
import { Edit2, Trash2 } from "lucide-react";

export default function BookCatalogTable({ books, onEdit, onDelete }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900/30 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Author</th>
              <th className="px-6 py-3">ISBN</th>
              <th className="px-6 py-3">Genre</th>
              <th className="px-6 py-3">Year</th>
              <th className="px-6 py-3">Total Copies</th>
              <th className="px-6 py-3">Available Copies</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-sm text-slate-300">
            {books.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No books found in the catalog.
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr
                  key={book.id}
                  className="hover:bg-slate-700/20 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-200">
                    {book.title}
                  </td>
                  <td className="px-6 py-4">{book.author}</td>
                  <td className="px-6 py-4 text-xs font-mono">{book.isbn}</td>
                  <td className="px-6 py-4">{book.genre || "N/A"}</td>
                  <td className="px-6 py-4">
                    {book.publication_year || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-center">{book.total_copies}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`font-semibold ${book.available_copies > 0 ? "text-emerald-400" : "text-rose-400"}`}
                    >
                      {book.available_copies}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(book)}
                        className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(book.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
