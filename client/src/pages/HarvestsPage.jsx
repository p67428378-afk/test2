import React, { useState, useEffect } from "react";
import LogHarvestForm from "../components/harvests/LogHarvestForm";
import api from "../services/api";

export default function HarvestsPage() {
  const [hives, setHives] = useState([]);
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHarvestsData();
  }, []);

  const loadHarvestsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [hivesData, harvestsData] = await Promise.all([
        api.getHives().catch(() => []),
        api.getHarvests().catch(() => []),
      ]);
      setHives(hivesData || []);
      setHarvests(harvestsData || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load honey production records.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddHarvest = async (harvestData) => {
    const created = await api.createHarvest(harvestData);
    setHarvests((prev) => [created, ...prev]);
    return created;
  };

  return (
    <div className="space-y-6" data-name="HarvestsPage">
      <div>
        <h1 className="text-2xl font-bold text-[#171c29]">
          🍯 Honey Harvest & Production Yield Tracker
        </h1>
        <p className="text-xs text-[#707a8c] mt-1">
          Log extraction batch weights, floral origins, and verify moisture
          percentages for honey quality grading.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-[#707a8c]">
          Loading harvest extraction logs...
        </div>
      ) : (
        <LogHarvestForm
          hives={hives}
          harvests={harvests}
          onAddHarvest={handleAddHarvest}
        />
      )}
    </div>
  );
}
