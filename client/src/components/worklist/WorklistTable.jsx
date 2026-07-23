import React, { useState } from "react";

export default function WorklistTable({
  items,
  total,
  loading,
  filter,
  setFilter,
  skip,
  setSkip,
  limit,
  onCreateItem,
}) {
  const [newTitle, setNewTitle] = useState("");
  const [newStatus, setNewStatus] = useState("pending");
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await onCreateItem(newTitle, newStatus);
      setNewTitle("");
      setNewStatus("pending");
      setShowAddForm(false);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to create item. Success UI must be gated on a real 2xx response.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed text-tertiary-fixed-variant text-[12px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
            Completed
          </span>
        );
      case "in progress":
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-primary text-[12px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            In Progress
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FEF9C3] text-[#A16207] text-[12px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A16207]"></span>
            Pending
          </span>
        );
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const seconds = Math.floor((new Date() - date) / 1000);
      if (seconds < 60) return "Just now";
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      return formatDate(dateStr);
    } catch (e) {
      return dateStr;
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;
  const currentPage = Math.floor(skip / limit) + 1;

  return (
    <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
      <div className="p-space-lg border-b border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h3 className="font-headline-md text-headline-md text-on-surface">
            Recent Work Items
          </h3>
          {loading && (
            <div
              className="loading-spinner"
              data-testid="loading-spinner"
            ></div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-label-md text-on-surface-variant mr-2">
              Filter:
            </span>
            {["all", "pending", "in_progress", "completed"].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  setSkip(0);
                }}
                className={`px-3 py-1.5 rounded-full text-label-md transition-colors cursor-pointer ${
                  filter === f
                    ? "bg-primary-container text-white"
                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                }`}
              >
                {f === "all"
                  ? "All"
                  : f === "in_progress"
                    ? "In Progress"
                    : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-lg font-label-md text-label-md hover:bg-primary-container transition-all active:scale-95 cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-[18px]"
              data-icon="add"
            >
              add
            </span>
            Add Item
          </button>
        </div>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="p-space-lg bg-surface-container-low border-b border-outline-variant flex flex-col gap-4"
        >
          <h4 className="font-semibold text-on-surface">
            Create New Worklist Item
          </h4>
          {error && (
            <div className="text-error text-sm font-medium">{error}</div>
          )}
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter item title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              className="flex-grow px-4 py-2 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-transparent outline-none text-body-md"
            />
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="px-4 py-2 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-transparent outline-none text-body-md"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-primary text-white px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-primary-container transition-all disabled:opacity-50 cursor-pointer"
              >
                {submitting ? "Creating..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-white border border-outline-variant text-on-surface-variant px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="px-space-lg py-4 font-label-md text-label-md text-on-surface-variant">
                Item ID
              </th>
              <th className="px-space-lg py-4 font-label-md text-label-md text-on-surface-variant">
                Title
              </th>
              <th className="px-space-lg py-4 font-label-md text-label-md text-on-surface-variant">
                Status
              </th>
              <th className="px-space-lg py-4 font-label-md text-label-md text-on-surface-variant">
                Created At
              </th>
              <th className="px-space-lg py-4 font-label-md text-label-md text-on-surface-variant">
                Updated At
              </th>
              <th className="px-space-lg py-4 font-label-md text-label-md text-on-surface-variant text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-space-lg py-8 text-center text-on-surface-variant text-body-md"
                >
                  No work items found.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-surface-container-low/50 transition-colors cursor-pointer group"
                >
                  <td className="px-space-lg py-[18px] text-code-md font-code-md text-on-surface-variant">
                    #{item.id.substring(0, 8).toUpperCase()}
                  </td>
                  <td className="px-space-lg py-[18px] text-body-md font-medium text-on-surface">
                    {item.title}
                  </td>
                  <td className="px-space-lg py-[18px]">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-space-lg py-[18px] text-body-md text-on-surface-variant">
                    {formatDate(item.created_at)}
                  </td>
                  <td className="px-space-lg py-[18px] text-body-md text-on-surface-variant">
                    {formatTimeAgo(item.updated_at)}
                  </td>
                  <td className="px-space-lg py-[18px] text-right">
                    <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                      <span
                        className="material-symbols-outlined text-[20px]"
                        data-icon="more_vert"
                      >
                        more_vert
                      </span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-space-lg py-4 bg-surface border-t border-outline-variant flex items-center justify-between">
        <p className="text-body-md text-on-surface-variant">
          Showing {items.length > 0 ? skip + 1 : 0}-
          {Math.min(skip + limit, total)} of {total} items
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSkip(Math.max(0, skip - limit))}
            disabled={skip === 0}
            className="px-4 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg font-label-md text-label-md transition-colors disabled:opacity-50 cursor-pointer"
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNum = index + 1;
              const isCurrent = pageNum === currentPage;
              return (
                <button
                  key={index}
                  onClick={() => setSkip(index * limit)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-label-md cursor-pointer ${
                    isCurrent
                      ? "bg-primary text-white"
                      : "text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setSkip(skip + limit)}
            disabled={currentPage >= totalPages}
            className="px-4 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg font-label-md text-label-md transition-colors disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
