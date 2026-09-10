import React from "react";
import {
  FileText,
  UploadCloud,
  Eye,
  Trash2,
  AlertTriangle,
  Inbox,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import CategoryOverrideDropdown from "./CategoryOverrideDropdown";

export default function ClassificationTable({
  emails = [],
  total = 0,
  skip = 0,
  limit = 20,
  isLoading = false,
  onPageChange,
  onLimitChange,
  onInspectEmail,
  onInlineOverride,
  onDeleteEmail,
}) {
  const getCategoryBadge = (category) => {
    switch (category?.toLowerCase()) {
      case "urgent":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "work":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "personal":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "promotional":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getProgressBarColor = (score) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-indigo-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-rose-500";
  };

  const totalPages = Math.ceil(total / limit) || 1;
  const currentPage = Math.floor(skip / limit) + 1;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Table responsive container */}
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left text-xs sm:text-sm text-slate-600">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th scope="col" className="py-3.5 px-4">
                Source & Date
              </th>
              <th scope="col" className="py-3.5 px-4">
                Sender & Subject
              </th>
              <th scope="col" className="py-3.5 px-4">
                Active Category
              </th>
              <th scope="col" className="py-3.5 px-4">
                AI Confidence
              </th>
              <th scope="col" className="py-3.5 px-4">
                Status
              </th>
              <th scope="col" className="py-3.5 px-4 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-semibold">
                      Loading email records...
                    </span>
                  </div>
                </td>
              </tr>
            ) : emails.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">
                    No emails match the selected filters
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Try adjusting your search query, confidence slider, or
                    category filters.
                  </p>
                </td>
              </tr>
            ) : (
              emails.map((email) => {
                const category =
                  email.classification?.user_override_category ||
                  email.classification?.primary_category ||
                  email.classification?.ai_category ||
                  "Work";
                const isOverridden = email.classification?.is_overridden;
                const confidence = email.classification?.confidence_score ?? 0;
                const isFile = email.source_type === "FILE_UPLOAD";

                return (
                  <tr
                    key={email.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Source & Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          {isFile ? (
                            <UploadCloud className="w-4 h-4" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-xs">
                            {isFile ? "File Upload" : "Direct Text"}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {email.created_at
                              ? new Date(email.created_at).toLocaleDateString(
                                  [],
                                  {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )
                              : "Recent"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Sender & Subject Excerpt */}
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 text-xs truncate">
                            {email.subject ||
                              (email.file_name
                                ? email.file_name
                                : "No Subject")}
                          </p>
                          {email.sender && (
                            <span className="text-[10px] text-slate-400 font-medium px-1.5 py-0.2 rounded bg-slate-100 truncate">
                              {email.sender}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {email.excerpt || email.body_text}
                        </p>
                      </div>
                    </td>

                    {/* Active Category with Quick Selector */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getCategoryBadge(
                            category,
                          )}`}
                        >
                          {category}
                        </span>
                        <CategoryOverrideDropdown
                          currentCategory={category}
                          onSelectCategory={(newCat) =>
                            onInlineOverride &&
                            onInlineOverride(email.id, newCat)
                          }
                          size="sm"
                        />
                      </div>
                    </td>

                    {/* AI Confidence Meter */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-1 w-24">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                          <span>{confidence.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full transition-all ${getProgressBarColor(
                              confidence,
                            )}`}
                            style={{
                              width: `${Math.min(100, Math.max(8, confidence))}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isOverridden ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <ShieldCheck className="w-3 h-3" /> Overridden
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Sparkles className="w-3 h-3 text-emerald-500" /> AI
                          Verified
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            onInspectEmail && onInspectEmail(email)
                          }
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Inspect Details & Override"
                          aria-label="Inspect Email"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onDeleteEmail && onDeleteEmail(email.id)
                          }
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Email Record"
                          aria-label="Delete Email"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>
            Showing{" "}
            <strong className="text-slate-800">
              {total === 0 ? 0 : skip + 1}
            </strong>{" "}
            to{" "}
            <strong className="text-slate-800">
              {Math.min(skip + limit, total)}
            </strong>{" "}
            of <strong className="text-slate-800">{total}</strong> classified
            emails
          </span>

          <div className="flex items-center gap-1 ml-4">
            <span>Per page:</span>
            <select
              value={limit}
              onChange={(e) =>
                onLimitChange && onLimitChange(Number(e.target.value))
              }
              className="px-2 py-0.5 border border-slate-300 rounded bg-white text-slate-700 text-xs focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage <= 1 || isLoading}
            onClick={() => onPageChange && onPageChange(skip - limit)}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-medium text-slate-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages || isLoading}
            onClick={() => onPageChange && onPageChange(skip + limit)}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
