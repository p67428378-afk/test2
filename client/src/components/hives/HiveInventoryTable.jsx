import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  Radio,
} from "lucide-react";

export default function HiveInventoryTable({
  hives = [],
  apiaries = [],
  onCreateHive,
  onUpdateHive,
  onIngestTelemetry,
}) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTelemetryModal, setShowTelemetryModal] = useState(false);
  const [selectedHive, setSelectedHive] = useState(null);

  // New Hive form state
  const [newHive, setNewHive] = useState({
    apiary_id: "",
    hive_number: "",
    queen_breed: "Italian Honeybee",
    status: "active",
    estimated_population: 45000,
    frame_count: 10,
  });

  // Telemetry form state
  const [telemetry, setTelemetry] = useState({
    temperature_celsius: 35.0,
    humidity_percent: 60.0,
    weight_kg: 42.0,
  });

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const filteredHives = hives.filter((h) => {
    const matchesSearch =
      h.hive_number?.toLowerCase().includes(search.toLowerCase()) ||
      h.queen_breed?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || h.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    if (!newHive.apiary_id || !newHive.hive_number) {
      setFormError("Please select an apiary and provide a hive number.");
      return;
    }
    try {
      await onCreateHive(newHive);
      setFormSuccess("Hive registered successfully!");
      setShowAddModal(false);
      setNewHive({
        apiary_id: apiaries[0]?.id || "",
        hive_number: "",
        queen_breed: "Italian Honeybee",
        status: "active",
        estimated_population: 45000,
        frame_count: 10,
      });
    } catch (err) {
      setFormError(err.response?.data?.detail || "Failed to register hive.");
    }
  };

  const handleTelemetrySubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    if (!selectedHive) return;
    try {
      await onIngestTelemetry({
        hive_id: selectedHive.id,
        temperature_celsius: parseFloat(telemetry.temperature_celsius),
        humidity_percent: parseFloat(telemetry.humidity_percent),
        weight_kg: parseFloat(telemetry.weight_kg),
      });
      setFormSuccess("Telemetry ingested successfully!");
      setShowTelemetryModal(false);
    } catch (err) {
      setFormError(err.response?.data?.detail || "Failed to record telemetry.");
    }
  };

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl shadow-sm overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-5 border-b border-[#e3e8f0] flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#707a8c]" />
            <input
              type="text"
              placeholder="Search hive or queen breed..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-[#e3e8f0] rounded-lg text-sm focus:outline-none focus:border-[#2663eb]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#707a8c]" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-[#e3e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2663eb]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="quarantine">Quarantine</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => {
            if (apiaries.length > 0 && !newHive.apiary_id) {
              setNewHive((prev) => ({ ...prev, apiary_id: apiaries[0].id }));
            }
            setShowAddModal(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#2663eb] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Hive</span>
        </button>
      </div>

      {formSuccess && (
        <div className="mx-5 mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {formSuccess}
        </div>
      )}
      {formError && (
        <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {formError}
        </div>
      )}

      {/* Hives Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f7fafc] border-b border-[#e3e8f0] text-xs font-semibold text-[#707a8c]">
              <th className="p-4">Hive Number</th>
              <th className="p-4">Apiary</th>
              <th className="p-4">Queen Breed</th>
              <th className="p-4">Population</th>
              <th className="p-4">Density</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e3e8f0] text-sm">
            {filteredHives.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-[#707a8c]">
                  No beehives found. Click "Register New Hive" to add one.
                </td>
              </tr>
            ) : (
              filteredHives.map((hive) => {
                const apiaryName =
                  apiaries.find((a) => a.id === hive.apiary_id)?.name ||
                  "Default Apiary";
                return (
                  <tr
                    key={hive.id}
                    className="hover:bg-[#f7fafc] transition-colors"
                  >
                    <td className="p-4 font-bold text-[#171c29]">
                      🐝 {hive.hive_number}
                    </td>
                    <td className="p-4 text-[#707a8c]">{apiaryName}</td>
                    <td className="p-4 font-medium">
                      {hive.queen_breed || "N/A"}
                    </td>
                    <td className="p-4 text-[#171c29]">
                      {hive.estimated_population?.toLocaleString() || 0} bees
                    </td>
                    <td className="p-4">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {hive.density_bees_per_frame ||
                          Math.round(
                            (hive.estimated_population || 0) /
                              (hive.frame_count || 10),
                          )}{" "}
                        bees/frame ({hive.density_status || "Optimal"})
                      </span>
                    </td>
                    <td className="p-4">
                      {hive.status === "active" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                          <ShieldCheck className="w-3 h-3" /> Active
                        </span>
                      ) : hive.status === "quarantine" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertTriangle className="w-3 h-3" /> Quarantine
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedHive(hive);
                          setShowTelemetryModal(true);
                        }}
                        className="text-xs bg-[#2663eb] text-white px-3 py-1.5 rounded-md hover:bg-blue-700 font-medium transition-colors"
                      >
                        + Telemetry
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Hive Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <h3 className="text-lg font-bold text-[#171c29] mb-4">
              Register New Beehive
            </h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#707a8c] mb-1">
                  Apiary Location
                </label>
                <select
                  value={newHive.apiary_id}
                  onChange={(e) =>
                    setNewHive({ ...newHive, apiary_id: e.target.value })
                  }
                  className="w-full border border-[#e3e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2663eb]"
                  required
                >
                  <option value="">Select Apiary...</option>
                  {apiaries.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#707a8c] mb-1">
                  Hive Number / ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. HIVE-05"
                  value={newHive.hive_number}
                  onChange={(e) =>
                    setNewHive({ ...newHive, hive_number: e.target.value })
                  }
                  className="w-full border border-[#e3e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2663eb]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#707a8c] mb-1">
                    Queen Breed
                  </label>
                  <input
                    type="text"
                    value={newHive.queen_breed}
                    onChange={(e) =>
                      setNewHive({ ...newHive, queen_breed: e.target.value })
                    }
                    className="w-full border border-[#e3e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2663eb]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#707a8c] mb-1">
                    Status
                  </label>
                  <select
                    value={newHive.status}
                    onChange={(e) =>
                      setNewHive({ ...newHive, status: e.target.value })
                    }
                    className="w-full border border-[#e3e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2663eb]"
                  >
                    <option value="active">Active</option>
                    <option value="quarantine">Quarantine</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#707a8c] mb-1">
                    Bee Population
                  </label>
                  <input
                    type="number"
                    value={newHive.estimated_population}
                    onChange={(e) =>
                      setNewHive({
                        ...newHive,
                        estimated_population: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-[#e3e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2663eb]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#707a8c] mb-1">
                    Frame Count
                  </label>
                  <input
                    type="number"
                    value={newHive.frame_count}
                    onChange={(e) =>
                      setNewHive({
                        ...newHive,
                        frame_count: parseInt(e.target.value) || 10,
                      })
                    }
                    className="w-full border border-[#e3e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2663eb]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#e3e8f0]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#e3e8f0] rounded-lg text-sm text-[#707a8c] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2663eb] text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                >
                  Save Hive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Telemetry Ingest Modal */}
      {showTelemetryModal && selectedHive && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <h3 className="text-lg font-bold text-[#171c29] mb-1">
              Log Real-Time Sensor Telemetry
            </h3>
            <p className="text-xs text-[#707a8c] mb-4">
              Hive:{" "}
              <span className="font-bold text-[#171c29]">
                {selectedHive.hive_number}
              </span>
            </p>

            <form onSubmit={handleTelemetrySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#707a8c] mb-1">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={telemetry.temperature_celsius}
                  onChange={(e) =>
                    setTelemetry({
                      ...telemetry,
                      temperature_celsius: e.target.value,
                    })
                  }
                  className="w-full border border-[#e3e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2663eb]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#707a8c] mb-1">
                  Humidity (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={telemetry.humidity_percent}
                  onChange={(e) =>
                    setTelemetry({
                      ...telemetry,
                      humidity_percent: e.target.value,
                    })
                  }
                  className="w-full border border-[#e3e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2663eb]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#707a8c] mb-1">
                  Hive Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={telemetry.weight_kg}
                  onChange={(e) =>
                    setTelemetry({ ...telemetry, weight_kg: e.target.value })
                  }
                  className="w-full border border-[#e3e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2663eb]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#e3e8f0]">
                <button
                  type="button"
                  onClick={() => setShowTelemetryModal(false)}
                  className="px-4 py-2 border border-[#e3e8f0] rounded-lg text-sm text-[#707a8c] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2663eb] text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                >
                  Submit Sensor Reading
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
