import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getScenarios } from "../services/api";
import ScenarioCard from "../components/assortment/ScenarioCard";

export default function ScenarioComparisonPage({
  selectedScenario,
  setSelectedScenario,
}) {
  const navigate = useNavigate();
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const data = await getScenarios();
        setScenarios(data);

        // Pre-select Balanced scenario if none is selected yet
        if (!selectedScenario && data.length > 0) {
          const balanced =
            data.find((s) => s.name.toLowerCase() === "balanced") ||
            data[1] ||
            data[0];
          setSelectedScenario(balanced);
        }
      } catch (error) {
        console.error("Error fetching scenarios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchScenarios();
  }, [selectedScenario, setSelectedScenario]);

  const handleSelectScenario = (scenario) => {
    setSelectedScenario(scenario);
  };

  const handleProceed = () => {
    navigate("/review");
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary-fixed-dim">
            sync
          </span>
          <span className="text-on-surface-variant text-sm">
            Loading scenarios...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface tracking-tight">
            Scenario Comparison
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Compare side-by-side options to optimize Snacks assortment.
          </p>
        </div>
        <div>
          <button
            onClick={handleProceed}
            disabled={!selectedScenario}
            className="px-6 py-2.5 bg-primary-container text-[#000000] text-sm font-bold rounded flex items-center gap-2 hover:bg-primary transition-colors active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_15px_rgba(255,209,0,0.15)]"
          >
            <span>Proceed to Review</span>
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Scenario Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            isSelected={selectedScenario?.id === scenario.id}
            onSelect={() => handleSelectScenario(scenario)}
          />
        ))}
      </div>

      {/* Selected Scenario Summary Banner */}
      {selectedScenario && (
        <div className="glass-panel rounded-lg p-6 border border-primary-fixed-dim/30 bg-surface-container-high flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-primary-fixed-dim font-bold uppercase tracking-wider bg-primary-container/10 px-2 py-0.5 rounded border border-primary-fixed-dim/20">
                Currently Selected
              </span>
              <h4 className="text-lg font-bold text-on-surface">
                {selectedScenario.name} Scenario
              </h4>
            </div>
            <p className="text-sm text-on-surface-variant mt-1">
              {selectedScenario.description}
            </p>
          </div>
          <button
            onClick={handleProceed}
            className="px-6 py-2.5 bg-primary-container text-[#000000] text-sm font-bold rounded flex items-center gap-2 hover:bg-primary transition-colors active:scale-95 shadow-[0_0_15px_rgba(255,209,0,0.15)] shrink-0"
          >
            <span>Review & Submit</span>
            <span className="material-symbols-outlined text-[18px]">
              fact_check
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
