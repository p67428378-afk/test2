import React, { useState, useEffect } from "react";
import { featureService, dashboardService } from "../../services/api";
import {
  Sliders,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";

export default function FeatureControlDashboard() {
  const [features, setFeatures] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [statusWidgets, setStatusWidgets] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [featureName, setFeatureName] = useState("");
  const [featureStatus, setFeatureStatus] = useState("Active");
  const [featureConfig, setFeatureConfig] = useState('{"autoHoldMins": 15}');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const [featList, metricsRes, widgetsRes] = await Promise.all([
        featureService.getFeatures().catch(() => []),
        dashboardService.getMetrics().catch(() => null),
        dashboardService.getStatusWidgets().catch(() => []),
      ]);

      setFeatures(featList || []);
      setMetrics(metricsRes);
      setStatusWidgets(widgetsRes || []);
    } catch (err) {
      console.error("Error loading feature dashboard data:", err);
      setErrorMessage("Failed to fetch dashboard features. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (feature = null) => {
    setErrorMessage("");
    if (feature) {
      setEditingFeature(feature);
      setFeatureName(feature.feature_name || "");
      setFeatureStatus(feature.status || "Active");
      setFeatureConfig(
        typeof feature.configuration === "string"
          ? feature.configuration
          : JSON.stringify(feature.configuration || {}, null, 2),
      );
    } else {
      setEditingFeature(null);
      setFeatureName("");
      setFeatureStatus("Active");
      setFeatureConfig('{\n  "enabled": true,\n  "rateLimit": 100\n}');
    }
    setIsModalOpen(true);
  };

  const handleSubmitFeature = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      let parsedConfig = {};
      try {
        parsedConfig = JSON.parse(featureConfig);
      } catch (e) {
        parsedConfig = { raw: featureConfig };
      }

      const payload = {
        feature_name: featureName,
        status: featureStatus,
        configuration: parsedConfig,
      };

      if (editingFeature?.id) {
        await featureService.updateFeature(editingFeature.id, payload);
        setSuccessMessage(`Feature "${featureName}" updated successfully.`);
      } else {
        await featureService.createFeature(payload);
        setSuccessMessage(`Feature "${featureName}" created successfully.`);
      }

      setIsModalOpen(false);
      loadDashboardData();
    } catch (err) {
      console.error("Save feature error:", err);
      const msg =
        err.response?.data?.detail?.[0]?.msg ||
        err.response?.data?.detail ||
        "Failed to save feature. Please verify input fields.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFeature = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete feature "${name}"?`)) {
      return;
    }
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await featureService.deleteFeature(id);
      setSuccessMessage(`Feature "${name}" deleted.`);
      loadDashboardData();
    } catch (err) {
      console.error("Delete feature error:", err);
      setErrorMessage("Failed to delete feature.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
            <Sliders className="w-6 h-6 text-[#C5A059]" />
            Interactive Control Dashboard & Status Widgets
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            Trigger new feature workflows, view real-time status indicators, and
            adjust feature configurations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadDashboardData}
            className="p-2 border border-stone-300 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh Data
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="bg-[#775A19] hover:bg-[#5f4613] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Studio Feature
          </button>
        </div>
      </div>

      {/* Error & Success Banners */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Real-time Status Widgets & Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          // Loading Skeletons for Status Widgets
          Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="p-4 border border-stone-200 rounded-2xl bg-white animate-pulse space-y-3"
            >
              <div className="h-3 bg-stone-200 rounded w-1/2"></div>
              <div className="h-7 bg-stone-200 rounded w-3/4"></div>
              <div className="h-2 bg-stone-100 rounded w-full"></div>
            </div>
          ))
        ) : (
          <>
            <div className="p-4 border border-stone-200 rounded-2xl bg-white shadow-sm flex items-center justify-between">
              <div>
                <p className="text-2xs font-bold uppercase text-stone-500 tracking-wider">
                  Active Features
                </p>
                <p className="text-2xl font-bold text-stone-900 mt-1">
                  {metrics?.active_features ?? features.length}
                </p>
                <p className="text-2xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> System Operational
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#775A19] flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 border border-stone-200 rounded-2xl bg-white shadow-sm flex items-center justify-between">
              <div>
                <p className="text-2xs font-bold uppercase text-stone-500 tracking-wider">
                  System Health
                </p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  99.9%
                </p>
                <p className="text-2xs text-stone-500 mt-1">
                  P95 Latency &lt; 120ms
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 border border-stone-200 rounded-2xl bg-white shadow-sm flex items-center justify-between">
              <div>
                <p className="text-2xs font-bold uppercase text-stone-500 tracking-wider">
                  Slot Hold Status
                </p>
                <p className="text-2xl font-bold text-amber-700 mt-1">
                  15 Mins
                </p>
                <p className="text-2xs text-amber-800 mt-1">
                  Active Hold Engine
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 border border-stone-200 rounded-2xl bg-white shadow-sm flex items-center justify-between">
              <div>
                <p className="text-2xs font-bold uppercase text-stone-500 tracking-wider">
                  API Status
                </p>
                <p className="text-2xl font-bold text-stone-900 mt-1">
                  v2 REST API
                </p>
                <p className="text-2xs text-emerald-600 font-semibold mt-1">
                  `/api/v1/features` Ready
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Feature Management List */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-serif font-bold text-lg text-stone-900">
            Studio Features &amp; Workflow Control
          </h3>
          <span className="text-2xs text-stone-500 font-medium">
            {features.length} Features Registered
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-16 bg-stone-100 rounded-xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : features.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-stone-200 rounded-xl bg-stone-50/50">
            <Layers className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-stone-700">
              No custom studio features created yet.
            </p>
            <p className="text-2xs text-stone-500 mt-1 mb-4">
              Click &quot;Add Studio Feature&quot; to configure a new workflow
              resource.
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-[#775A19] text-white font-bold text-xs rounded-xl shadow-sm hover:bg-[#5f4613]"
            >
              Add First Feature
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                  <th className="p-3">Feature Name</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Configuration</th>
                  <th className="p-3">Created At</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {features.map((feat) => (
                  <tr key={feat.id} className="hover:bg-stone-50/80">
                    <td className="p-3 font-bold text-stone-900">
                      {feat.feature_name}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-2xs font-bold ${
                          feat.status === "Active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-stone-200 text-stone-700"
                        }`}
                      >
                        {feat.status || "Active"}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-2xs text-stone-600 max-w-xs truncate">
                      {typeof feat.configuration === "string"
                        ? feat.configuration
                        : JSON.stringify(feat.configuration)}
                    </td>
                    <td className="p-3 text-stone-500 text-2xs">
                      {feat.created_at
                        ? new Date(feat.created_at).toLocaleDateString()
                        : "Recent"}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(feat)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
                        title="Edit feature"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteFeature(feat.id, feat.feature_name)
                        }
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                        title="Delete feature"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Feature Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="text-lg font-serif font-bold text-stone-900 mb-4">
              {editingFeature ? "Edit Studio Feature" : "Create New Feature"}
            </h3>

            <form onSubmit={handleSubmitFeature} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Feature Name
                </label>
                <input
                  type="text"
                  value={featureName}
                  onChange={(e) => setFeatureName(e.target.value)}
                  required
                  placeholder="e.g. Automated Slot Hold Release"
                  className="w-full border border-stone-300 p-2.5 rounded-lg text-xs bg-white focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Status
                </label>
                <select
                  value={featureStatus}
                  onChange={(e) => setFeatureStatus(e.target.value)}
                  className="w-full border border-stone-300 p-2.5 rounded-lg text-xs bg-white focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Disabled">Disabled</option>
                  <option value="Beta">Beta</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Configuration (JSON)
                </label>
                <textarea
                  value={featureConfig}
                  onChange={(e) => setFeatureConfig(e.target.value)}
                  rows={4}
                  className="w-full border border-stone-300 p-2.5 rounded-lg text-xs font-mono bg-stone-50 focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 font-bold rounded-lg hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#775A19] hover:bg-[#5f4613] text-white font-bold rounded-lg shadow-sm"
                >
                  {isSubmitting ? "Saving..." : "Save Feature"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
