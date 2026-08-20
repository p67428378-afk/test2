import React, { useState, useEffect } from "react";
import InspectionScheduleTable from "../components/inspections/InspectionScheduleTable";
import api from "../services/api";

export default function InspectionsPage() {
  const [hives, setHives] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInspectionData();
  }, []);

  const loadInspectionData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [hivesData, inspectionsData] = await Promise.all([
        api.getHives().catch(() => []),
        api.getInspections().catch(() => []),
      ]);
      setHives(hivesData || []);
      setInspections(inspectionsData || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load inspection schedules.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddInspection = async (data) => {
    const created = await api.createInspection(data);
    setInspections((prev) => [created, ...prev]);
    return created;
  };

  const handleUpdateInspection = async (id, data) => {
    const updated = await api.updateInspection(id, data);
    setInspections((prev) => prev.map((i) => (i.id === id ? updated : i)));
    return updated;
  };

  return (
    <div className="space-y-6" data-name="InspectionsPage">
      <div>
        <h1 className="text-2xl font-bold text-[#171c29]">
          📅 Hive Inspection Scheduler & Field Activity Logs
        </h1>
        <p className="text-xs text-[#707a8c] mt-1">
          Schedule field visits for apiarists, log queen status, frame
          configurations, and mark completed inspections.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-[#707a8c]">
          Loading inspection schedule...
        </div>
      ) : (
        <InspectionScheduleTable
          hives={hives}
          inspections={inspections}
          onAddInspection={handleAddInspection}
          onUpdateInspection={handleUpdateInspection}
        />
      )}
    </div>
  );
}
