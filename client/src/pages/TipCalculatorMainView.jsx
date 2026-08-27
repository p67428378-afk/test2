import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import BillTipInputCard from "../components/BillTipInputCard";
import CalculationSummaryCard from "../components/CalculationSummaryCard";
import { tipCalculatorService } from "../services/api";

export default function TipCalculatorMainView() {
  const [billAmount, setBillAmount] = useState(() => {
    const saved = localStorage.getItem("tip_bill_amount");
    return saved !== null ? Number(saved) : 120.0;
  });

  const [tipPercentage, setTipPercentage] = useState(() => {
    const saved = localStorage.getItem("tip_percentage");
    return saved !== null ? Number(saved) : 15.0;
  });

  const [isCustomTip, setIsCustomTip] = useState(() => {
    const saved = localStorage.getItem("tip_is_custom");
    return saved === "true";
  });

  const [numPeople, setNumPeople] = useState(() => {
    const saved = localStorage.getItem("tip_num_people");
    return saved !== null ? Number(saved) : 2;
  });

  const [results, setResults] = useState(() => {
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("tip_bill_amount", billAmount.toString());
    localStorage.setItem("tip_percentage", tipPercentage.toString());
    localStorage.setItem("tip_is_custom", isCustomTip.toString());
    localStorage.setItem("tip_num_people", numPeople.toString());
    if (results) {
      localStorage.setItem("tip_results", JSON.stringify(results));
    }
  }, [billAmount, tipPercentage, isCustomTip, numPeople, results]);

  const handleCalculate = async () => {
    setError("");

    const parsedBill = Number(billAmount);
    const parsedTip = Number(tipPercentage);
    const parsedPeople = Number(numPeople);

    if (isNaN(parsedBill) || parsedBill <= 0) {
      setError(
        "Please enter a valid positive bill amount (greater than $0.00).",
      );
      return;
    }

    if (isNaN(parsedTip) || parsedTip < 0 || parsedTip > 100) {
      setError("Tip percentage must be between 0% and 100%.");
      return;
    }

    if (
      isNaN(parsedPeople) ||
      parsedPeople < 1 ||
      !Number.isInteger(parsedPeople)
    ) {
      setError(
        "Number of people splitting must be a whole number of at least 1.",
      );
      return;
    }

    setLoading(true);
    try {
      const data = await tipCalculatorService.calculateTip({
        bill_amount: parsedBill,
        tip_percentage: parsedTip,
        num_people: parsedPeople,
      });
      setResults(data);
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail?.[0]?.msg ||
        err.response?.data?.detail ||
        "Failed to calculate tip. Please verify backend connection and inputs.";
      setError(
        typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBillAmount(120.0);
    setTipPercentage(15.0);
    setIsCustomTip(false);
    setNumPeople(2);
    setResults({
      total_tip: 18.0,
      total_bill: 138.0,
      tip_per_person: 9.0,
      total_per_person: 69.0,
    });
    setError("");
    localStorage.removeItem("tip_bill_amount");
    localStorage.removeItem("tip_percentage");
    localStorage.removeItem("tip_is_custom");
    localStorage.removeItem("tip_num_people");
    localStorage.removeItem("tip_results");
  };

  return (
    <div
      className="min-h-screen bg-[#f7fafc] flex flex-col p-6 md:p-8"
      data-node-id="1:3"
      data-name="Tip Calculator - Main View"
    >
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-6">
        <Navbar />

        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
          data-node-id="1:70"
          data-name="SplitLayout"
        >
          {/* Main Left Column */}
          <div data-node-id="1:71" data-name="MainColumn">
            <BillTipInputCard
              billAmount={billAmount}
              setBillAmount={setBillAmount}
              tipPercentage={tipPercentage}
              setTipPercentage={setTipPercentage}
              isCustomTip={isCustomTip}
              setIsCustomTip={setIsCustomTip}
              numPeople={numPeople}
              setNumPeople={setNumPeople}
              onCalculate={handleCalculate}
              onReset={handleReset}
              loading={loading}
              error={error}
            />
          </div>

          {/* Side Right Column */}
          <div data-node-id="1:72" data-name="SideColumn">
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
