import React, { useState } from "react";
import {
  Droplet,
  MapPin,
  Calendar,
  Bell,
  BellOff,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function PlantCard({
  plant,
  onWater,
  onEdit,
  onDelete,
  onToggleNotifications,
}) {
  const [isWatering, setIsWatering] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const formatDate = (dateStr) => {
    if (!dateStr) return "Never";
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const handleWater = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setIsWatering(true);
    try {
      await onWater(plant.id);
      setSuccessMsg("Watered!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || "Failed to water.");
    } finally {
      setIsWatering(false);
    }
  };

  const isOverdue =
    plant.next_due_date && new Date(plant.next_due_date) < new Date();

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
      <div>
        <div className="relative h-44 bg-emerald-50/50 overflow-hidden flex items-center justify-center border-b border-gray-100">
          {plant.photo_url ? (
            <img
              src={plant.photo_url}
              alt={plant.nickname}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-5xl">🪴</div>
          )}
          <span
            className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full shadow-sm ${
              isOverdue
                ? "bg-red-500 text-white"
                : "bg-white/90 text-[#1C8A5C] backdrop-blur-sm"
            }`}
          >
            {isOverdue
              ? "Overdue"
              : `Every ${plant.watering_interval_days || 7}d`}
          </span>

          <button
            onClick={() =>
              onToggleNotifications && onToggleNotifications(plant)
            }
            className="absolute top-3 left-3 p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-[#1C8A5C] transition-colors shadow-sm"
            title={
              plant.notifications_enabled
                ? "Notifications Enabled"
                : "Notifications Disabled"
            }
          >
            {plant.notifications_enabled ? (
              <Bell className="w-4 h-4 text-[#1C8A5C]" />
            ) : (
              <BellOff className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-gray-900 text-base leading-snug">
                {plant.nickname}
              </h3>
              <p className="text-xs text-gray-500 italic mt-0.5">
                {plant.species?.common_name ||
                  plant.species_name ||
                  "Custom Species"}
              </p>
            </div>
            <span className="flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
              <MapPin className="w-3 h-3 text-gray-400 mr-1" />
              {plant.location || "Indoor"}
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-semibold">
                Last Watered
              </span>
              <span className="font-medium text-gray-800">
                {formatDate(plant.last_watered)}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-semibold">
                Next Due
              </span>
              <span
                className={`font-semibold ${isOverdue ? "text-red-600" : "text-gray-800"}`}
              >
                {formatDate(plant.next_due_date)}
              </span>
            </div>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="mt-2 text-xs text-red-600 flex items-center space-x-1 bg-red-50 p-1.5 rounded border border-red-200"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mt-2 text-xs text-green-700 flex items-center space-x-1 bg-green-50 p-1.5 rounded border border-green-200">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-3 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(plant)}
              className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-white rounded transition-colors"
              title="Edit Plant"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(plant.id)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded transition-colors"
              title="Remove Plant"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={handleWater}
          disabled={isWatering}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#1C8A5C] text-white rounded-lg text-xs font-semibold hover:bg-[#0F4E34] transition-colors disabled:opacity-50"
        >
          <Droplet className="w-3.5 h-3.5 fill-current" />
          <span>{isWatering ? "Logging..." : "Water Plant"}</span>
        </button>
      </div>
    </div>
  );
}
