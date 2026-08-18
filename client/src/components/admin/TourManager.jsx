import React, { useState } from "react";
import Modal from "../common/Modal";
import { toursAPI } from "../../services/api";
import { Plus, Edit3, Trash2, Clock, AlertCircle } from "lucide-react";

export default function TourManager({ tours = [], onRefresh }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  const handleOpenCreate = () => {
    setEditingTour(null);
    setName("");
    setDescription("");
    setDurationMinutes(60);
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tour) => {
    setEditingTour(tour);
    setName(tour.name || "");
    setDescription(tour.description || "");
    setDurationMinutes(tour.duration_minutes || 60);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      name,
      description,
      duration_minutes: parseInt(durationMinutes, 10),
    };

    setLoading(true);
    try {
      if (editingTour) {
        await toursAPI.updateTour(editingTour.id, payload);
      } else {
        await toursAPI.createTour(payload);
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      const detail = err.response?.data?.detail || "Failed to save tour.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tourId) => {
    if (!window.confirm("Are you sure you want to delete this tour?")) return;

    setDeletingId(tourId);
    setError(null);
    try {
      await toursAPI.deleteTour(tourId);
      onRefresh();
    } catch (err) {
      const detail = err.response?.data?.detail || "Failed to delete tour.";
      setError(detail);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Tour Types Catalog
          </h2>
          <p className="text-xs text-slate-500">
            Create and edit tour templates and durations.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Tour Type</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tours.map((tour) => (
          <div
            key={tour.id}
            className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-900 text-base">
                  {tour.name}
                </h3>
                <span className="text-xs bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {tour.duration_minutes}m
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-4 line-clamp-3">
                {tour.description || "No description provided."}
              </p>
            </div>

            <div className="flex justify-end items-center gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => handleOpenEdit(tour)}
                className="text-xs text-slate-600 hover:text-indigo-600 font-semibold px-2.5 py-1 rounded hover:bg-slate-100 transition-colors flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(tour.id)}
                disabled={deletingId === tour.id}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2.5 py-1 rounded hover:bg-rose-50 transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTour ? "Edit Tour Type" : "Create New Tour Type"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Tour Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Description
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Duration (Minutes)
            </label>
            <input
              type="number"
              min="15"
              step="15"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors"
            >
              {loading
                ? "Saving..."
                : editingTour
                  ? "Update Tour"
                  : "Create Tour"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
