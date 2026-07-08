import React, { useState } from "react";

export default function ImpactCalculator() {
  const [dailyPurchases, setDailyPurchases] = useState(3);
  const [avgRoundup, setRoundup] = useState(0.45);

  const monthlySavings = dailyPurchases * avgRoundup * 30;
  const yearlySavings = monthlySavings * 12;
  const tenYearSavings = yearlySavings * 10 * 1.07; // assuming 7% compound growth roughly

  return (
    <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5 flex flex-col gap-4">
      <h2 className="font-headline-md text-headline-md text-on-surface text-lg">
        Passive Impact Calculator
      </h2>
      <p className="text-on-surface-variant text-sm">
        See how small change builds up over time with compound growth.
      </p>

      <div className="space-y-4 my-2">
        <div>
          <label className="flex justify-between text-sm text-on-surface-variant mb-1">
            <span>Daily Purchases</span>
            <span className="font-semibold text-on-surface">
              {dailyPurchases} purchases
            </span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={dailyPurchases}
            onChange={(e) => setDailyPurchases(Number(e.target.value))}
            className="w-full accent-primary bg-surface-variant h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label className="flex justify-between text-sm text-on-surface-variant mb-1">
            <span>Average Round-Up</span>
            <span className="font-semibold text-on-surface">
              ${avgRoundup.toFixed(2)}
            </span>
          </label>
          <input
            type="range"
            min="0.10"
            max="0.99"
            step="0.05"
            value={avgRoundup}
            onChange={(e) => setRoundup(Number(e.target.value))}
            className="w-full accent-primary bg-surface-variant h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-outline-variant/50 text-center">
        <div>
          <span className="block text-[10px] uppercase tracking-wider text-on-surface-variant">
            Monthly
          </span>
          <span
            className="text-lg font-bold text-primary"
            data-testid="calc-monthly"
          >
            ${monthlySavings.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="block text-[10px] uppercase tracking-wider text-on-surface-variant">
            Yearly
          </span>
          <span className="text-lg font-bold text-primary">
            ${yearlySavings.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="block text-[10px] uppercase tracking-wider text-on-surface-variant">
            10 Years (7% ROI)
          </span>
          <span className="text-lg font-bold text-secondary">
            ${tenYearSavings.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
