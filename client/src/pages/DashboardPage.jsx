import React, { useState, useEffect } from "react";
import ContractDashboard from "../components/ContractDashboard";
import { contractService } from "../services/api";
import { Plus, X, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    vendor_name: "Acme Corp",
    effective_date: "2026-06-01",
    termination_date: "2027-05-31",
    total_value: 85000,
    terms: "Standard Master Services Agreement terms and conditions.",
  });

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const data = await contractService.list();
      setContracts(data.items || []);
    } catch (err) {
      console.error("Failed to load contracts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.effective_date ||
      !formData.termination_date
    ) {
      setFormError(
        "Please fill in all required fields (Title, Start Date, End Date).",
      );
      return;
    }
    setFormError("");
    setSubmitting(true);

    try {
      await contractService.create(formData);
      setShowCreateModal(false);
      setFormData({
        title: "",
        vendor_name: "Acme Corp",
        effective_date: "2026-06-01",
        termination_date: "2027-05-31",
        total_value: 85000,
        terms: "Standard Master Services Agreement terms and conditions.",
      });
      fetchContracts();
    } catch (err) {
      console.error(err);
      setFormError(
        err.response?.data?.detail || "Failed to create contract draft.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Vendor Contract Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Draft, version, negotiate, approve, and track expiration cycles for
          vendor contracts.
        </p>
      </div>

      <ContractDashboard
        contracts={contracts}
        loading={loading}
        onRefresh={fetchContracts}
        onCreateClick={() => setShowCreateModal(true)}
      />

      {/* Draft Contract Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" /> Draft New Vendor
                Contract
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contract Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Acme Corp Enterprise Software License"
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Vendor Name
                  </label>
                  <input
                    type="text"
                    value={formData.vendor_name}
                    onChange={(e) =>
                      setFormData({ ...formData, vendor_name: e.target.value })
                    }
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Contract Value ($)
                  </label>
                  <input
                    type="number"
                    value={formData.total_value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        total_value: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Effective Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.effective_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        effective_date: e.target.value,
                      })
                    }
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Termination / End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.termination_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        termination_date: e.target.value,
                      })
                    }
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Core Contract Terms & Clauses
                </label>
                <textarea
                  rows="4"
                  value={formData.terms}
                  onChange={(e) =>
                    setFormData({ ...formData, terms: e.target.value })
                  }
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-medium text-xs rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg shadow-sm disabled:opacity-50"
                >
                  {submitting ? "Saving Draft..." : "Save as Draft"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
