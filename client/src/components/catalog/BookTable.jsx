import React from "react";
import { Edit2, Trash2, CheckCircle, XCircle } from "lucide-react";

const BookTable = ({ books, onEdit, onDelete }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/50 border-b border-slate-800">
              <th className="p-4 pl-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Title
              </th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Author
              </th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                ISBN
              </th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Category
              </th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Copies
              </th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="p-4 pr-6 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-300 divide-y divide-slate-800/50">
            {books.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-slate-500">
                  No books found in the catalog.
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr
                  key={book.id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="p-4 pl-6 font-medium text-white">
                    {book.title}
                  </td>
                  <td className="p-4">{book.author}</td>
                  <td className="p-4 font-mono text-xs text-slate-400">
                    {book.isbn}
                  </td>
                  <td className="p-4">{book.category}</td>
                  <td className="p-4">
                    <span className="text-indigo-400 font-semibold">
                      {book.copies_available}
                    </span>
                    <span className="text-slate-500">
                      {" "}
                      / {book.copies_total}
                    </span>
                  </td>
                  <td className="p-4">
                    {book.copies_available > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                        <CheckCircle className="w-3 h-3" /> Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
                        <XCircle className="w-3 h-3" /> Checked Out
                      </span>
                    )}
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <button
                      onClick={() => onEdit && onEdit(book)}
                      className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-indigo-400 transition-colors"
                      title="Edit Book"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(book.id)}
                      className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-red-400 transition-colors"
                      title="Delete Book"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookTable;
