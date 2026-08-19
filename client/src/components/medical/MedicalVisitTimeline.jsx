import React from "react";
import { FileText, Calendar, Stethoscope, Pill, Plus } from "lucide-react";

export default function MedicalVisitTimeline({
  records = [],
  onOpenAddRecord,
}) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Stethoscope className="h-5 w-5 text-blue-600" />
            <span>Medical Visit Records</span>
          </h2>
          <p className="text-sm text-slate-500">
            History of veterinary consultations and treatments
          </p>
        </div>
        {onOpenAddRecord && (
          <button
            onClick={onOpenAddRecord}
            className="inline-flex items-center space-x-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Log Visit Record</span>
          </button>
        )}
      </div>

      {records.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-600">
            No medical visit records found.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Veterinarians can log clinical notes and treatments here.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {records.map((rec) => (
            <div key={rec.id} className="relative group">
              <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 transition-all group-hover:border-blue-200 group-hover:shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
                    <Calendar className="h-3.5 w-3.5 text-blue-500" />
                    <span>{formatDate(rec.visit_date)}</span>
                  </div>
                  {rec.vet_id && (
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono">
                      Vet ID: {rec.vet_id.slice(0, 8)}...
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  {rec.diagnosis && (
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                        Diagnosis
                      </span>
                      <p className="font-semibold text-slate-800">
                        {rec.diagnosis}
                      </p>
                    </div>
                  )}

                  {rec.treatment && (
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                        Treatment
                      </span>
                      <p className="text-slate-700">{rec.treatment}</p>
                    </div>
                  )}

                  {rec.prescriptions && (
                    <div className="flex items-start space-x-2 bg-emerald-50 text-emerald-900 p-2.5 rounded-lg border border-emerald-100 text-xs">
                      <Pill className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold block">Prescriptions</span>
                        <span>{rec.prescriptions}</span>
                      </div>
                    </div>
                  )}

                  {rec.notes && (
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                        Notes
                      </span>
                      <p className="text-slate-600 text-xs italic">
                        {rec.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
