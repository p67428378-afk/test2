import React from "react";
import Button from "../common/Button.jsx";

export default function ActiveAlertBanner({
  alert,
  onApprove,
  onBlock,
  isProcessing,
}) {
  if (!alert) return null;

  return (
    <div className="glass-panel rounded-xl border border-[#EF4444]/50 bg-gradient-to-r from-[#1E293B] to-[#EF4444]/10 p-6 md:p-8 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between alert-glow relative overflow-hidden">
      {/* Glitch/Danger abstract background texture */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)",
          backgroundPosition: "0 0, 10px 10px",
          backgroundSize: "20px 20px",
        }}
      ></div>

      <div className="flex items-start gap-4 relative z-10">
        <div className="w-12 h-12 rounded-full bg-[#EF4444]/20 flex items-center justify-center border border-[#EF4444]/40 flex-shrink-0 mt-1">
          <span
            className="material-symbols-outlined text-[#EF4444] text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            error
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
              ACTION REQUIRED
            </h3>
            <span className="bg-[#EF4444]/20 text-[#EF4444] font-mono-data text-xs px-3 py-1 rounded-full border border-[#EF4444]/30 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">
                timer
              </span>{" "}
              04:12
            </span>
          </div>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Transaction of{" "}
            <strong className="text-on-surface">
              ${Number(alert.amount).toFixed(2)}
            </strong>{" "}
            at <strong class="text-on-surface">{alert.merchant}</strong> is
            pending your approval.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto relative z-10">
        <Button
          variant="primary"
          onClick={() => onApprove(alert)}
          disabled={isProcessing}
          className="w-full sm:w-auto"
        >
          <span className="material-symbols-outlined text-[18px]">
            check_circle
          </span>
          {isProcessing ? "Processing..." : "Approve Transaction"}
        </Button>
        <Button
          variant="danger"
          onClick={() => onBlock(alert)}
          disabled={isProcessing}
          className="w-full sm:w-auto"
        >
          <span className="material-symbols-outlined text-[18px]">block</span>
          {isProcessing ? "Processing..." : "Block & Freeze Card"}
        </Button>
      </div>
    </div>
  );
}
