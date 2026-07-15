import React from "react";

export default function AmortizationTable({ schedule }) {
  if (!schedule || schedule.length === 0) {
    return (
      <div className="text-center py-6 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-slate-500 text-sm">
          No amortization schedule available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold tracking-wider sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3">Month</th>
              <th className="px-6 py-3">EMI</th>
              <th className="px-6 py-3">Principal Component</th>
              <th className="px-6 py-3">Interest Component</th>
              <th className="px-6 py-3">Remaining Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {schedule.map((row) => (
              <tr
                key={row.month}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-3 font-medium text-slate-900">
                  Month {row.month}
                </td>
                <td className="px-6 py-3 font-semibold">
                  ${parseFloat(row.emi).toFixed(2)}
                </td>
                <td className="px-6 py-3 text-emerald-600">
                  ${parseFloat(row.principal).toFixed(2)}
                </td>
                <td className="px-6 py-3 text-amber-600">
                  ${parseFloat(row.interest).toFixed(2)}
                </td>
                <td className="px-6 py-3 font-mono text-slate-500">
                  ${parseFloat(row.balance).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
