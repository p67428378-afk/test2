import React from "react";
import Button from "../common/Button.jsx";
import Badge from "../common/Badge.jsx";

export default function MyFinesPanel({ fines, onPayFine }) {
  const unpaidFines = fines.filter((f) => f.status !== "paid");
  const totalOutstanding = unpaidFines.reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-700 pb-6 mb-6">
        <div>
          <h3 className="font-semibold text-slate-100 text-lg">
            Outstanding Fines
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Fines are calculated at $0.25 per day for overdue books.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Total Balance
          </p>
          <p className="text-3xl font-bold text-rose-400 mt-1">
            ${totalOutstanding.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-slate-200 text-sm">Fine History</h4>
        <div className="space-y-3">
          {fines.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">
              No fines recorded on your account.
            </p>
          ) : (
            fines.map((fine) => (
              <div
                key={fine.id}
                className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-700/50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Overdue: {fine.loan?.book?.title || "Unknown Book"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Due Date:{" "}
                    {fine.loan?.due_date
                      ? new Date(fine.loan.due_date).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-slate-200">
                    ${fine.amount.toFixed(2)}
                  </span>
                  <Badge
                    variant={fine.status === "paid" ? "success" : "danger"}
                  >
                    {fine.status}
                  </Badge>
                  {fine.status !== "paid" && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onPayFine(fine.id)}
                    >
                      Pay Now
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
