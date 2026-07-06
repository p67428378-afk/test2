import React from "react";
import { ShieldAlert, Timer } from "lucide-react";

export default function VerificationCard({ children, timeLeft }) {
  return (
    <div className="w-full max-w-3xl bg-[#1E293B] border border-[#334155] rounded-xl shadow-[0_0_40px_rgba(16,185,129,0.03)] hover:border-[#475569] transition-colors duration-300 overflow-hidden flex flex-col">
      {/* Card Header / Alert Section */}
      <div className="p-md border-b border-[#334155] bg-surface-container-highest/30 relative">
        {/* Security Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-tertiary to-transparent opacity-50"></div>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-md">
          <div className="flex gap-sm">
            <div className="mt-1 flex-shrink-0 w-12 h-12 rounded-full bg-tertiary-container/10 flex items-center justify-center border border-tertiary-container/20 text-tertiary">
              <ShieldAlert className="w-[28px] h-[28px]" />
            </div>
            <div>
              <h1 className="text-headline-md font-headline-md text-on-surface mb-2">
                Security Alert: High-Value Transaction Verification
              </h1>
              <p className="text-on-surface-variant text-body-md font-body-md leading-relaxed max-w-xl">
                A transaction exceeding your $2,000.00 threshold has been
                initiated on your Premier Debit Card ending in *4321. Please
                verify this activity within 10 minutes.
              </p>
            </div>
          </div>
          {/* Timer */}
          {timeLeft !== null && (
            <div className="flex-shrink-0 flex items-center gap-xs px-sm py-xs rounded-full bg-tertiary-container/15 border border-tertiary-container/30 text-tertiary font-label-md text-label-md animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.1)]">
              <Timer className="w-[18px] h-[18px]" />
              <span className="tracking-widest">{timeLeft} remaining</span>
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
