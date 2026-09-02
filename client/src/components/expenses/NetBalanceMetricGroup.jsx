import React from "react";
import { ArrowUpRight, ArrowDownLeft, CheckCircle2, User } from "lucide-react";

export const NetBalanceMetricGroup = ({ netBalances = [] }) => {
  if (!netBalances || netBalances.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-slate-500 mb-6">
        No balance metrics available yet.
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center justify-between">
        <span>Group Net Balances</span>
        <span className="text-xs font-normal text-slate-500">
          Positive = Is Owed &bull; Negative = Owes
        </span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {netBalances.map((item) => {
          const balance = Number(item.net_balance || 0);
          const isPositive = balance > 0.001;
          const isNegative = balance < -0.001;
          const isSettled = !isPositive && !isNegative;

          return (
            <div
              key={item.member_id}
              className={`p-4 rounded-xl border transition-all ${
                isPositive
                  ? "bg-emerald-50/60 border-emerald-200"
                  : isNegative
                    ? "bg-red-50/60 border-red-200"
                    : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                    <User className="w-4 h-4 text-slate-600" />
                  </div>
                  <span className="font-semibold text-slate-900 text-sm truncate max-w-[120px]">
                    {item.member_name}
                  </span>
                </div>

                {isPositive && (
                  <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                )}
                {isNegative && (
                  <span className="p-1.5 bg-red-100 text-red-700 rounded-lg">
                    <ArrowDownLeft className="w-4 h-4" />
                  </span>
                )}
                {isSettled && (
                  <span className="p-1.5 bg-slate-200 text-slate-600 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                )}
              </div>

              <div className="mt-2">
                <span className="text-xs text-slate-500 font-medium block">
                  {isPositive
                    ? "Gets back"
                    : isNegative
                      ? "Owes group"
                      : "Settled up"}
                </span>
                <span
                  className={`text-xl font-extrabold ${
                    isPositive
                      ? "text-emerald-700"
                      : isNegative
                        ? "text-red-700"
                        : "text-slate-600"
                  }`}
                >
                  {isNegative ? "-" : ""}${Math.abs(balance).toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NetBalanceMetricGroup;
