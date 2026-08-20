import React, { useState } from "react";
import { Sprout, Plus, Calendar, Scale, Droplet } from "lucide-react";

export default function LogHarvestForm({
  hives = [],
  harvests = [],
  onAddHarvest,
}) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    hive_id: "",
    harvest_date: new Date().toISOString().split("T")[0],
    quantity_kg: 25.0,
    honey_type: "Wildflower",
    moisture_content_percent: 17.5,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!formData.hive_id) {
      setError("Please select a beehive.");
      return;
    }
    try {
      await onAddHarvest({
        hive_id: formData.hive_id,
        harvest_date: formData.harvest_date,
        quantity_kg: parseFloat(formData.quantity_kg),
        honey_type: formData.honey_type,
        moisture_content_percent: parseFloat(formData.moisture_content_percent),
      });
      setSuccess("Honey extraction harvest logged successfully!");
      setShowModal(false);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to log honey harvest batch.",
      );
    }
  };

  const totalYield = harvests.reduce(
    (acc, curr) => acc + (curr.quantity_kg || 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sprout className="w-6 h-6 text-[#17a34a]" />
            <h2 className="text-lg font-bold text-[#171c29]">
              Honey Extraction & Harvest Logs
            </h2>
          </div>
          <p className="text-xs text-[#707a8c] mt-1">
            Track batch extractions, moisture content, floral origins, and yield
            trends per hive.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-[#707a8c]">Total Recorded Yield</span>
            <p className="text-xl font-extrabold text-[#17a34a]">
              {totalYield.toFixed(1)} kg
            </p>
          </div>
          <button
            onClick={() => {
              if (hives.length > 0 && !formData.hive_id) {
                setFormData((prev) => ({ ...prev, hive_id: hives[0].id }));
              }
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-[#2663eb] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Log Honey Harvest</span>
          </button>
        </div>
      </div>

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {success}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Harvest Batches List Table */}
      <div className="bg-white border border-[#e3e8f0] rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f7fafc] border-b border-[#e3e8f0] text-xs font-semibold text-[#707a8c]">
              <th className="p-4">Harvest Date</th>
              <th className="p-4">Hive</th>
              <th className="p-4">Honey Type</th>
              <th className="p-4">Quantity (kg)</th>
              <th className="p-4">Moisture %</th>
              <th className="p-4">Quality Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e3e8f0] text-sm">
            {harvests.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-[#707a8c]">
                  No harvest records logged yet. Click "Log Honey Harvest" to
                  record an extraction.
                </td>
              </tr>
            ) : (
              harvests.map((h) => {
                const hiveName =
                  hives.find((hv) => hv.id === h.hive_id)?.hive_number ||
                  "Hive Record";
                const moisture = h.moisture_content_percent || 17.5;
                const grade =
                  moisture < 18.0
                    ? "Grade A Premium (< 18%)"
                    : "Standard Grade";

                return (
                  <tr key={h.id} className="hover:bg-[#f7fafc]">
                    <td className="p-4 font-medium text-[#171c29]">
                      {h.harvest_date}
                    </td>
                    <td className="p-4 font-bold text-[#2663eb]">
                      🐝 {hiveName}
                    </td>
                    <td className="p-4 text-[#707a8c]">
                      {h.honey_type || "Wildflower"}
                    </td>
                    <td className="p-4 font-extrabold text-[#17a34a]">
                      {h.quantity_kg} kg
                    </td>
                    <td className="p-4">{moisture}%</td>
                    <td className="p-4">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {grade}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <h3 className="text-lg font-bold text-[#171c29] mb-4">
              Log Honey Extraction Batch
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#707a8c] mb-1">
                  Select Hive
                </label>
                <select
                  value={formData.hive_id}
                  onChange={(e) =>
                    setFormData({ ...formData, hive_id: e.target.value })
                  }
                  className="w-full border border-[#e3e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2663eb]"
                  required
                >
                  <option value="">Select Hive...</option>
                  {hives.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.hive_number} ({h.queen_breed})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#707a8c] mb-1">
                  Harvest Date
                </label>
                <input
                  type="date"
                  value={formData.harvest_date}
                  onChange={(e) =>
                    setFormData({ ...formData, harvest_date: e.target.value })
                  }
                  className="w-full border border-[#e3e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2663eb]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#707a8c] mb-1">
                    Extracted Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.quantity_kg}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity_kg: e.target.value })
                    }
                    className="w-full border border-[#e3e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2663eb]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#707a8c] mb-1">
                    Moisture %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.moisture_content_percent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        moisture_content_percent: e.target.value,
                      })
                    }
                    className="w-full border border-[#e3e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2663eb]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#707a8c] mb-1">
                  Floral Origin / Honey Type
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wildflower, Clover, Acacia"
                  value={formData.honey_type}
                  onChange={(e) =>
                    setFormData({ ...formData, honey_type: e.target.value })
                  }
                  className="w-full border border-[#e3e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2663eb]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#e3e8f0]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#e3e8f0] rounded-lg text-sm text-[#707a8c] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#17a34a] text-white rounded-lg text-sm font-semibold hover:bg-green-700"
                >
                  Save Extraction Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
