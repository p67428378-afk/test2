import React, { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function ReportForm({ onSubmit, isLoading, error, success }) {
  const [itemType, setItemType] = useState("lost");
  const [category, setCategory] = useState("Electronics");
  const [color, setColor] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [itemDate, setItemDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const imageUrls = imageUrl
      ? imageUrl.split(",").map((url) => url.trim())
      : [];
    onSubmit({
      item_type: itemType,
      category,
      color: color || null,
      brand: brand || null,
      description,
      location,
      item_date: itemDate,
      image_urls: imageUrls,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6 max-w-2xl mx-auto"
    >
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900">
          Report Lost or Found Item
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Provide accurate details to help our AI matching algorithm find
          potential matches.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Error submitting report</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 text-green-700 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Report submitted successfully!</p>
            <p>Your item has been registered and AI matching is running.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Item Type */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Item Type
          </label>
          <div className="flex gap-4">
            <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-red-500 has-[:checked]:bg-red-50/50">
              <input
                type="radio"
                name="item_type"
                value="lost"
                checked={itemType === "lost"}
                onChange={() => setItemType("lost")}
                className="text-red-600 focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-900">Lost</span>
            </label>
            <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-green-500 has-[:checked]:bg-green-50/50">
              <input
                type="radio"
                name="item_type"
                value="found"
                checked={itemType === "found"}
                onChange={() => setItemType("found")}
                className="text-green-600 focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-900">Found</span>
            </label>
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label
            htmlFor="category"
            className="block text-sm font-semibold text-gray-700"
          >
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full bg-gray-50 border border-gray-300 rounded-lg text-sm px-3 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          >
            <option value="Electronics">Electronics</option>
            <option value="Documents">Documents</option>
            <option value="Keys">Keys</option>
            <option value="Clothing">Clothing</option>
            <option value="Bags">Bags</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Color */}
        <div className="space-y-2">
          <label
            htmlFor="color"
            className="block text-sm font-semibold text-gray-700"
          >
            Color
          </label>
          <input
            id="color"
            type="text"
            placeholder="e.g. Black, Silver"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg text-sm px-3 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>

        {/* Brand */}
        <div className="space-y-2">
          <label
            htmlFor="brand"
            className="block text-sm font-semibold text-gray-700"
          >
            Brand
          </label>
          <input
            id="brand"
            type="text"
            placeholder="e.g. Apple, Samsung"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg text-sm px-3 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>

        {/* Location */}
        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="location"
            className="block text-sm font-semibold text-gray-700"
          >
            Last Seen Location
          </label>
          <input
            id="location"
            type="text"
            placeholder="e.g. Library Room 204, Main Cafeteria"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full bg-gray-50 border border-gray-300 rounded-lg text-sm px-3 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label
            htmlFor="item_date"
            className="block text-sm font-semibold text-gray-700"
          >
            Date of Loss/Found
          </label>
          <input
            id="item_date"
            type="date"
            value={itemDate}
            onChange={(e) => setItemDate(e.target.value)}
            required
            className="w-full bg-gray-50 border border-gray-300 rounded-lg text-sm px-3 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>

        {/* Image URL */}
        <div className="space-y-2">
          <label
            htmlFor="image_url"
            className="block text-sm font-semibold text-gray-700"
          >
            Image URL (Optional)
          </label>
          <input
            id="image_url"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg text-sm px-3 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="Provide a detailed description of the item (e.g. serial numbers, unique scratches, stickers, contents inside)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full bg-gray-50 border border-gray-300 rounded-lg text-sm px-3 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>Submit Report</span>
        </button>
      </div>
    </form>
  );
}
