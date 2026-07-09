import React from "react";
import { ShieldCheck, AlertTriangle, Sparkles, Calendar } from "lucide-react";

export default function ScenarioSelector({
  selectedScenario,
  onSelect,
  projections,
  loading,
}) {
  const scenarios = [
    {
      type: "Conservative",
      title: "Conservative Scenario",
      desc: "Focuses on high-turnover national brands with minimal risk.",
      icon: ShieldCheck,
      color: "border-green-500 ring-green-500 text-green-600 bg-green-50",
    },
    {
      type: "Balanced",
      title: "Balanced Scenario",
      desc: "Optimizes private brand mix while maintaining core national SKUs.",
      icon: Sparkles,
      color: "border-blue-500 ring-blue-500 text-blue-600 bg-blue-50",
    },
    {
      type: "Aggressive",
      title: "Aggressive Scenario",
      desc: "Maximizes private brand penetration and seasonal trend capture.",
      icon: AlertTriangle,
      color: "border-purple-500 ring-purple-500 text-purple-600 bg-purple-50",
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-base font-bold text-gray-900 mb-4">
        Scenario Comparison & Projections
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scenarios.map((sc) => {
          const Icon = sc.icon;
          const isSelected = selectedScenario === sc.type;
          const proj = projections[sc.type];

          return (
            <div
              key={sc.type}
              onClick={() => onSelect(sc.type)}
              className={`cursor-pointer bg-white rounded-lg border-2 p-5 transition-all duration-150 flex flex-col justify-between hover:shadow-md ${
                isSelected
                  ? `${sc.color.split(" ")[0]} ring-2 ${sc.color.split(" ")[1]} shadow-sm`
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-900">
                    {sc.title}
                  </h3>
                  <div
                    className={`p-1.5 rounded-md ${isSelected ? sc.color.split(" ")[3] : "bg-gray-100 text-gray-500"}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-medium mb-4 leading-relaxed">
                  {sc.desc}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2.5 text-xs font-semibold text-gray-600">
                <div className="flex justify-between">
                  <span>Projected Sales Lift:</span>
                  {loading ? (
                    <span className="h-4 w-10 bg-gray-200 animate-pulse rounded"></span>
                  ) : (
                    <span className="text-gray-900 font-bold">
                      +{proj?.projected_sales_lift || 0}%
                    </span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>Private Brand Mix:</span>
                  {loading ? (
                    <span className="h-4 w-10 bg-gray-200 animate-pulse rounded"></span>
                  ) : (
                    <span className="text-gray-900 font-bold">
                      {proj?.projected_private_brand_pct || 0}%
                    </span>
                  )}
                </div>

                {/* Holiday Lift % impact metric for Aggressive scenario */}
                {sc.type === "Aggressive" && (
                  <div className="flex justify-between items-center bg-purple-50 text-purple-800 px-2 py-1.5 rounded border border-purple-100 mt-2">
                    <span className="flex items-center font-bold">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-purple-600" />
                      Holiday Lift %:
                    </span>
                    {loading ? (
                      <span className="h-4 w-10 bg-purple-200 animate-pulse rounded"></span>
                    ) : (
                      <span className="font-extrabold text-purple-900">
                        +{proj?.holiday_lift_pct || 12.5}%
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
