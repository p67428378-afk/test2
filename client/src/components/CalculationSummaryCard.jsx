import React from "react";
import { Link } from "react-router-dom";

export default function CalculationSummaryCard({
  results,
  billAmount,
  tipPercentage,
  numPeople,
}) {
  const formatCurrency = (val) => {
    if (val === null || val === undefined || isNaN(val)) return "$0.00";
    return `$${Number(val).toFixed(2)}`;
  };

  const tipPerPerson =
    results?.tip_per_person ??
    (billAmount && tipPercentage && numPeople
      ? (billAmount * (tipPercentage / 100)) / numPeople
      : 0);
  const totalPerPerson =
    results?.total_per_person ??
    (billAmount && tipPercentage && numPeople
      ? (billAmount * (1 + tipPercentage / 100)) / numPeople
      : 0);
  const totalTip =
    results?.total_tip ??
    (billAmount && tipPercentage ? billAmount * (tipPercentage / 100) : 0);
  const totalBill =
    results?.total_bill ??
    (billAmount && tipPercentage ? billAmount * (1 + tipPercentage / 100) : 0);

  const peopleCount = Number(numPeople) || 1;
  const tipRate = Number(tipPercentage) || 0;
  const baseBill = Number(billAmount) || 0;

  return (
    <div
      className="bg-white border border-[#e3e8f0] border-solid flex flex-col gap-4 p-6 rounded-[14px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] w-full"
      data-node-id="1:68"
      data-name="Card"
    >
      <div className="flex items-center justify-between border-b border-[#e3e8f0] pb-3">
        <h2 className="font-bold text-[#171c29] text-lg" data-node-id="1:69">
          Calculation Summary
        </h2>
        <span className="text-xs text-[#17a34a] font-semibold bg-[#17a34a]/10 px-2.5 py-1 rounded-full flex items-center gap-1">
          <span>✓</span> Live Summary
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Stat 1: Tip Per Person */}
        <div
          className="bg-white border border-[#e3e8f0] flex flex-col gap-1.5 p-4 rounded-[12px] shadow-sm hover:border-[#2663eb]/40 transition-colors"
          data-node-id="1:44"
          data-name="Stat"
        >
          <p className="font-medium text-[#707a8c] text-xs uppercase tracking-wider">
            Tip Per Person
          </p>
          <div className="flex items-baseline justify-between gap-2">
            <span
              data-testid="tip-per-person"
              className="font-bold text-[#2663eb] text-2xl tracking-tight"
            >
              {formatCurrency(tipPerPerson)}
            </span>
            <span className="bg-[#17a34a] text-white text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
              Exact Split
            </span>
          </div>
        </div>

        {/* Stat 2: Total Per Person */}
        <div
          className="bg-white border border-[#e3e8f0] flex flex-col gap-1.5 p-4 rounded-[12px] shadow-sm hover:border-[#2663eb]/40 transition-colors"
          data-node-id="1:50"
          data-name="Stat"
        >
          <p className="font-medium text-[#707a8c] text-xs uppercase tracking-wider">
            Total Per Person
          </p>
          <div className="flex items-baseline justify-between gap-2">
            <span
              data-testid="total-per-person"
              className="font-bold text-[#2663eb] text-2xl tracking-tight"
            >
              {formatCurrency(totalPerPerson)}
            </span>
            <span className="bg-[#17a34a] text-white text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
              Includes Tip
            </span>
          </div>
        </div>

        {/* Stat 3: Total Tip Amount */}
        <div
          className="bg-white border border-[#e3e8f0] flex flex-col gap-1.5 p-4 rounded-[12px] shadow-sm hover:border-[#2663eb]/40 transition-colors"
          data-node-id="1:56"
          data-name="Stat"
        >
          <p className="font-medium text-[#707a8c] text-xs uppercase tracking-wider">
            Total Tip Amount
          </p>
          <div className="flex items-baseline justify-between gap-2">
            <span
              data-testid="total-tip"
              className="font-bold text-[#2663eb] text-2xl tracking-tight"
            >
              {formatCurrency(totalTip)}
            </span>
            <span className="bg-[#17a34a] text-white text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
              {tipRate}% of {formatCurrency(baseBill)}
            </span>
          </div>
        </div>

        {/* Stat 4: Total Bill Amount */}
        <div
          className="bg-white border border-[#e3e8f0] flex flex-col gap-1.5 p-4 rounded-[12px] shadow-sm hover:border-[#2663eb]/40 transition-colors"
          data-node-id="1:62"
          data-name="Stat"
        >
          <p className="font-medium text-[#707a8c] text-xs uppercase tracking-wider">
            Total Bill Amount
          </p>
          <div className="flex items-baseline justify-between gap-2">
            <span
              data-testid="total-bill"
              className="font-bold text-[#2663eb] text-2xl tracking-tight"
            >
              {formatCurrency(totalBill)}
            </span>
            <span className="bg-[#17a34a] text-white text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
              {peopleCount} {peopleCount === 1 ? "Person" : "People"}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-[#e3e8f0] flex items-center justify-between">
        <span className="text-xs text-[#707a8c]">
          Looking for per-person breakdown?
        </span>
        <Link
          to="/breakdown"
          className="text-xs font-semibold text-[#2663eb] hover:text-[#1d4ed8] flex items-center gap-1 hover:underline"
        >
          View Detailed Split Breakdown &rarr;
        </Link>
      </div>
    </div>
  );
}
