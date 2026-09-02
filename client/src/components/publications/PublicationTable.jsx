import React from "react";
import {
  BookOpen,
  Calendar,
  ExternalLink,
  Trash2,
  Users,
  Package,
} from "lucide-react";

export default function PublicationTable({
  publications = [],
  loading,
  onDeletePublication,
}) {
  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg border border-stone-200 text-center text-stone-500">
        Loading publication records...
      </div>
    );
  }

  if (publications.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg border border-stone-200 text-center text-stone-500">
        No academic publication citations found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-stone-200">
          <thead className="bg-stone-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Article / Paper Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Authors & Journal
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Publication Date / DOI
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Linked Artifacts
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 bg-white text-sm">
            {publications.map((pub) => (
              <tr key={pub.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-bold text-stone-900 leading-snug">
                    {pub.title}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-1 text-xs font-medium text-stone-800">
                    <Users className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{pub.authors}</span>
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">
                    {pub.journal_publisher}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs font-mono text-stone-700">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>{pub.publication_date}</span>
                  </div>
                  {pub.doi ? (
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs text-amber-800 font-medium hover:underline mt-1"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      DOI: {pub.doi}
                    </a>
                  ) : (
                    <span className="text-stone-400 italic text-[11px] block mt-1">
                      No DOI provided
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs">
                  {pub.linked_artifact_ids &&
                  pub.linked_artifact_ids.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {pub.linked_artifact_ids.map((artId) => (
                        <span
                          key={artId}
                          className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 text-[11px] font-mono border border-amber-200"
                        >
                          <Package className="w-3 h-3 mr-1 text-amber-800" />
                          {artId.substring(0, 8)}...
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-stone-400 italic">None</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {onDeletePublication && (
                    <button
                      onClick={() => onDeletePublication(pub.id)}
                      title="Delete Publication"
                      className="p-1 text-stone-400 hover:text-red-600 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
