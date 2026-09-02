import React, { useState, useEffect } from "react";
import { FlaskConical, Search, RefreshCw } from "lucide-react";
import LabRequestForm from "../components/lab/LabRequestForm";
import LabWorkflowTable from "../components/lab/LabWorkflowTable";
import {
  getLabAnalyses,
  createLabAnalysis,
  updateLabAnalysis,
  deleteLabAnalysis,
  getArtifacts,
} from "../services/api";

export default function LabAnalysisPage() {
  const [analyses, setAnalyses] = useState([]);
  const [artifacts, setArtifacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const fetchArtifactsList = async () => {
    try {
      const data = await getArtifacts({ limit: 100 });
      setArtifacts(data.items || []);
    } catch (err) {
      console.error("Error fetching artifacts for lab requests:", err);
    }
  };

  const fetchAnalysesList = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.test_type = typeFilter;

      const data = await getLabAnalyses(params);
      setAnalyses(data.items || []);
    } catch (err) {
      console.error("Failed to fetch lab analyses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtifactsList();
  }, []);

  useEffect(() => {
    fetchAnalysesList();
  }, [statusFilter, typeFilter]);

  const handleCreateRequest = async (payload) => {
    await createLabAnalysis(payload);
    await fetchAnalysesList();
  };

  const handleUpdateStatus = async (analysisId, updateData) => {
    try {
      await updateLabAnalysis(analysisId, updateData);
      await fetchAnalysesList();
    } catch (err) {
      console.error("Failed to update analysis status:", err);
      alert("Failed to update lab analysis status.");
    }
  };

  const handleDeleteAnalysis = async (analysisId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this lab analysis request?",
      )
    ) {
      try {
        await deleteLabAnalysis(analysisId);
        await fetchAnalysesList();
      } catch (err) {
        console.error("Failed to delete analysis:", err);
        alert("Failed to delete lab analysis request.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-lg border border-stone-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 flex items-center space-x-2 font-display">
            <FlaskConical className="w-6 h-6 text-amber-800" />
            <span>Laboratory Analysis Tracking</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Submit lab testing requests (Radiocarbon C-14, XRF Spectrometry,
            Petrographic Analysis) and manage status workflow (Pending &rarr;
            In-Progress &rarr; Completed).
          </p>
        </div>

        <button
          onClick={fetchAnalysesList}
          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-medium flex items-center space-x-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-5">
          <LabRequestForm
            artifacts={artifacts}
            onLabRequestCreated={handleCreateRequest}
          />
        </div>

        {/* Workflow Table Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Lab Request Board ({analyses.length})
            </span>

            <div className="flex space-x-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 border border-stone-300 rounded text-xs bg-white text-stone-700"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-2.5 py-1.5 border border-stone-300 rounded text-xs bg-white text-stone-700"
              >
                <option value="">All Test Types</option>
                <option value="Radiocarbon C-14">Radiocarbon C-14</option>
                <option value="XRF Spectrometry">XRF Spectrometry</option>
                <option value="Petrographic Analysis">
                  Petrographic Analysis
                </option>
              </select>
            </div>
          </div>

          <LabWorkflowTable
            analyses={analyses}
            loading={loading}
            onUpdateStatus={handleUpdateStatus}
            onDeleteAnalysis={handleDeleteAnalysis}
          />
        </div>
      </div>
    </div>
  );
}
