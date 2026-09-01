import React, { useState, useEffect } from "react";
import {
  History,
  Search,
  FileText,
  Pill,
  FlaskConical,
  Calendar,
} from "lucide-react";
import { getPatientEMRHistory } from "../../services/api";

export default function EMRTimeline({ selectedPatientId, refreshTrigger }) {
  const [patientIdInput, setPatientIdInput] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedPatientId) {
      setPatientIdInput(selectedPatientId);
      fetchHistory(selectedPatientId);
    }
  }, [selectedPatientId, refreshTrigger]);

  const fetchHistory = async (patientId) => {
    if (!patientId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getPatientEMRHistory(patientId);
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to fetch patient EMR history.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistory(patientIdInput);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <History className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Patient EMR Timeline
            </h2>
            <p className="text-xs text-slate-500">
              Historical medical records and encounter logs
            </p>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter Patient UUID..."
            value={patientIdInput}
            onChange={(e) => setPatientIdInput(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none w-56"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="p-3 mb-4 bg-red-50 text-red-700 text-xs rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs">
          Loading EMR history...
        </div>
      ) : records.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs">
          {patientIdInput
            ? "No historical records found for this patient."
            : "Enter a Patient UUID above to load clinical history."}
        </div>
      ) : (
        <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 pl-6 my-2">
          {records.map((rec) => (
            <div key={rec.id} className="relative group">
              {/* Timeline Node Dot */}
              <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-indigo-600 border-4 border-white shadow-sm"></div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <FileText className="h-4 w-4 text-indigo-600" />
                    <span>{rec.diagnosis}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(rec.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="text-slate-600 leading-relaxed">
                  <span className="font-semibold text-slate-700">
                    Clinical Notes:{" "}
                  </span>
                  {rec.clinical_notes}
                </div>

                {rec.prescriptions && rec.prescriptions.length > 0 && (
                  <div className="bg-white p-2.5 rounded border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-indigo-700 text-[11px]">
                      <Pill className="h-3.5 w-3.5" />
                      <span>
                        Prescribed Medications ({rec.prescriptions.length})
                      </span>
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                      {rec.prescriptions.map((p, idx) => (
                        <li key={idx}>
                          <span className="font-medium text-slate-800">
                            {p.medication}
                          </span>{" "}
                          - {p.dosage} ({p.frequency}) for {p.duration}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {rec.lab_orders && rec.lab_orders.length > 0 && (
                  <div className="bg-white p-2.5 rounded border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-amber-700 text-[11px]">
                      <FlaskConical className="h-3.5 w-3.5" />
                      <span>Lab Requisitions ({rec.lab_orders.length})</span>
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                      {rec.lab_orders.map((l, idx) => (
                        <li key={idx}>
                          <span className="font-medium text-slate-800">
                            {l.test_name}
                          </span>{" "}
                          {l.notes ? `(${l.notes})` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
