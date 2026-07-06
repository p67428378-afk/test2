import React from "react";
import { Store, CreditCard, Clock } from "lucide-react";

export default function TransactionDetails({ transaction }) {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="p-md bg-[#0F172A]/50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {/* Column 1 */}
        <div className="space-y-md">
          <div>
            <div className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-1">
              Merchant
            </div>
            <div className="text-body-lg font-body-lg font-medium text-on-surface flex items-center gap-xs">
              <Store className="w-5 h-5 text-outline" />
              <span>{transaction.merchant_name}</span>
            </div>
          </div>
          <div>
            <div className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-1">
              Date & Time
            </div>
            <div className="text-body-md font-body-md text-on-surface">
              {formatDate(transaction.created_at)}
            </div>
          </div>
          <div>
            <div className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-1">
              Payment Method
            </div>
            <div className="flex items-center gap-xs text-body-md font-body-md text-on-surface">
              <CreditCard className="w-5 h-5 text-outline" />
              <span>Premier Visa Debit (*4321)</span>
            </div>
          </div>
        </div>
        {/* Column 2 */}
        <div className="space-y-md md:text-right flex flex-col md:items-end justify-between">
          <div>
            <div className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-1">
              Transaction Amount
            </div>
            <div className="text-amount-display font-amount-display text-primary-fixed drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              {formatAmount(transaction.amount)}
            </div>
          </div>
          <div>
            <div className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-2">
              Current Status
            </div>
            <div className="inline-flex items-center gap-xs px-sm py-xs rounded-sm bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-[#F59E0B] font-label-md text-label-md uppercase">
              <Clock className="w-4 h-4" />
              <span>{transaction.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
