import React, { useState, useEffect } from "react";
import {
  listWatchlist,
  addToWatchlist,
  screenVisitorWatchlist,
  removeFromWatchlist,
} from "../services/api";
import {
  ShieldAlert,
  Plus,
  Trash2,
  Search,
  CheckCircle,
  AlertTriangle,
  X,
  UserX,
} from "lucide-react";

const WatchlistManagementModal = ({ isOpen, onClose }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Add form fields
  const [nationalId, setNationalId] = useState("");
  const [fullName, setFullName] = useState("");
  const [reason, setReason] = useState("");
  const [severityLevel, setSeverityLevel] = useState("HIGH");

  // Screen check fields
  const [screenId, setScreenId] = useState("");
  const [screenResult, setScreenResult] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchWatchlist();
    }
  }, [isOpen]);

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const data = await listWatchlist({ is_active: true });
      setWatchlist(data || []);
    } catch (err) {
      console.error("Error fetching watchlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWatchlist = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const payload = {
        national_id: nationalId,
        full_name: fullName,
        reason: reason,
        severity_level: severityLevel,
      };
      await addToWatchlist(payload);
      setSuccessMsg(
        `Successfully added ${fullName} (${nationalId}) to Security Watchlist.`,
      );
      setNationalId("");
      setFullName("");
      setReason("");
      setShowAddForm(false);
      fetchWatchlist();
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Failed to add to watchlist.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id, name) => {
    if (
      !window.confirm(
        `Are you sure you want to remove ${name} from the facility watchlist?`,
      )
    ) {
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await removeFromWatchlist(id);
      setSuccessMsg(`Removed ${name} from watchlist.`);
      fetchWatchlist();
    } catch (err) {
      const msg =
        err.response?.data?.detail || err.message || "Failed to remove entry.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleScreenCheck = async (e) => {
    e.preventDefault();
    if (!screenId) return;
    setSubmitting(true);
    setScreenResult(null);
    setError(null);
    try {
      const res = await screenVisitorWatchlist({ national_id: screenId });
      setScreenResult(res);
    } catch (err) {
      const msg =
        err.response?.data?.detail || err.message || "Screening check failed.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredWatchlist = watchlist.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.full_name?.toLowerCase().includes(term) ||
      item.national_id?.toLowerCase().includes(term) ||
      item.reason?.toLowerCase().includes(term)
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-60 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl p-6 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-red-100 text-red-700 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Automated Security Watchlist Management
              </h2>
              <p className="text-xs text-slate-500">
                Real-time facility blacklists, national ID screening, and
                visitor clearance flags
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Banner Alert Messages */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="py-4 space-y-6 overflow-y-auto flex-1">
          {/* Quick On-Demand Screening Tool */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              On-Demand National ID Screening Check
            </h3>
            <form onSubmit={handleScreenCheck} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter National ID or Passport No. to screen..."
                value={screenId}
                onChange={(e) => setScreenId(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 font-mono"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition"
              >
                Run Screening Check
              </button>
            </form>

            {screenResult && (
              <div
                className={`mt-3 p-3 rounded-lg border text-sm flex items-center justify-between ${
                  screenResult.is_flagged
                    ? "bg-red-100 text-red-800 border-red-300 font-bold"
                    : "bg-emerald-100 text-emerald-800 border-emerald-300"
                }`}
              >
                <div>
                  <span className="uppercase text-xs font-mono font-bold block">
                    {screenResult.is_flagged
                      ? "SECURITY FLAG DETECTED"
                      : "CLEARANCE GRANTED"}
                  </span>
                  <span>
                    {screenResult.message ||
                      `National ID ${screenResult.national_id}`}
                  </span>
                </div>
                <span className="text-xs font-mono underline">
                  {screenResult.is_flagged ? "DENY ENTRY" : "CLEARED"}
                </span>
              </div>
            )}
          </div>

          {/* Add Entry Toggle & Form */}
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Filter watchlist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition flex items-center space-x-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Individual to Watchlist</span>
            </button>
          </div>

          {showAddForm && (
            <form
              onSubmit={handleAddWatchlist}
              className="bg-red-50/60 p-4 rounded-xl border border-red-200 space-y-3"
            >
              <h4 className="text-sm font-bold text-red-900 flex items-center space-x-2">
                <UserX className="w-4 h-4 text-red-700" />
                <span>Flag New Banned Individual</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    National ID / Passport *
                  </label>
                  <input
                    type="text"
                    required
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="e.g. ID-8849102"
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Robert Vance"
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Flag Reason / Offense *
                  </label>
                  <input
                    type="text"
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Contraband smuggling attempt at Gate 2"
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Severity Level
                  </label>
                  <select
                    value={severityLevel}
                    onChange={(e) => setSeverityLevel(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg"
                  >
                    <option value="CRITICAL">CRITICAL (Permanent Ban)</option>
                    <option value="HIGH">
                      HIGH (Requires Guard Verification)
                    </option>
                    <option value="MEDIUM">MEDIUM (Caution Flag)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold"
                >
                  Save Watchlist Entry
                </button>
              </div>
            </form>
          )}

          {/* Active Watchlist Table */}
          {loading ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              Loading security database...
            </div>
          ) : filteredWatchlist.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              No watchlist entries found.
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-xs uppercase">
                    <th className="p-3">National ID</th>
                    <th className="p-3">Full Name</th>
                    <th className="p-3">Flag Reason</th>
                    <th className="p-3">Severity</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredWatchlist.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-red-700">
                        {item.national_id}
                      </td>
                      <td className="p-3 font-medium text-slate-900">
                        {item.full_name}
                      </td>
                      <td className="p-3 text-slate-600 text-xs">
                        {item.reason}
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${
                            item.severity_level === "CRITICAL"
                              ? "bg-red-800 text-white"
                              : item.severity_level === "HIGH"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {item.severity_level}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleRemove(item.id, item.full_name)}
                          disabled={submitting}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded transition"
                          title="Remove from Watchlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-sm font-semibold transition"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default WatchlistManagementModal;
