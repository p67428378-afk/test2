import React, { useState, useEffect } from "react";
import AppLayout from "../components/layout/AppLayout.jsx";
import PlotTable from "../components/plots/PlotTable.jsx";
import PlotForm from "../components/plots/PlotForm.jsx";
import { plotService, plotTypeService } from "../services/api";

export default function PlotInventoryPage() {
  const [plots, setPlots] = useState([]);
  const [plotTypes, setPlotTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Filters
  const [filters, setFilters] = useState({
    plot_type_id: "",
    status: "",
    section: "",
    lot: "",
    plot_number: "",
  });

  // Search query
  const [searchQuery, setSearchQuery] = useState("");

  // Editing state
  const [editingPlot, setEditingPlot] = useState(null);

  const fetchPlots = async () => {
    setLoading(true);
    try {
      const data = await plotService.getPlots(filters);
      setPlots(data);
    } catch (err) {
      setError("Failed to load plots.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlots();
  }, [filters]);

  useEffect(() => {
    async function fetchTypes() {
      try {
        const types = await plotTypeService.getPlotTypes();
        setPlotTypes(types);
      } catch (err) {
        setError("Failed to load plot types.");
      }
    }
    fetchTypes();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (plot) => {
    setEditingPlot(plot);
  };

  const handleDelete = async (plotId) => {
    if (window.confirm("Are you sure you want to delete this plot?")) {
      try {
        await plotService.deletePlot(plotId);
        setSuccess("Plot deleted successfully.");
        fetchPlots();
      } catch (err) {
        setError("Failed to delete plot.");
      }
    }
  };

  const handleUpdateSubmit = async (formData) => {
    try {
      await plotService.updatePlot(editingPlot.id, formData);
      setSuccess("Plot updated successfully.");
      setEditingPlot(null);
      fetchPlots();
    } catch (err) {
      setError("Failed to update plot.");
    }
  };

  // Filter plots locally by search query (Plot ID or Location)
  const filteredPlots = plots.filter((plot) => {
    const query = searchQuery.toLowerCase();
    return (
      plot.plot_id?.toLowerCase().includes(query) ||
      plot.section?.toLowerCase().includes(query) ||
      plot.lot?.toLowerCase().includes(query) ||
      plot.plot_number?.toLowerCase().includes(query)
    );
  });

  return (
    <AppLayout
      title="Plot Inventory"
      onSearchChange={setSearchQuery}
      searchValue={searchQuery}
    >
      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded-lg text-sm font-medium">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-secondary-container text-on-secondary-container rounded-lg text-sm font-medium">
          {success}
        </div>
      )}

      {editingPlot ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-on-surface">
              Edit Plot: {editingPlot.plot_id}
            </h2>
            <button
              onClick={() => setEditingPlot(null)}
              className="text-xs font-semibold text-outline uppercase tracking-wider hover:text-on-surface transition-colors"
            >
              Back to List
            </button>
          </div>
          <PlotForm
            initialData={editingPlot}
            onSubmit={handleUpdateSubmit}
            onCancel={() => setEditingPlot(null)}
            submitLabel="Update Plot"
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-variant soft-loom-shadow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {/* Plot Type Filter */}
            <div>
              <label className="block text-[10px] font-semibold text-outline uppercase tracking-wider mb-1">
                Plot Type
              </label>
              <select
                name="plot_type_id"
                value={filters.plot_type_id}
                onChange={handleFilterChange}
                className="w-full px-3 py-1.5 bg-surface-container-low border border-surface-variant rounded-lg text-xs focus:outline-none focus:border-primary-container text-on-surface"
              >
                <option value="">All Types</option>
                {plotTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[10px] font-semibold text-outline uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-3 py-1.5 bg-surface-container-low border border-surface-variant rounded-lg text-xs focus:outline-none focus:border-primary-container text-on-surface"
              >
                <option value="">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Occupied">Occupied</option>
              </select>
            </div>

            {/* Section Filter */}
            <div>
              <label className="block text-[10px] font-semibold text-outline uppercase tracking-wider mb-1">
                Section
              </label>
              <input
                type="text"
                name="section"
                value={filters.section}
                onChange={handleFilterChange}
                placeholder="e.g. A"
                className="w-full px-3 py-1.5 bg-surface-container-low border border-surface-variant rounded-lg text-xs focus:outline-none focus:border-primary-container text-on-surface"
              />
            </div>

            {/* Lot Filter */}
            <div>
              <label className="block text-[10px] font-semibold text-outline uppercase tracking-wider mb-1">
                Lot
              </label>
              <input
                type="text"
                name="lot"
                value={filters.lot}
                onChange={handleFilterChange}
                placeholder="e.g. 10"
                className="w-full px-3 py-1.5 bg-surface-container-low border border-surface-variant rounded-lg text-xs focus:outline-none focus:border-primary-container text-on-surface"
              />
            </div>

            {/* Plot Number Filter */}
            <div>
              <label className="block text-[10px] font-semibold text-outline uppercase tracking-wider mb-1">
                Plot Number
              </label>
              <input
                type="text"
                name="plot_number"
                value={filters.plot_number}
                onChange={handleFilterChange}
                placeholder="e.g. 01"
                className="w-full px-3 py-1.5 bg-surface-container-low border border-surface-variant rounded-lg text-xs focus:outline-none focus:border-primary-container text-on-surface"
              />
            </div>
          </div>

          {/* Plot Table */}
          <PlotTable
            plots={filteredPlots}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>
      )}
    </AppLayout>
  );
}
