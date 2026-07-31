import React from "react";
import Badge from "../common/Badge.jsx";
import Button from "../common/Button.jsx";

export default function OverdueFinesTable({ fines, onPayFine }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700">
        <h3 className="font-semibold text-slate-100">Overdue Fines</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900/30 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-3">Member Name</th>
              <th className="px-6 py-3">Book Title</th>
              <th className="px-6 py-3">Fine Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-sm text-slate-300">
            {fines.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No outstanding fines found.
                </td>
              </tr>
            ) : (
              fines.map((fine) => (
                <tr
                  key={fine.id}
                  className="hover:bg-slate-700/20 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-200">
                    {fine.loan?.member?.full_name || "Unknown Member"}
                  </td>
                  <td className="px-6 py-4">
                    {fine.loan?.book?.title || "Unknown Book"}
                  </td>
                  <td className="px-6 py-4 text-emerald-400 font-semibold">
                    ${fine.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={fine.status === "paid" ? "success" : "danger"}
                    >
                      {fine.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {fine.status !== "paid" && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onPayFine(fine.id)}
                      >
                        Pay Fine
                      </Button>
                    )}
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
