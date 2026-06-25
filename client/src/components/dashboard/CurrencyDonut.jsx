import React from "react";

export default function CurrencyDonut({ distribution, loading }) {
  if (loading) {
    return (
      <div className="bg-surface-container-low border border-outline-variant rounded-lg p-lg flex flex-col min-h-[360px] animate-pulse" />
    );
  }

  const total =
    distribution && distribution.length > 0
      ? distribution.reduce((sum, item) => sum + item.amount, 0)
      : 0;
  const colors = ["#c0c1ff", "#7bd0ff", "#4edea3", "#908fa0"];

  return (
    <div className="lg:col-span-4 bg-surface-container-low border border-outline-variant rounded-lg p-lg flex flex-col min-h-[360px]">
      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-lg">
        Cash Distribution by Currency
      </h3>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div
          className="w-48 h-48 rounded-full border-[16px] border-surface-container-highest relative flex items-center justify-center mb-lg"
          style={{
            borderTopColor: "#c0c1ff",
            borderRightColor: "#c0c1ff",
            borderBottomColor: "#7bd0ff",
            borderLeftColor: "#4edea3",
            transform: "rotate(-45deg)",
          }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: "rotate(45deg)" }}
          >
            <div className="text-center">
              <span className="block font-label-caps text-on-surface-variant">
                TOTAL
              </span>
              <span className="font-headline-md text-on-surface font-mono">
                ${(total / 1e6).toFixed(1)}M
              </span>
            </div>
          </div>
        </div>
        <div className="w-full space-y-sm">
          {distribution &&
            distribution.map((item, idx) => {
              const percent =
                total > 0 ? ((item.amount / total) * 100).toFixed(0) : 0;
              return (
                <div
                  key={item.currency}
                  className="flex justify-between items-center text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors[idx % colors.length] }}
                    />
                    <span className="text-on-surface">{item.currency}</span>
                  </div>
                  <span className="text-on-surface-variant font-mono">
                    {percent}%
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
