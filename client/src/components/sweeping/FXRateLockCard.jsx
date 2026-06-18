import React, { useState, useEffect } from "react";
import { Shield, Clock, CheckCircle, AlertTriangle } from "lucide-react";

const FXRateLockCard = ({ workflowDetails, onRefresh }) => {
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    if (!workflowDetails) return;
    setTimeLeft(workflowDetails.rate_lock_seconds || 120);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onRefresh) onRefresh();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [workflowDetails, onRefresh]);

  if (!workflowDetails) {
    return (
      <div className="bento-card p-6 rounded-xl flex items-center justify-center text-on-surface-variant">
        Select a rule to view real-time FX rate lock details.
      </div>
    );
  }

  const { fx_rate, hedging_strategy, local_limit_compliant, amount } =
    workflowDetails;

  return (
    <div className="bento-card p-6 rounded-xl relative overflow-hidden">
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-accent opacity-5 blur-[100px]"></div>
      <h4 className="text-headline-sm font-headline-sm mb-4 relative flex items-center gap-2">
        <Shield className="text-indigo-accent w-5 h-5" />
        FX Rate Lock & Compliance
      </h4>

      <div className="space-y-4 relative">
        <div className="flex justify-between items-center bg-surface-container-lowest p-4 rounded-lg border border-outline-variant">
          <div>
            <p className="text-label-md font-bold">Real-Time FX Rate</p>
            <p className="text-2xl font-bold text-indigo-accent">
              1 {hedging_strategy === "spot" ? "CAD" : "CAD (Forward)"} ={" "}
              {fx_rate} USD
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-yellow-400 bg-yellow-900/20 px-2.5 py-1 rounded-lg text-sm font-bold">
            <Clock className="w-4 h-4" />
            <span>{timeLeft}s Lock</span>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-lg border border-outline-variant">
          {local_limit_compliant ? (
            <CheckCircle className="text-green-400 w-6 h-6 shrink-0" />
          ) : (
            <AlertTriangle className="text-red-400 w-6 h-6 shrink-0" />
          )}
          <div>
            <p className="text-label-md font-bold">Local Capital Compliance</p>
            <p className="text-xs text-on-surface-variant">
              {local_limit_compliant
                ? "Compliant. Subsidiary maintains required minimum capital buffer."
                : "NON-COMPLIANT. Sweep would breach local regulatory capital limits."}
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant">
          <p className="text-label-md font-bold mb-1">Estimated Sweep Amount</p>
          <p className="text-xl font-bold text-on-surface">
            ${amount.toLocaleString()} USD
          </p>
        </div>
      </div>
    </div>
  );
};

export default FXRateLockCard;
