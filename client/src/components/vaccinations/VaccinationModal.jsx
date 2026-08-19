import React, { useState } from "react";
import { X, Save, Syringe } from "lucide-react";

export default function VaccinationModal({
  isOpen,
  onClose,
  onSubmit,
  pets = [],
}) {
  const [formData, setFormData] = useState({
    pet_id: pets[0]?.id || "",
    vaccine_name: "",
    administered_date: "",
    next_due_date: "",
    status: "UP_TO_DATE",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.pet_id || !formData.vaccine_name) {
      setError("Pet selection and vaccine name are required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = {
        pet_id: formData.pet_id,
        vaccine_name: formData.vaccine_name,
        administered_date: formData.administered_date
          ? new Date(formData.administered_date).toISOString()
          : new Date().toISOString(),
        next_due_date: formData.next_due_date
          ? new Date(formData.next_due_date).toISOString()
          : null,
        status: formData.status,
      };
      await onSubmit(payload);
      setFormData({
        pet_id: pets[0]?.id || "",
        vaccine_name: "",
        administered_date: "",
        next_due_date: "",
        status: "UP_TO_DATE",
      });
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to record vaccination",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Syringe className="h-5 w-5 text-blue-600" />
            <span>Record Vaccination</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Select Pet *
            </label>
            <select
              required
              value={formData.pet_id}
              onChange={(e) =>
                setFormData({ ...formData, pet_id: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {pets.length === 0 ? (
                <option value="">No pets available</option>
              ) : (
                pets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.species})
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Vaccine Name *
            </label>
            <input
              type="text"
              required
              value={formData.vaccine_name}
              onChange={(e) =>
                setFormData({ ...formData, vaccine_name: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Rabies 3-Year / DHPP"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Administered Date
              </label>
              <input
                type="date"
                value={formData.administered_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    administered_date: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Next Due Date
              </label>
              <input
                type="date"
                value={formData.next_due_date}
                onChange={(e) =>
                  setFormData({ ...formData, next_due_date: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? "Saving..." : "Record Vaccine"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
