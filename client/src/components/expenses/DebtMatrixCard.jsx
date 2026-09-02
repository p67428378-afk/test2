import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, DollarSign } from "lucide-react";

export const DebtMatrixCard = ({ simplifiedSettlements = [], groupId }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Debt Simplification Ledger
          </h2>
          <p className="text-xs text-slate-500">
            Minimum required transactions to settle all group balances
          </p>
        </div>
        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg">
          {simplifiedSettlements.length} Pending{" "}
          {simplifiedSettlements.length === 1 ? "Settlement" : "Settlements"}
        </span>
      </div>

      {simplifiedSettlements.length === 0 ? (
        <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center text-slate-500">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <p className="font-semibold text-slate-800 text-sm">
            All debts are settled!
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            No member owes anyone in this group.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {simplifiedSettlements.map((debt, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors gap-3"
            >
              <div className="flex items-center space-x-3 text-sm">
                <span className="font-bold text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                  {debt.from_member_name}
                </span>

                <div className="flex items-center space-x-1 text-slate-400">
                  <span className="text-xs font-semibold text-red-600">
                    owes
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>

                <span className="font-bold text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                  {debt.to_member_name}
                </span>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-4">
                <span className="text-lg font-extrabold text-slate-900 flex items-center">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  {Number(debt.amount).toFixed(2)}
                </span>

                <Link
                  to={`/settlements?group_id=${groupId || ""}&payer_id=${debt.from_member_id}&payee_id=${debt.to_member_id}&amount=${debt.amount}`}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center space-x-1"
                >
                  <span>Settle</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DebtMatrixCard;
