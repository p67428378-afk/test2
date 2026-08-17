import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import { itemService } from "../services/api";

export default function ReportItemPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [location, setLocation] = useState("");
  const [reportDate, setReportDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [contactInfo, setContactInfo] = useState("");
  const [status, setStatus] = useState("lost");
  const [imageUrls, setImageUrls] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAddImageUrl = () => {
    if (imageUrls.length < 3) {
      setImageUrls([...imageUrls, ""]);
    }
  };

  const handleRemoveImageUrl = (index) => {
    const updated = imageUrls.filter((_, idx) => idx !== index);
    setImageUrls(updated.length > 0 ? updated : [""]);
  };

  const handleImageUrlChange = (index, val) => {
    const updated = [...imageUrls];
    updated[index] = val;
    setImageUrls(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !location.trim() || !contactInfo.trim()) {
      setError("Please fill in all mandatory fields.");
      return;
    }

    // Filter out empty image URLs
    const validImageUrls = imageUrls.filter((url) => url.trim() !== "");

    setLoading(true);
    try {
      await itemService.reportItem({
        name,
        description: description || null,
        category,
        location,
        report_date: new Date(reportDate).toISOString(),
        contact_info: contactInfo,
        status,
        image_urls: validImageUrls.length > 0 ? validImageUrls : null,
      });

      setSuccess("Item reported successfully! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
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
    <AppLayout>
      <header className="mb-8 flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Report an Item</h2>
          <p className="text-slate-500 mt-1">
            Provide details about the lost or found item.
          </p>
        </div>
      </header>

      <div className="max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl flex items-center gap-3">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl flex items-center gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Item Status <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-all font-semibold text-sm select-none border-rose-200 bg-rose-50/30 text-rose-700">
                <input
                  type="radio"
                  name="status"
                  value="lost"
                  checked={status === "lost"}
                  onChange={() => setStatus("lost")}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <span>Lost Item</span>
              </label>
              <label className="flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-all font-semibold text-sm select-none border-emerald-200 bg-emerald-50/30 text-emerald-700">
                <input
                  type="radio"
                  name="status"
                  value="found"
                  checked={status === "found"}
                  onChange={() => setStatus("found")}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span>Found Item</span>
              </label>
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Item Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. iPhone 13 Pro, Toyota Car Keys"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              required
            />
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              >
                <option value="Electronics">Electronics</option>
                <option value="Keys">Keys</option>
                <option value="Wallet">Wallet</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Date of Loss/Discovery <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Location & Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Location <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Student Union, Library Cafe"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Contact Information <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="e.g. Email or Phone Number"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Provide any distinguishing features, colors, or unique marks..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Image URLs */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-slate-700">
                Image URLs (Up to 3)
              </label>
              {imageUrls.length < 3 && (
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Image
                </button>
              )}
            </div>
            <div className="space-y-3">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  />
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImageUrl(idx)}
                      className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-xl font-semibold transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Save className="h-5 w-5" />
              {loading ? "Submitting..." : "Submit Report"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
