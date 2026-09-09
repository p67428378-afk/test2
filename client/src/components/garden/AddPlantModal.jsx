import React, { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import {
  createUserPlant,
  updateUserPlant,
  getSpeciesList,
} from "../../services/api";

export default function AddPlantModal({
  plantToEdit = null,
  onClose,
  onSuccess,
}) {
  const [nickname, setNickname] = useState(plantToEdit?.nickname || "");
  const [speciesId, setSpeciesId] = useState(plantToEdit?.species_id || "");
  const [location, setLocation] = useState(
    plantToEdit?.location || "Living Room",
  );
  const [photoUrl, setPhotoUrl] = useState(plantToEdit?.photo_url || "");
  const [wateringIntervalDays, setWateringIntervalDays] = useState(
    plantToEdit?.watering_interval_days || 7,
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    plantToEdit?.notifications_enabled ?? true,
  );

  const [speciesList, setSpeciesList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadSpecies() {
      try {
        const data = await getSpeciesList();
        setSpeciesList(data || []);
      } catch (err) {
        console.error("Failed to load species options:", err);
      }
    }
    loadSpecies();
  }, []);

  const handleSpeciesChange = (e) => {
    const selectedId = e.target.value;
    setSpeciesId(selectedId);
    const matched = speciesList.find((s) => s.id === selectedId);
    if (matched && matched.recommended_watering_days) {
      setWateringIntervalDays(matched.recommended_watering_days);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!nickname.trim()) {
      setErrorMsg("Plant nickname is required.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      nickname: nickname.trim(),
      species_id: speciesId || null,
      location: location.trim() || "Living Room",
      photo_url: photoUrl.trim() || null,
      watering_interval_days: parseInt(wateringIntervalDays, 10) || 7,
      notifications_enabled: notificationsEnabled,
    };

    try {
      if (plantToEdit) {
        await updateUserPlant(plantToEdit.id, payload);
      } else {
        await createUserPlant(payload);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(
        err.response?.data?.detail ||
          "Failed to save plant details. Please check inputs.",
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
            {plantToEdit ? "Edit Plant" : "Add Plant to My Garden"}
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
              Plant Nickname <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder='e.g., "Fernie" or "Sunny Monster"'
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1C8A5C]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Species Selection
            </label>
            <select
              value={speciesId}
              onChange={handleSpeciesChange}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C8A5C]"
            >
              <option value="">Select or leave blank for Custom/Unknown</option>
              {speciesList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.common_name} ({s.scientific_name || "Species"}) -{" "}
                  {s.recommended_watering_days || 7}d schedule
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Room / Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C8A5C]"
              >
                <option value="Living Room">Living Room</option>
                <option value="Sunroom">Sunroom</option>
                <option value="Office">Office</option>
                <option value="Bedroom">Bedroom</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Balcony">Balcony</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Watering Cycle (Days)
              </label>
              <input
                type="number"
                min="1"
                max="90"
                value={wateringIntervalDays}
                onChange={(e) => setWateringIntervalDays(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1C8A5C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Photo URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1C8A5C]"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="notifications"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-4 h-4 text-[#1C8A5C] rounded border-gray-300 focus:ring-[#1C8A5C]"
            />
            <label
              htmlFor="notifications"
              className="text-xs text-gray-700 font-medium cursor-pointer"
            >
              Enable watering schedule reminders and dashboard alerts
            </label>
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
              {isSubmitting
                ? "Saving..."
                : plantToEdit
                  ? "Update Plant"
                  : "Add to My Garden"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
