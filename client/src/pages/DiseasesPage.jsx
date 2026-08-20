import React, { useState, useEffect } from "react";
import DiseaseReportForm from "../components/diseases/DiseaseReportForm";
import api from "../services/api";

export default function DiseasesPage() {
  const [hives, setHives] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDiseaseData();
  }, []);

  const loadDiseaseData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [hivesData, reportsData] = await Promise.all([
        api.getHives().catch(() => []),
        api.getDiseaseReports().catch(() => []),
      ]);
      setHives(hivesData || []);
      setReports(reportsData || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load disease reports & colony health alerts.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddReport = async (reportData) => {
    const created = await api.createDiseaseReport(reportData);
    setReports((prev) => [created, ...prev]);
    return created;
  };

  return (
    <div className="space-y-6" data-name="DiseasesPage">
      <div>
        <h1 className="text-2xl font-bold text-[#171c29]">
          🛡️ Colony Health & Disease Control Center
        </h1>
        <p className="text-xs text-[#707a8c] mt-1">
          File Varroa mite incident reports, track parasite infestation
          severity, and apply treatment procedures.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-[#707a8c]">
          Loading colony health reports...
        </div>
      ) : (
        <DiseaseReportForm
          hives={hives}
          reports={reports}
          onAddReport={handleAddReport}
        />
      )}
    </div>
  );
}
