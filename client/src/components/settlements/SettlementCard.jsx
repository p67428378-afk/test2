import React, { useState } from "react";
import { ArrowRight, CheckCircle2, DollarSign } from "lucide-react";
import Badge from "../common/Badge";

export default function SettlementCard({ settlement, onSettle }) {
  const [settled, setSettled] = useState(false);

  const { from_member, to_member, amount } = settlement;

  const handleSettle = () => {
    setSettled(true);
    if (onSettle) {
      onSettle(settlement);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(val) || 0);
  };

  return (
    <div
      className={`border rounded-xl p-4 transition-all ${
        settled
          ? "bg-gray-50/80 border-gray-200 opacity-75"
          : "bg-white border-[#E3E8F0] hover:shadow-md"
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Transfer Participants Flow */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Debtor */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center shrink-0">
              {from_member?.substring(0, 2).toUpperCase() || "DB"}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#171C29]">
                {from_member}
              </p>
              <p className="text-[11px] text-[#707A8C]">Pays / Owes</p>
            </div>
          </div>

          {/* Flow Arrow */}
          <div className="flex flex-col items-center px-2">
            <ArrowRight className="w-4 h-4 text-blue-600" />
            <span className="text-[10px] text-[#707A8C] font-medium">
              transfer
            </span>
          </div>

          {/* Creditor */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold text-xs flex items-center justify-center shrink-0">
              {to_member?.substring(0, 2).toUpperCase() || "CR"}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#171C29]">
                {to_member}
              </p>
              <p className="text-[11px] text-[#707A8C]">Receives</p>
            </div>
          </div>
        </div>

        {/* Transfer Amount & Action */}
        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
          <div className="text-left sm:text-right">
            <p className="text-base sm:text-lg font-bold text-[#171C29]">
              {formatCurrency(amount)}
            </p>
            <p className="text-[11px] text-[#707A8C]">
              {from_member} owes {to_member}
            </p>
          </div>

          <div>
            {settled ? (
              <Badge variant="success" size="md">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Settled
              </Badge>
            ) : (
              <button
                type="button"
                onClick={handleSettle}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
              >
                <DollarSign className="w-3.5 h-3.5" />
                Mark as Paid
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
