import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { createSpecies } from "../../services/api";

export default function AddCustomSpeciesModal({ onClose, onSuccess }) {
  const [commonName, setCommonName] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [sunlight, setSunlight] = useState("Bright Indirect Light");
  const [humidity, setHumidity] = useState("Medium to High (50-60%)");
  const [recommendedWateringDays, setRecommendedWateringDays] = useState(7);
  const [description, setDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!commonName.trim()) {
      setErrorMsg("Common species name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        common_name: commonName.trim(),
        scientific_name: scientificName.trim() || null,
        sunlight_requirement: sunlight,
        humidity_requirement: humidity,
        recommended_watering_days: parseInt(recommendedWateringDays, 10) || 7,
        description: description.trim() || null,
      };

      await createSpecies(payload);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(
        err.response?.data?.detail || "Failed to create custom species entry.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-900 text-lg">
            Add Custom Species to Catalog
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div
              role="alert"
              className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center space-x-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Common Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder='e.g., "Monstera Deliciosa" or "Snake Plant"'
              value={commonName}
              onChange={(e) => setCommonName(e.target.value)}
              required
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1C8A5C]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Scientific Name (Optional)
            </label>
            <input
              type="text"
              placeholder='e.g., "Sansevieria trifasciata"'
              value={scientificName}
              onChange={(e) => setScientificName(e.target.value)}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1C8A5C]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Sunlight Need
              </label>
              <select
                value={sunlight}
                onChange={(e) => setSunlight(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C8A5C]"
              >
                <option value="Direct Sunlight">Direct Sunlight</option>
                <option value="Bright Indirect Light">
                  Bright Indirect Light
                </option>
                <option value="Medium Indirect Light">
                  Medium Indirect Light
                </option>
                <option value="Low Light / Shade">Low Light / Shade</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Water Frequency (Days)
              </label>
              <input
                type="number"
                min="1"
                max="90"
                value={recommendedWateringDays}
                onChange={(e) => setRecommendedWateringDays(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1C8A5C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Humidity Requirement
            </label>
            <input
              type="text"
              placeholder='e.g., "High humidity (60%+)" or "Low / Moderate"'
              value={humidity}
              onChange={(e) => setHumidity(e.target.value)}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1C8A5C]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Care Notes & Guidelines
            </label>
            <textarea
              rows="3"
              placeholder="Enter special care instructions, soil recommendations, or watering tips..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1C8A5C]"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#1C8A5C] text-white rounded-lg text-xs font-semibold hover:bg-[#0F4E34] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Registering..." : "Register Species"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
