import React, { useState } from "react";
import { itemService } from "../../services/api";
import Button from "../common/Button.jsx";

export default function ItemForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    location_text: "",
    status: "reported_lost",
    item_date: new Date().toISOString().split("T")[0],
    image_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        lat: null,
        lon: null,
        image_url: formData.image_url || null,
      };
      await itemService.createItem(payload);
      onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to report item. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
          Item Name *
        </label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Black iPhone 14"
          className="w-full bg-[#0F172A] border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Status *
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full bg-[#0F172A] border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none"
          >
            <option value="reported_lost">Lost</option>
            <option value="reported_found">Found</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Date *
          </label>
          <input
            type="date"
            name="item_date"
            required
            value={formData.item_date}
            onChange={handleChange}
            className="w-full bg-[#0F172A] border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Category *
          </label>
          <input
            type="text"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g. Electronics"
            className="w-full bg-[#0F172A] border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Location *
          </label>
          <input
            type="text"
            name="location_text"
            required
            value={formData.location_text}
            onChange={handleChange}
            placeholder="e.g. Library Desk"
            className="w-full bg-[#0F172A] border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Provide details like color, brand, serial number, etc."
          rows="3"
          className="w-full bg-[#0F172A] border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
          Image URL (Optional)
        </label>
        <input
          type="url"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className="w-full bg-[#0F172A] border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
        <Button onClick={onCancel} variant="secondary" disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Submitting..." : "Report Item"}
        </Button>
      </div>
    </form>
  );
}
