import React, { useState } from "react";
import { FolderPlus } from "lucide-react";

export default function CategoryFormCard({ onSubmit }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      setName("");
      setDescription("");
      setSuccess("Category added successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-[#171c29] mb-4 flex items-center gap-2">
        <FolderPlus className="w-5 h-5 text-[#2663eb]" /> Add New Category
      </h2>

      {error && (
        <div
          className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
          role="alert"
        >
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="category-name"
            className="block text-xs font-semibold text-[#707a8c] mb-1"
          >
            Category Name *
          </label>
          <input
            id="category-name"
            type="text"
            placeholder="e.g. Groceries, Shopping, Subscriptions"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-[#e3e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
          />
        </div>

        <div>
          <label
            htmlFor="category-description"
            className="block text-xs font-semibold text-[#707a8c] mb-1"
          >
            Description
          </label>
          <textarea
            id="category-description"
            rows="3"
            placeholder="Brief details about what goes into this category"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-[#e3e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2663eb] text-white py-2 px-4 rounded-lg font-medium text-sm hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? "Adding..." : "Create Category"}
        </button>
      </form>
    </div>
  );
}
