import React from "react";
import { Calendar } from "lucide-react";

export default function MonthFilter({
  selectedMonth = "",
  onChange,
  availableMonths = [],
}) {
  // Generate default month options if none provided (e.g. last 12 months)
  const defaultMonths = React.useMemo(() => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const monthNum = String(d.getMonth() + 1).padStart(2, "0");
      const val = `${year}-${monthNum}`;
      const monthName = d.toLocaleString("default", { month: "long" });
      const label = `${monthName} ${year} (${val})`;
      options.push({ val, label });
    }
    return options;
  }, []);

  const monthsToDisplay =
    availableMonths.length > 0
      ? availableMonths.map((m) =>
          typeof m === "string"
            ? {
                val: m,
                label: `${new Date(m + "-01T00:00:00").toLocaleString(
                  "default",
                  {
                    month: "long",
                    year: "numeric",
                  },
                )} (${m})`,
              }
            : m,
        )
      : defaultMonths;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative inline-flex items-center">
        <Calendar className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <select
          aria-label="Filter expenses by month"
          value={selectedMonth || "all"}
          onChange={(e) => {
            const val = e.target.value;
            onChange(val === "all" ? "" : val);
          }}
          className="pl-9 pr-8 py-2 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg text-sm font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer shadow-sm"
        >
          <option value="all">All Months</option>
          {monthsToDisplay.map((opt) => (
            <option key={opt.val} value={opt.val}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {selectedMonth && selectedMonth !== "all" && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors shadow-sm"
        >
          Clear Month Filter
        </button>
      )}
    </div>
  );
}
