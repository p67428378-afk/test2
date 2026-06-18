import React, { useState, useEffect } from "react";
import { Settings, Save, AlertCircle } from "lucide-react";

const ParameterAdjustmentsCard = ({ rule, onAdjust }) => {
  const [threshold, setThreshold] = useState("");
  const [fxStrategy, setFxStrategy] = useState("spot");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (rule) {
      setThreshold(rule.threshold.toString());
      setFxStrategy(rule.fx_strategy);
    }
  }, [rule]);

  if (!rule) {
    return (
      <div className="bento-card p-6 rounded-xl flex items-center justify-center text-on-surface-variant">
        Select a rule to adjust parameters.
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const parsedThreshold = parseFloat(threshold);
    if (isNaN(parsedThreshold) || parsedThreshold <= 0) {
      setError("Threshold must be a positive number");
      return;
    }

    try {
      await onAdjust(rule.id, {
        fx_strategy: fxStrategy,
        threshold: parsedThreshold,
      });
      setSuccess("Parameters adjusted successfully!");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to adjust parameters");
    }
  };

  return (
    <div className="bento-card p-6 rounded-xl">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="text-indigo-accent w-6 h-6" />
        <h3 className="text-headline-sm font-headline-sm">Adjust Parameters</h3>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-error-container text-error rounded-lg flex items-center gap-2 text-body-md">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-900/20 text-green-400 rounded-lg flex items-center gap-2 text-body-md">
          <Save className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-label-md font-label-md text-on-surface-variant mb-1.5">
            Target Balance Threshold
          </label>
          <input
            className="w-full bg-surface-container-low border border-outline-variant rounded py-2 px-3 text-body-md focus:ring-2 focus:ring-indigo-accent focus:outline-none"
            type="text"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-label-md font-label-md text-on-surface-variant mb-1.5">
            FX Hedging Strategy
          </label>
          <select
            className="w-full bg-surface-container-low border border-outline-variant rounded py-2 px-3 text-body-md focus:ring-2 focus:ring-indigo-accent focus:outline-none"
            value={fxStrategy}
            onChange={(e) => setFxStrategy(e.target.value)}
          >
            <option value="spot">Spot Rate</option>
            <option value="forward">24h Forward Contract</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-accent hover:bg-opacity-90 text-white font-label-md py-2.5 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Parameters
        </button>
      </form>
    </div>
  );
};

export default ParameterAdjustmentsCard;
