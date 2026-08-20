import React, { useState } from "react";
import { ShieldAlert, Plus, AlertTriangle, CheckCircle } from "lucide-react";

export default function DiseaseReportForm({
  hives = [],
  reports = [],
  onAddReport,
}) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    hive_id: "",
    disease_name: "Varroa Mites",
    severity_level: "Medium",
    symptoms_description: "Elevated mite count found on sticky board.",
    treatment_applied: "Applied formic acid strip.",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (
      !formData.hive_id ||
      !formData.disease_name ||
      !formData.severity_level
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    try {
      await onAddReport({
        hive_id: formData.hive_id,
        disease_name: formData.disease_name,
        severity_level: formData.severity_level,
        symptoms_description: formData.symptoms_description,
        treatment_applied: formData.treatment_applied,
      });
      setSuccess("Disease report filed & health status updated!");
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to file disease report.");
    }
  };

  const criticalCount = reports.filter(
    (r) => r.severity_level === "Critical" || r.severity_level === "High",
  ).length;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#db2626]" />
            <h2 className="text-lg font-bold text-[#171c29]">
              Colony Health & Disease Control Center
            </h2>
          </div>
          <p className="text-xs text-[#707a8c] mt-1">
            Log Varroa mite inspections, pest observations, treatment schedules,
            and quarantine alerts.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-[#707a8c]">Active High Alerts</span>
            <p
              className={`text-xl font-extrabold ${criticalCount > 0 ? "text-red-600" : "text-green-600"}`}
            >
              {criticalCount}
            </p>
          </div>
          <button
            onClick={() => {
              if (hives.length > 0 && !formData.hive_id) {
                setFormData((prev) => ({ ...prev, hive_id: hives[0].id }));
              }
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-[#db2626] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>File Disease Report</span>
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

      {/* Reports Table */}
      <div className="bg-white border border-[#e3e8f0] rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f7fafc] border-b border-[#e3e8f0] text-xs font-semibold text-[#707a8c]">
              <th className="p-4">Report Date</th>
              <th className="p-4">Hive</th>
              <th className="p-4">Disease / Pest</th>
              <th className="p-4">Severity</th>
              <th className="p-4">Symptoms</th>
              <th className="p-4">Treatment Applied</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e3e8f0] text-sm">
            {reports.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-[#707a8c]">
                  No health or disease incidents reported. Hives are currently
                  healthy.
                </td>
              </tr>
            ) : (
              reports.map((r) => {
                const hiveName =
                  hives.find((hv) => hv.id === r.hive_id)?.hive_number ||
                  "Hive Record";
                const isHigh =
                  r.severity_level === "Critical" ||
                  r.severity_level === "High";
                const dateStr = r.report_date
                  ? new Date(r.report_date).toLocaleDateString()
                  : "Today";

                return (
                  <tr key={r.id} className="hover:bg-[#f7fafc]">
                    <td className="p-4 font-medium text-[#707a8c]">
                      {dateStr}
                    </td>
                    <td className="p-4 font-bold text-[#171c29]">
                      🐝 {hiveName}
                    </td>
                    <td className="p-4 font-medium text-[#2663eb]">
                      {r.disease_name}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                          isHigh
                            ? "bg-red-50 text-red-700 border-red-200"
                            : r.severity_level === "Medium"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {r.severity_level}
                      </span>
                    </td>
                    <td className="p-4 text-[#707a8c] max-w-xs truncate">
                      {r.symptoms_description}
                    </td>
                    <td className="p-4 text-[#171c29]">
                      {r.treatment_applied || "Pending Treatment"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <h3 className="text-lg font-bold text-[#171c29] mb-4">
              File Disease & Health Alert Report
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
                      {h.hive_number} ({h.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#707a8c] mb-1">
                    Disease / Pest Name
                  </label>
                  <input
                    type="text"
                    value={formData.disease_name}
                    onChange={(e) =>
                      setFormData({ ...formData, disease_name: e.target.value })
                    }
                    className="w-full border border-[#e3e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2663eb]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#707a8c] mb-1">
                    Severity Level
                  </label>
                  <select
                    value={formData.severity_level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        severity_level: e.target.value,
                      })
                    }
                    className="w-full border border-[#e3e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2663eb]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#707a8c] mb-1">
                  Symptoms Description
                </label>
                <textarea
                  rows="3"
                  value={formData.symptoms_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      symptoms_description: e.target.value,
                    })
                  }
                  className="w-full border border-[#e3e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2663eb]"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#707a8c] mb-1">
                  Treatment Applied
                </label>
                <input
                  type="text"
                  placeholder="e.g. Formic acid, Oxalic acid, Quarantine"
                  value={formData.treatment_applied}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      treatment_applied: e.target.value,
                    })
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
                  className="px-4 py-2 bg-[#db2626] text-white rounded-lg text-sm font-semibold hover:bg-red-700"
                >
                  Submit Health Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
