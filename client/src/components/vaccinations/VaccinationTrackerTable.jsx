import React from "react";
import { Syringe, AlertTriangle, CheckCircle, Clock, Plus } from "lucide-react";

export default function VaccinationTrackerTable({
  vaccinations = [],
  petsMap = {},
  onOpenVaccineModal,
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "UP_TO_DATE":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="h-3 w-3" />
            <span>Up To Date</span>
          </span>
        );
      case "DUE_SOON":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="h-3 w-3" />
            <span>Due Soon</span>
          </span>
        );
      case "OVERDUE":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="h-3 w-3" />
            <span>Overdue</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
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
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Syringe className="h-5 w-5 text-blue-600" />
            <span>Immunization Tracker</span>
          </h2>
          <p className="text-sm text-slate-500">
            Track vaccine history and upcoming booster due dates
          </p>
        </div>
        {onOpenVaccineModal && (
          <button
            onClick={onOpenVaccineModal}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Record Vaccination</span>
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Pet Name</th>
              <th className="py-3 px-4">Vaccine Name</th>
              <th className="py-3 px-4">Administered Date</th>
              <th className="py-3 px-4">Next Due Date</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {vaccinations.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-500">
                  No vaccination records found.
                </td>
              </tr>
            ) : (
              vaccinations.map((vax) => {
                const pet = petsMap[vax.pet_id];
                return (
                  <tr
                    key={vax.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-blue-600">
                      {pet ? pet.name : `Pet #${vax.pet_id.slice(0, 6)}`}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {vax.vaccine_name}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {formatDate(vax.administered_date)}
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {formatDate(vax.next_due_date)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(vax.status)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
