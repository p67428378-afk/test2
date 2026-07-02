import React from "react";

const POPULAR_PLANS = [
  {
    id: 1,
    amount: 199,
    validity: "28 Days",
    data: "1.5 GB/Day",
    desc: "Unlimited Calls + 100 SMS/Day",
  },
  {
    id: 2,
    amount: 299,
    validity: "28 Days",
    data: "2.0 GB/Day",
    desc: "Unlimited Calls + 100 SMS/Day + Prime Video Mobile",
  },
  {
    id: 3,
    amount: 479,
    validity: "56 Days",
    data: "1.5 GB/Day",
    desc: "Unlimited Calls + 100 SMS/Day",
  },
  {
    id: 4,
    amount: 666,
    validity: "84 Days",
    data: "1.5 GB/Day",
    desc: "Unlimited Calls + 100 SMS/Day + Disney+ Hotstar",
  },
  {
    id: 5,
    amount: 719,
    validity: "84 Days",
    data: "2.0 GB/Day",
    desc: "Unlimited Calls + 100 SMS/Day",
  },
  {
    id: 6,
    amount: 2999,
    validity: "365 Days",
    data: "2.5 GB/Day",
    desc: "Annual Plan with Unlimited Calls & 100 SMS/Day",
  },
];

export default function PlanGrid({ onSelectPlan }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Popular Recharge Plans
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {POPULAR_PLANS.map((plan) => (
          <div
            key={plan.id}
            onClick={() => onSelectPlan(plan.amount)}
            className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:bg-primary-50/30 cursor-pointer transition-all flex flex-col justify-between gap-3 group"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-2xl font-extrabold text-gray-900">
                  ₹{plan.amount}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  validity: {plan.validity}
                </span>
              </div>
              <span className="text-xs font-semibold bg-primary-100 text-primary-800 px-2 py-1 rounded">
                {plan.data}
              </span>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2">{plan.desc}</p>
            <button
              type="button"
              className="w-full text-center text-xs font-bold text-primary-600 group-hover:text-primary-700 mt-1"
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
