import React, { useState, useEffect } from "react";
import { plotTypeService } from "../../services/api";

export default function PlotForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Save",
}) {
  const [plotTypes, setPlotTypes] = useState([]);
  const [formData, setFormData] = useState({
    plot_type_id: "",
    status: "Available",
    section: "",
    lot: "",
    plot_number: "",
    dimensions: "",
    capacity: 1,
    price: 0.0,
  });
  const [error, setError] = useState("");
  const [loadingTypes, setLoadingTypes] = useState(true);

  useEffect(() => {
    async function fetchTypes() {
      try {
        const types = await plotTypeService.getPlotTypes();
        setPlotTypes(types);
        if (types.length > 0 && !initialData) {
          setFormData((prev) => ({ ...prev, plot_type_id: types[0].id }));
        }
      } catch (err) {
        setError("Failed to load plot types.");
      } finally {
        setLoadingTypes(false);
      }
    }
    fetchTypes();
  }, [initialData]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        plot_type_id: initialData.plot_type_id || "",
        status: initialData.status || "Available",
        section: initialData.section || "",
        lot: initialData.lot || "",
        plot_number: initialData.plot_number || "",
        dimensions: initialData.dimensions || "",
        capacity: initialData.capacity || 1,
        price: initialData.price || 0.0,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "capacity"
          ? parseInt(value, 10) || 0
          : name === "price"
            ? parseFloat(value) || 0.0
            : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.plot_type_id) {
      setError("Please select a plot type.");
      return;
    }
    if (
      !formData.section ||
      !formData.lot ||
      !formData.plot_number ||
      !formData.dimensions
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-surface-container-lowest p-6 rounded-xl border border-surface-variant soft-loom-shadow"
    >
      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Plot Type */}
        <div>
          <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-2">
            Plot Type *
          </label>
          {loadingTypes ? (
            <div className="h-10 bg-surface-container-low animate-pulse rounded-lg"></div>
          ) : (
            <select
              name="plot_type_id"
              value={formData.plot_type_id}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-surface-container-low border border-surface-variant rounded-lg text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 text-on-surface"
              required
            >
              <option value="" disabled>
                Select a type
              </option>
              {plotTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-2">
            Status *
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-surface-container-low border border-surface-variant rounded-lg text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 text-on-surface"
            required
          >
            <option value="Available">Available</option>
            <option value="Reserved">Reserved</option>
            <option value="Occupied">Occupied</option>
          </select>
        </div>

        {/* Section */}
        <div>
          <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-2">
            Section *
          </label>
          <input
            type="text"
            name="section"
            value={formData.section}
            onChange={handleChange}
            placeholder="e.g. A"
            className="w-full px-4 py-2 bg-surface-container-low border border-surface-variant rounded-lg text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 text-on-surface"
            required
          />
        </div>

        {/* Lot */}
        <div>
          <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-2">
            Lot *
          </label>
          <input
            type="text"
            name="lot"
            value={formData.lot}
            onChange={handleChange}
            placeholder="e.g. 10"
            className="w-full px-4 py-2 bg-surface-container-low border border-surface-variant rounded-lg text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 text-on-surface"
            required
          />
        </div>

        {/* Plot Number */}
        <div>
          <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-2">
            Plot Number *
          </label>
          <input
            type="text"
            name="plot_number"
            value={formData.plot_number}
            onChange={handleChange}
            placeholder="e.g. 01"
            className="w-full px-4 py-2 bg-surface-container-low border border-surface-variant rounded-lg text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 text-on-surface"
            required
          />
        </div>

        {/* Dimensions */}
        <div>
          <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-2">
            Dimensions *
          </label>
          <input
            type="text"
            name="dimensions"
            value={formData.dimensions}
            onChange={handleChange}
            placeholder="e.g. 3ft x 8ft"
            className="w-full px-4 py-2 bg-surface-container-low border border-surface-variant rounded-lg text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 text-on-surface"
            required
          />
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-2">
            Capacity *
          </label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            min="1"
            className="w-full px-4 py-2 bg-surface-container-low border border-surface-variant rounded-lg text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 text-on-surface"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-2">
            Price ($) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-4 py-2 bg-surface-container-low border border-surface-variant rounded-lg text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 text-on-surface"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-surface-variant">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-outline text-outline rounded-lg text-sm font-medium hover:bg-surface-container-low transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary-container transition-colors"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
