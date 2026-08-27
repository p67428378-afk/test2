import React, { useState } from "react";
import Navbar from "../components/Navbar";
import DetailedSplitBreakdownTable from "../components/DetailedSplitBreakdownTable";
import CalculationSummaryCard from "../components/CalculationSummaryCard";

export default function TipCalculatorDetailedSplitBreakdownView() {
  const [billAmount] = useState(() => {
    const saved = localStorage.getItem("tip_bill_amount");
    return saved !== null ? Number(saved) : 120.0;
  });

  const [tipPercentage] = useState(() => {
    const saved = localStorage.getItem("tip_percentage");
    return saved !== null ? Number(saved) : 15.0;
  });

  const [numPeople] = useState(() => {
    const saved = localStorage.getItem("tip_num_people");
    return saved !== null ? Number(saved) : 2;
  });

  const [results] = useState(() => {
    const saved = localStorage.getItem("tip_results");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return {
      total_tip: 18.0,
      total_bill: 138.0,
      tip_per_person: 9.0,
      total_per_person: 69.0,
    };
  });

  return (
    <div
      className="min-h-screen bg-[#f7fafc] flex flex-col p-6 md:p-8"
      data-node-id="1:73"
      data-name="Tip Calculator - Detailed Split Breakdown View"
    >
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-6">
        <Navbar />

        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          data-node-id="1:130"
          data-name="SplitLayout"
        >
          {/* Main Table Column (7 cols on lg) */}
          <div
            className="lg:col-span-7"
            data-node-id="1:131"
            data-name="MainColumn"
          >
            <DetailedSplitBreakdownTable
              billAmount={billAmount}
              tipPercentage={tipPercentage}
              numPeople={numPeople}
              results={results}
            />
          </div>

          {/* Side Summary Column (5 cols on lg) */}
          <div
            className="lg:col-span-5"
            data-node-id="1:132"
            data-name="SideColumn"
          >
            <CalculationSummaryCard
              results={results}
              billAmount={billAmount}
              tipPercentage={tipPercentage}
              numPeople={numPeople}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
