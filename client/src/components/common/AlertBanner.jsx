import React from "react";
import { AlertTriangle, Clock, ArrowRight } from "lucide-react";

export default function AlertBanner({ expiringCount, onViewExpiring }) {
  if (!expiringCount || expiringCount <= 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-900 flex items-center">
            <Clock className="h-4 w-4 mr-1 text-amber-600" />
            {expiringCount} {expiringCount === 1 ? "Warranty" : "Warranties"}{" "}
            Expiring Soon!
          </h4>
          <p className="text-xs text-amber-700 mt-0.5">
            You have warranties expiring within 30 days. Review them now to
            ensure timely claims or renewal.
          </p>
        </div>
      </div>
      {onViewExpiring && (
        <button
          onClick={onViewExpiring}
          className="inline-flex items-center px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap"
        >
          View Expiring
          <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </button>
      )}
    </div>
  );
}
