import React, { useState } from "react";
import Button from "../common/Button";
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react";

export const ReportForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    type: "lost",
    category: "Electronics",
    name: "",
    description: "",
    location: "",
    date_incident: new Date().toISOString().slice(0, 16),
    contact_info: "",
    imageUrl: "",
    imageSizeMb: 1,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const categories = [
    "Electronics",
    "Wallets & Bags",
    "Clothing",
    "Keys & Cards",
    "Jewelry & Watches",
    "Documents & Books",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...setErrors({ ...errors, [name]: "" }),
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Item name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.contact_info.trim())
      newErrors.contact_info = "Contact information is required";
    if (!formData.date_incident)
      newErrors.date_incident = "Incident date and time is required";
    if (formData.imageSizeMb > 5)
      newErrors.imageUrl = "Image file size exceeds limit (Max 5MB)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    const payload = {
      type: formData.type,
      category: formData.category,
      name: formData.name,
      description: formData.description,
      location: formData.location,
      date_incident: new Date(formData.date_incident).toISOString(),
      contact_info: formData.contact_info,
      images: formData.imageUrl
        ? [
            {
              image_url: formData.imageUrl,
              file_size_mb: Number(formData.imageSizeMb) || 1,
            },
          ]
        : [],
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      setServerError(err.message || "Failed to submit report.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6"
    >
      {serverError && (
        <div
          role="alert"
          className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm flex items-center gap-2"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Report Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, type: "lost" }))}
            className={`py-3 px-4 rounded-lg font-medium text-sm flex items-center justify-center border transition ${
              formData.type === "lost"
                ? "bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-200"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            I Lost an Item
          </button>
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, type: "found" }))}
            className={`py-3 px-4 rounded-lg font-medium text-sm flex items-center justify-center border transition ${
              formData.type === "found"
                ? "bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-200"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            I Found an Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Item Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Blue Leather Wallet, iPhone 14"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
              errors.name ? "border-rose-400 bg-rose-50/50" : "border-slate-200"
            }`}
          />
          {errors.name && (
            <p className="text-xs text-rose-600 mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Category <span className="text-rose-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Detailed Description <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Include unique marks, colors, brand, serial numbers, or distinct contents..."
          value={formData.description}
          onChange={handleChange}
          className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
            errors.description
              ? "border-rose-400 bg-rose-50/50"
              : "border-slate-200"
          }`}
        />
        {errors.description && (
          <p className="text-xs text-rose-600 mt-1">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Location Lost / Found <span className="text-rose-500">*</span>
          </label>
          <input
            id="location"
            name="location"
            type="text"
            placeholder="e.g. Building A, 2nd Floor Cafeteria"
            value={formData.location}
            onChange={handleChange}
            className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
              errors.location
                ? "border-rose-400 bg-rose-50/50"
                : "border-slate-200"
            }`}
          />
          {errors.location && (
            <p className="text-xs text-rose-600 mt-1">{errors.location}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="date_incident"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Date & Time <span className="text-rose-500">*</span>
          </label>
          <input
            id="date_incident"
            name="date_incident"
            type="datetime-local"
            value={formData.date_incident}
            onChange={handleChange}
            className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
              errors.date_incident
                ? "border-rose-400 bg-rose-50/50"
                : "border-slate-200"
            }`}
          />
          {errors.date_incident && (
            <p className="text-xs text-rose-600 mt-1">{errors.date_incident}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="contact_info"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Contact Information <span className="text-rose-500">*</span>
        </label>
        <input
          id="contact_info"
          name="contact_info"
          type="text"
          placeholder="e.g. Phone number or Email address"
          value={formData.contact_info}
          onChange={handleChange}
          className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
            errors.contact_info
              ? "border-rose-400 bg-rose-50/50"
              : "border-slate-200"
          }`}
        />
        {errors.contact_info && (
          <p className="text-xs text-rose-600 mt-1">{errors.contact_info}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Image Attachment (Optional)
        </label>
        <div className="flex gap-4 items-center">
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            placeholder="e.g. https://images.unsplash.com/photo-..."
            value={formData.imageUrl}
            onChange={handleChange}
            className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <div className="w-32">
            <input
              type="number"
              title="Image Size in MB"
              placeholder="Size (MB)"
              value={formData.imageSizeMb}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  imageSizeMb: parseFloat(e.target.value) || 0,
                }))
              }
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
            />
          </div>
        </div>
        {errors.imageUrl && (
          <p className="text-xs text-rose-600 mt-1">{errors.imageUrl}</p>
        )}
        <p className="text-xs text-slate-400 mt-1">
          Image size limit is strictly 5MB.
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
        <Button type="submit" loading={loading} className="w-full sm:w-auto">
          Submit Item Report
        </Button>
      </div>
    </form>
  );
};

export default ReportForm;
