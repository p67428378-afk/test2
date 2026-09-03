import React, { useState, useEffect } from "react";
import { Clock, AlertCircle } from "lucide-react";

export default function HoldBanner({ holdExpiresAt, selectedSlotDate }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!holdExpiresAt) {
      // Default fallback 15-min countdown for visual showcase
      setTimeLeft("11:24");
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expires = new Date(holdExpiresAt).getTime();
      const diff = expires - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
      } else {
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [holdExpiresAt]);

  return (
    <div className="p-4 bg-amber-50 border border-amber-300 text-amber-900 rounded-lg mb-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <Clock className="w-5 h-5 text-amber-700 animate-pulse flex-shrink-0" />
        <div>
          <span className="font-bold text-sm">
            ⏱ 15-Minute Slot Hold Active:
          </span>
          <span className="text-sm ml-1 text-amber-800">
            {selectedSlotDate || "Saturday, June 20 @ 2:00 PM"} is temporarily
            reserved. Deposit checkout expires in{" "}
            <strong className="font-mono font-bold underline">
              {timeLeft}
            </strong>
            .
          </span>
        </div>
      </div>
      <div className="text-xs text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded font-medium hidden sm:block">
        Hold Grace Period
      </div>
    </div>
  );
}
