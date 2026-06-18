import React, { useState } from "react";
import { PlusCircle, Bolt, AlertCircle } from "lucide-react";

const CreateRuleForm = ({ onRuleCreated }) => {
  const [name, setName] = useState("");
  const [selectedSources, setSelectedSources] = useState([
    "CAD-SUB-001",
    "MXN-SUB-001",
  ]);
  const [targetAccount, setTargetAccount] = useState("USD-CENTRAL-001");
  const [frequency, setFrequency] = useState("Daily");
  const [threshold, setThreshold] = useState("100000");
  const [fxStrategy, setFxStrategy] = useState("spot");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sourceOptions = [
    { value: "CAD-SUB-001", label: "Canada Sub (CAD-SUB-001)" },
    { value: "MXN-SUB-001", label: "Mexico Sub (MXN-SUB-001)" },
    { value: "HIGH-RISK-SUB-001", label: "High-Risk Sub (HIGH-RISK-SUB-001)" },
  ];

  const targetOptions = [
    { value: "USD-CENTRAL-001", label: "US Central (USD-CENTRAL-001)" },
  ];

  const handleSourceToggle = (source) => {
    if (selectedSources.includes(source)) {
      setSelectedSources(selectedSources.filter((s) => s !== source));
    } else {
      setSelectedSources([...selectedSources, source]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Rule name is required");
      return;
    }

    if (selectedSources.length === 0) {
      setError("At least one source account must be selected");
      return;
    }

    const parsedThreshold = parseFloat(threshold);
    if (isNaN(parsedThreshold) || parsedThreshold <= 0) {
      setError("Threshold must be a positive number");
      return;
    }

    try {
      await onRuleCreated({
        name,
        source_accounts: selectedSources,
        target_account: targetAccount,
        threshold: parsedThreshold,
        frequency,
        fx_strategy: fxStrategy,
      });
      setSuccess("Rule created successfully!");
      setName("");
      setThreshold("100000");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create rule");
    }
  };

  return (
    <div className="bento-card p-6 pb-8 rounded-xl">
      <div className="flex items-center gap-2 mb-6">
        <PlusCircle className="text-indigo-accent w-6 h-6" />
        <h3 className="text-headline-sm font-headline-sm">
          Create Sweeping Rule
        </h3>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-error-container text-error rounded-lg flex items-center gap-2 text-body-md">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-900/20 text-green-400 rounded-lg flex items-center gap-2 text-body-md">
          <PlusCircle className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-label-md font-label-md text-on-surface-variant mb-1.5">
            Rule Name
          </label>
          <input
            className="w-full bg-surface-container-low border border-outline-variant rounded py-2 px-3 text-body-md focus:ring-2 focus:ring-indigo-accent focus:outline-none"
            placeholder="e.g., Monthly Euro Consolidation"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-label-md font-label-md text-on-surface-variant mb-1.5">
            Source Accounts
          </label>
          <div className="flex flex-col gap-2 p-2 bg-surface-container-low border border-outline-variant rounded max-h-[120px] overflow-y-auto">
            {sourceOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-body-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedSources.includes(opt.value)}
                  onChange={() => handleSourceToggle(opt.value)}
                  className="rounded border-outline-variant text-indigo-accent focus:ring-indigo-accent bg-surface-container-low"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-label-md font-label-md text-on-surface-variant mb-1.5">
            Target Account
          </label>
          <select
            className="w-full bg-surface-container-low border border-outline-variant rounded py-2 px-3 text-body-md focus:ring-2 focus:ring-indigo-accent focus:outline-none"
            value={targetAccount}
            onChange={(e) => setTargetAccount(e.target.value)}
          >
            {targetOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-label-md font-label-md text-on-surface-variant mb-1.5">
            Sweep Frequency
          </label>
          <select
            className="w-full bg-surface-container-low border border-outline-variant rounded py-2 px-3 text-body-md focus:ring-2 focus:ring-indigo-accent focus:outline-none"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Real-time (Intraday)">Real-time (Intraday)</option>
          </select>
        </div>

        <div>
          <label className="block text-label-md font-label-md text-on-surface-variant mb-1.5">
            Target Balance Threshold
          </label>
          <input
            className="w-full bg-surface-container-low border border-outline-variant rounded py-2 px-3 text-body-md focus:ring-2 focus:ring-indigo-accent focus:outline-none"
            placeholder="$100,000"
            type="text"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
          />
        </div>

        <div className="col-span-2">
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

        <div className="col-span-2 pt-4 pb-2 flex gap-3">
          <button
            type="submit"
            className="bg-indigo-accent hover:bg-opacity-90 text-white font-label-md py-2.5 px-6 rounded-lg transition-all flex items-center gap-2"
          >
            <Bolt className="w-4 h-4" />
            Create Rule
          </button>
          <button
            type="button"
            onClick={() => {
              setName("");
              setSelectedSources(["CAD-SUB-001", "MXN-SUB-001"]);
              setThreshold("100000");
            }}
            className="border border-indigo-accent text-indigo-accent hover:bg-indigo-accent hover:bg-opacity-10 font-label-md py-2.5 px-6 rounded-lg transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRuleForm;
