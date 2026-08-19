import React from "react";
import Badge from "../common/Badge";

export default function BudgetBreakdownTable({ summaryData }) {
  if (!summaryData) {
    return (
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-8 text-center text-[#707a8c] shadow-sm">
        Loading budget analytics...
      </div>
    );
  }

  const {
    total_estimated = 0,
    total_actual = 0,
    variance = 0,
    category_breakdown = [],
  } = summaryData;

  const getVarianceBadge = (varVal) => {
    if (varVal > 0) {
      return <Badge variant="danger">+${varVal.toFixed(2)} Over Budget</Badge>;
    } else if (varVal < 0) {
      return (
        <Badge variant="success">
          -${Math.abs(varVal).toFixed(2)} Under Budget
        </Badge>
      );
    }
    return <Badge variant="default">$0.00 On Budget</Badge>;
  };

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[#e3e8f0] bg-[#f7fafc] flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#171c29]">
          Category Cost Breakdown
        </h3>
        <div className="flex items-center space-x-3 text-xs font-semibold">
          <span className="text-[#707a8c]">
            Est Total:{" "}
            <strong className="text-[#171c29]">
              ${total_estimated.toFixed(2)}
            </strong>
          </span>
          <span className="text-[#707a8c]">
            Actual Total:{" "}
            <strong className="text-[#17a34a]">
              ${total_actual.toFixed(2)}
            </strong>
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-[#f7fafc] border-b border-[#e3e8f0] text-xs font-semibold text-[#707a8c] uppercase">
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Estimated Expense</th>
              <th className="py-3 px-4">Actual Expense</th>
              <th className="py-3 px-4">Variance (Actual - Est)</th>
              <th className="py-3 px-4">Budget Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e3e8f0]">
            {category_breakdown.map((row, idx) => (
              <tr key={row.category_id || idx} className="hover:bg-[#f2f5fa]">
                <td className="py-3.5 px-4 font-semibold text-[#171c29]">
                  {row.category_name}
                </td>
                <td className="py-3.5 px-4 font-medium text-[#707a8c]">
                  ${Number(row.estimated || 0).toFixed(2)}
                </td>
                <td className="py-3.5 px-4 font-medium text-[#17a34a]">
                  ${Number(row.actual || 0).toFixed(2)}
                </td>
                <td
                  className={`py-3.5 px-4 font-bold ${row.variance > 0 ? "text-red-600" : "text-green-600"}`}
                >
                  {row.variance > 0
                    ? `+$${row.variance.toFixed(2)}`
                    : `-$${Math.abs(row.variance).toFixed(2)}`}
                </td>
                <td className="py-3.5 px-4">
                  {getVarianceBadge(row.variance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
