import React, { useState, useEffect } from "react";
import { Search, RefreshCw, User, Phone, Shield, FileText } from "lucide-react";
import { getPatients } from "../../services/api";

export default function PatientDirectoryTable({
  refreshTrigger,
  onSelectPatient,
}) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPatients = async (query = "") => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPatients({ search: query || undefined, limit: 50 });
      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load patients list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients(searchTerm);
  }, [refreshTrigger]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPatients(searchTerm);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-800">
            Patient Directory
          </h2>
          <p className="text-xs text-slate-500">
            Search and view active patient records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex-1 sm:w-64"
          >
            <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </form>
          <button
            onClick={() => fetchPatients(searchTerm)}
            disabled={loading}
            className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            title="Refresh List"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 mb-4 bg-red-50 text-red-700 text-xs rounded-lg">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <th className="py-2.5 px-3">Patient ID</th>
              <th className="py-2.5 px-3">Name</th>
              <th className="py-2.5 px-3">DOB / Gender</th>
              <th className="py-2.5 px-3">Contact</th>
              <th className="py-2.5 px-3">Insurance</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-slate-400">
                  Loading patient records...
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-slate-400">
                  No patients found. Register a new patient above.
                </td>
              </tr>
            ) : (
              patients.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-2.5 px-3 font-mono text-slate-500 font-medium">
                    {p.id ? `${p.id.slice(0, 8)}...` : "N/A"}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px]">
                        {p.full_name?.charAt(0) || "P"}
                      </div>
                      <span>{p.full_name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {p.date_of_birth} ({p.gender})
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-slate-400" />
                      <span>{p.phone}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {p.insurance_provider ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium text-[11px]">
                        <Shield className="h-3 w-3 text-emerald-500" />
                        {p.insurance_provider}
                      </span>
                    ) : (
                      <span className="text-slate-400">Self-Pay</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onSelectPatient && onSelectPatient(p)}
                      className="px-2.5 py-1 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded font-medium transition-colors"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
