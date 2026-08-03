import React, { useState, useEffect } from "react";
import Button from "../common/Button.jsx";
import { Save, X } from "lucide-react";

export default function InventoryForm({
  initialData,
  onSave,
  onCancel,
  isSubmitting,
}) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    quantity: 0,
    unit: "",
    supplier: "",
    low_stock_threshold: 10,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        category: initialData.category || "",
        description: initialData.description || "",
        quantity: initialData.quantity ?? 0,
        unit: initialData.unit || "",
        supplier: initialData.supplier || "",
        low_stock_threshold: initialData.low_stock_threshold ?? 10,
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Item name is required.";
    }
    if (!formData.unit.trim()) {
      newErrors.unit = "Unit is required (e.g., box, piece).";
    }
    if (formData.quantity < 0) {
      newErrors.quantity = "Quantity cannot be negative.";
    }
    if (formData.low_stock_threshold < 0) {
      newErrors.low_stock_threshold = "Threshold cannot be negative.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "low_stock_threshold"
          ? parseInt(value) || 0
          : value,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-2xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1 md:col-span-2">
          <label
            htmlFor="name"
            className="text-xs font-semibold text-slate-400 uppercase"
          >
            Item Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-slate-900 border ${
              errors.name ? "border-rose-500" : "border-slate-700"
            } rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm`}
            placeholder="e.g., Sterile Gloves"
          />
          {errors.name && (
            <p className="text-xs text-rose-400 mt-1">{errors.name}</p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="category"
            className="text-xs font-semibold text-slate-400 uppercase"
          >
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
            placeholder="e.g., PPE, Consumables"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="supplier"
            className="text-xs font-semibold text-slate-400 uppercase"
          >
            Supplier
          </label>
          <input
            id="supplier"
            name="supplier"
            type="text"
            value={formData.supplier}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
            placeholder="e.g., Medline, 3M"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="quantity"
            className="text-xs font-semibold text-slate-400 uppercase"
          >
            Quantity *
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            value={formData.quantity}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-slate-900 border ${
              errors.quantity ? "border-rose-500" : "border-slate-700"
            } rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm`}
          />
          {errors.quantity && (
            <p className="text-xs text-rose-400 mt-1">{errors.quantity}</p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="unit"
            className="text-xs font-semibold text-slate-400 uppercase"
          >
            Unit *
          </label>
          <input
            id="unit"
            name="unit"
            type="text"
            value={formData.unit}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-slate-900 border ${
              errors.unit ? "border-rose-500" : "border-slate-700"
            } rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm`}
            placeholder="e.g., box, piece, pack"
          />
          {errors.unit && (
            <p className="text-xs text-rose-400 mt-1">{errors.unit}</p>
          )}
        </div>

        <div className="space-y-1 md:col-span-2">
          <label
            htmlFor="low_stock_threshold"
            className="text-xs font-semibold text-slate-400 uppercase"
          >
            Low Stock Threshold
          </label>
          <input
            id="low_stock_threshold"
            name="low_stock_threshold"
            type="number"
            min="0"
            value={formData.low_stock_threshold}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-slate-900 border ${
              errors.low_stock_threshold
                ? "border-rose-500"
                : "border-slate-700"
            } rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm`}
          />
          {errors.low_stock_threshold && (
            <p className="text-xs text-rose-400 mt-1">
              {errors.low_stock_threshold}
            </p>
          )}
        </div>

        <div className="space-y-1 md:col-span-2">
          <label
            htmlFor="description"
            className="text-xs font-semibold text-slate-400 uppercase"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
            placeholder="Describe the item..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <X className="h-4 w-4" /> Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          <Save className="h-4 w-4" />{" "}
          {isSubmitting ? "Saving..." : "Save Item"}
        </Button>
      </div>
    </form>
  );
}
