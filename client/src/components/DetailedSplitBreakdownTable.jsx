import React, { useState } from "react";

export default function DetailedSplitBreakdownTable({
  billAmount = 120,
  tipPercentage = 15,
  numPeople = 2,
  results = null,
}) {
  const count = Math.max(1, parseInt(numPeople, 10) || 1);
  const totalTip = results?.total_tip ?? billAmount * (tipPercentage / 100);
  const totalBill = results?.total_bill ?? billAmount + totalTip;
  const baseShare = billAmount / count;
  const tipContribution = totalTip / count;
  const totalOwed = totalBill / count;

  const [statuses, setStatuses] = useState(() => {
    const initial = {};
    for (let i = 1; i <= count; i++) {
      initial[i] = i === 1 ? "Paid" : "Pending";
    }
    return initial;
  });

  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);

  const toggleStatus = (index) => {
    setStatuses((prev) => ({
      ...prev,
      [index]: prev[index] === "Paid" ? "Pending" : "Paid",
    }));
  };

  const handleShareLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard?.writeText?.(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleExportSummary = () => {
    window.print?.();
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  const rows = [];
  for (let i = 1; i <= count; i++) {
    rows.push({
      id: i,
      label: i === 1 ? "Person 1 (Host)" : `Person ${i} (Guest)`,
      base: baseShare,
      tip: tipContribution,
      total: totalOwed,
      status: statuses[i] || (i === 1 ? "Paid" : "Pending"),
    });
  }

  return (
    <div
      className="bg-white border border-[#e3e8f0] border-solid flex flex-col gap-4 p-6 rounded-[14px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] w-full"
      data-node-id="1:108"
      data-name="Card"
    >
      <div className="flex flex-col gap-1 border-b border-[#e3e8f0] pb-3">
        <h2 className="font-bold text-[#171c29] text-lg" data-node-id="1:109">
          Detailed Bill Split Breakdown
        </h2>
        <p className="font-normal text-[#707a8c] text-sm" data-node-id="1:102">
          Bill Total: ${Number(billAmount).toFixed(2)} | Tip Rate:{" "}
          {Number(tipPercentage).toFixed(1)}% | {count}{" "}
          {count === 1 ? "Person" : "People"}
        </p>
      </div>

      {/* Table */}
      <div
        className="bg-white border border-[#e3e8f0] border-solid flex flex-col overflow-x-auto rounded-[10px] text-sm w-full"
        data-node-id="1:83"
        data-name="Table"
      >
        <div
          className="bg-[#f7fafc] border-b border-[#e3e8f0] grid grid-cols-5 gap-3 p-3 text-xs font-semibold uppercase tracking-wider text-[#707a8c]"
          data-node-id="1:84"
          data-name="Header"
        >
          <div>Person</div>
          <div>Base Bill Share</div>
          <div>Tip ({Number(tipPercentage).toFixed(0)}%)</div>
          <div>Total Owed</div>
          <div>Status</div>
        </div>

        <div className="divide-y divide-[#e3e8f0]">
          {rows.map((row) => {
            const isPaid = row.status === "Paid";
            return (
              <div
                key={row.id}
                className="grid grid-cols-5 gap-3 p-3 items-center text-[#171c29] hover:bg-[#f2f5fa]/50 transition-colors"
                data-node-id={`1:row-${row.id}`}
                data-name="Row"
              >
                <div className="font-medium text-[#171c29]">{row.label}</div>
                <div className="text-[#707a8c]">${row.base.toFixed(2)}</div>
                <div className="text-[#707a8c]">${row.tip.toFixed(2)}</div>
                <div className="font-bold text-[#2663eb]">
                  ${row.total.toFixed(2)}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => toggleStatus(row.id)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                      isPaid
                        ? "bg-[#17a34a] text-white hover:bg-[#15803d]"
                        : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                    }`}
                  >
                    {row.status}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notification toast */}
      {copied && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-3 py-2 rounded-lg">
          ✓ Link copied to clipboard!
        </div>
      )}
      {exported && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 text-xs px-3 py-2 rounded-lg">
          ✓ Exporting breakdown summary...
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-2" data-name="Box">
        <button
          type="button"
          onClick={handleShareLink}
          className="bg-[#2663eb] hover:bg-[#1d4ed8] text-white font-medium text-sm py-2.5 px-5 rounded-[10px] transition-all shadow-sm"
          data-node-id="1:103"
        >
          Share Payment Link
        </button>
        <button
          type="button"
          onClick={handleExportSummary}
          className="bg-white border border-[#e3e8f0] hover:bg-[#f2f5fa] text-[#171c29] font-medium text-sm py-2.5 px-5 rounded-[10px] transition-all"
          data-node-id="1:105"
        >
          Export PDF Summary
        </button>
      </div>
    </div>
  );
}
