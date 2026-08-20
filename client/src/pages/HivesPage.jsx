import React, { useState, useEffect } from "react";
import HiveInventoryTable from "../components/hives/HiveInventoryTable";
import api from "../services/api";

export default function HivesPage() {
  const [hives, setHives] = useState([]);
  const [apiaries, setApiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHivesAndApiaries();
  }, []);

  const loadHivesAndApiaries = async () => {
    setLoading(true);
    setError(null);
    try {
      let apData = await api.getApiaries().catch(() => []);
      if (!apData || apData.length === 0) {
        // Create default apiary if none exists
        try {
          const defaultApiary = await api.createApiary({
            name: "Sunny Valley Apiary",
            location: "North Ridge, Plot 4B",
            notes: "Primary apiary station",
          });
          apData = [defaultApiary];
        } catch (e) {
          console.warn("Could not auto-create default apiary:", e);
        }
      }
      setApiaries(apData || []);

      const hiveData = await api.getHives().catch(() => []);
      setHives(hiveData || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load hives inventory data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHive = async (newHiveData) => {
    const created = await api.createHive(newHiveData);
    setHives((prev) => [created, ...prev]);
    return created;
  };

  const handleUpdateHive = async (hiveId, updateData) => {
    const updated = await api.updateHive(hiveId, updateData);
    setHives((prev) => prev.map((h) => (h.id === hiveId ? updated : h)));
    return updated;
  };

  const handleIngestTelemetry = async (telemetryData) => {
    const result = await api.ingestTelemetry(telemetryData);
    // Reload hives to refresh density/population calculations if any
    const updatedHives = await api.getHives().catch(() => hives);
    setHives(updatedHives);
    return result;
  };

  return (
    <div className="space-y-6" data-name="HivesPage">
      <div>
        <h1 className="text-2xl font-bold text-[#171c29]">
          🐝 Hives Inventory & Telemetry Management
        </h1>
        <p className="text-xs text-[#707a8c] mt-1">
          Register new hives, track queen genetics, estimate colony population
          density, and ingest real-time sensor metrics.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-[#707a8c]">
          Loading beehives registry...
        </div>
      ) : (
        <HiveInventoryTable
          hives={hives}
          apiaries={apiaries}
          onCreateHive={handleCreateHive}
          onUpdateHive={handleUpdateHive}
          onIngestTelemetry={handleIngestTelemetry}
        />
      )}
    </div>
  );
}
