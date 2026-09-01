import React, { useState, useEffect } from "react";
import { listVisitors, createVerification } from "../services/api";
import {
  ShieldCheck,
  Search,
  CheckCircle,
  XCircle,
  ExternalLink,
  RefreshCw,
  FileText,
} from "lucide-react";

const IdentityVerificationTable = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.verification_status = statusFilter;
      const data = await listVisitors(params);
      setVisitors(data || []);
    } catch (err) {
      console.error("Error fetching visitors:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAction = async (visitor, status) => {
    setSubmitting(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const payload = {
        visitor_id: visitor.id,
        verification_status: status,
        notes:
          notes ||
          `Background check completed by officer. Marked as ${status}.`,
      };
      await createVerification(payload);
      setActionSuccess(
        `Visitor ${visitor.full_name} identity status set to ${status}.`,
      );
      setSelectedVisitor(null);
      setNotes("");
      fetchData();
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Verification update failed.";
      setActionError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredVisitors = visitors.filter((v) => {
    const term = searchTerm.toLowerCase();
    return (
      v.full_name.toLowerCase().includes(term) ||
      v.national_id.toLowerCase().includes(term) ||
      v.email.toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-50 text-indigo-800 rounded-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Identity Verification Queue
            </h2>
            <p className="text-sm text-slate-500">
              Review government photo IDs & clear background verification
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchData}
            className="p-2 text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search visitor or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="VERIFIED">VERIFIED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>
      </div>

      {actionError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {actionError}
        </div>
      )}

      {actionSuccess && (
        <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-sm rounded-lg border border-emerald-200">
          {actionSuccess}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-slate-500 text-sm">
          Loading verification queue...
        </div>
      ) : filteredVisitors.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">
          No visitor records found matching criteria.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="p-3">Visitor Name</th>
                <th className="p-3">National ID</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Photo ID Document</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVisitors.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="p-3 font-medium text-slate-800">
                    {v.full_name}
                  </td>
                  <td className="p-3 font-mono text-slate-600">
                    {v.national_id}
                  </td>
                  <td className="p-3 text-slate-500">
                    <div>{v.email}</div>
                    <div className="text-xs text-slate-400">{v.phone}</div>
                  </td>
                  <td className="p-3">
                    {v.photo_id_url ? (
                      <a
                        href={v.photo_id_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 inline-flex items-center space-x-1 text-xs font-semibold"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View ID Document</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400 text-xs italic">
                        No document
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        v.verification_status === "VERIFIED"
                          ? "bg-emerald-100 text-emerald-800"
                          : v.verification_status === "REJECTED"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {v.verification_status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedVisitor(v)}
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded text-xs font-semibold transition"
                    >
                      Process Check
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedVisitor && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Identity Verification for {selectedVisitor.full_name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              National ID:{" "}
              <span className="font-mono">{selectedVisitor.national_id}</span>
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Officer Notes / Background Check Remarks
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter verification remarks, background check details..."
                rows="3"
                className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setSelectedVisitor(null)}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerifyAction(selectedVisitor, "REJECTED")}
                disabled={submitting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium flex items-center space-x-1"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Clearance</span>
              </button>
              <button
                onClick={() => handleVerifyAction(selectedVisitor, "VERIFIED")}
                disabled={submitting}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg font-medium flex items-center space-x-1"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Verify Visitor</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdentityVerificationTable;
