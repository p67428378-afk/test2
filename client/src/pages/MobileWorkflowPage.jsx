import React, { useState, useEffect } from "react";
import AppLayout from "../components/layout/AppLayout.jsx";
import {
  Smartphone,
  ShieldCheck,
  Lock,
  Unlock,
  AlertCircle,
  Check,
  X,
  Pause,
  Save,
} from "lucide-react";
import {
  getRules,
  getWorkflowDetails,
  pauseWorkflow,
  approveWorkflow,
  rejectWorkflow,
  adjustWorkflow,
} from "../services/api.js";

const MobileWorkflowPage = () => {
  const [rules, setRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [workflowDetails, setWorkflowDetails] = useState(null);
  const [mfaCode, setMfaCode] = useState("");
  const [isMfaVerified, setIsMfaVerified] = useState(false);
  const [mfaError, setMfaError] = useState("");
  const [threshold, setThreshold] = useState("");
  const [fxStrategy, setFxStrategy] = useState("spot");
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const fetchRulesList = async () => {
    try {
      const data = await getRules();
      setRules(data);
      // Filter for rules that are pending approval or paused
      const pendingOrPaused = data.filter(
        (r) => r.status === "PENDING_APPROVAL" || r.status === "PAUSED",
      );
      if (pendingOrPaused.length > 0 && !selectedRule) {
        setSelectedRule(pendingOrPaused[0]);
      } else if (selectedRule) {
        const updated = data.find((r) => r.id === selectedRule.id);
        if (updated) setSelectedRule(updated);
      }
    } catch (err) {
      console.error("Failed to fetch rules:", err);
    }
  };

  const fetchWorkflowInfo = async (ruleId) => {
    try {
      const details = await getWorkflowDetails(ruleId);
      setWorkflowDetails(details);
    } catch (err) {
      console.error("Failed to fetch workflow details:", err);
    }
  };

  useEffect(() => {
    fetchRulesList();
  }, []);

  useEffect(() => {
    if (selectedRule) {
      fetchWorkflowInfo(selectedRule.id);
      setThreshold(selectedRule.threshold.toString());
      setFxStrategy(selectedRule.fx_strategy);
    } else {
      setWorkflowDetails(null);
    }
  }, [selectedRule]);

  const handleVerifyMfa = (e) => {
    e.preventDefault();
    if (mfaCode === "123456") {
      setIsMfaVerified(true);
      setMfaError("");
    } else {
      setMfaError("Invalid MFA code. Use 123456 for demo.");
    }
  };

  const handleAdjust = async (e) => {
    e.preventDefault();
    setActionError("");
    setActionSuccess("");
    const parsedThreshold = parseFloat(threshold);
    if (isNaN(parsedThreshold) || parsedThreshold <= 0) {
      setActionError("Threshold must be a positive number");
      return;
    }

    try {
      await adjustWorkflow(selectedRule.id, {
        fx_strategy: fxStrategy,
        threshold: parsedThreshold,
      });
      setActionSuccess("Parameters adjusted successfully!");
      await fetchRulesList();
    } catch (err) {
      setActionError(
        err.response?.data?.detail || "Failed to adjust parameters",
      );
    }
  };

  const handleApprove = async () => {
    setActionError("");
    setActionSuccess("");
    try {
      await approveWorkflow(selectedRule.id);
      setActionSuccess("Workflow approved and executed!");
      await fetchRulesList();
    } catch (err) {
      setActionError(
        err.response?.data?.detail || "Failed to approve workflow",
      );
    }
  };

  const handleReject = async () => {
    setActionError("");
    setActionSuccess("");
    try {
      await rejectWorkflow(selectedRule.id);
      setActionSuccess("Workflow rejected!");
      await fetchRulesList();
    } catch (err) {
      setActionError(err.response?.data?.detail || "Failed to reject workflow");
    }
  };

  const handlePause = async () => {
    setActionError("");
    setActionSuccess("");
    try {
      await pauseWorkflow(selectedRule.id);
      setActionSuccess("Workflow paused!");
      await fetchRulesList();
    } catch (err) {
      setActionError(err.response?.data?.detail || "Failed to pause workflow");
    }
  };

  return (
    <AppLayout>
      <div className="max-w-md mx-auto bg-surface-container border border-outline-variant rounded-[40px] p-6 shadow-2xl relative overflow-hidden min-h-[700px] flex flex-col">
        {/* Mobile Header */}
        <div className="flex justify-between items-center border-b border-outline-variant pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Smartphone className="text-indigo-accent w-6 h-6" />
            <span className="font-bold text-on-surface">ApexMobile</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-on-surface-variant">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span>Secure Session</span>
          </div>
        </div>

        {!isMfaVerified ? (
          <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
            <Lock className="w-16 h-16 text-indigo-accent mb-4" />
            <h3 className="text-headline-sm font-headline-sm mb-2">
              MFA Verification
            </h3>
            <p className="text-body-sm text-on-surface-variant mb-6">
              Enter the 6-digit code from your authenticator app to access
              treasury workflows.
            </p>

            {mfaError && (
              <div className="w-full mb-4 p-3 bg-error-container text-error rounded-lg flex items-center gap-2 text-body-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{mfaError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyMfa} className="w-full space-y-4">
              <input
                type="text"
                placeholder="Enter 123456"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 px-4 text-center text-xl font-bold tracking-widest focus:ring-2 focus:ring-indigo-accent focus:outline-none"
              />
              <button
                type="submit"
                className="w-full bg-indigo-accent hover:bg-opacity-90 text-white font-label-md py-3 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                Verify & Access
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {actionError && (
              <div className="mb-4 p-3 bg-error-container text-error rounded-lg flex items-center gap-2 text-body-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            {actionSuccess && (
              <div className="mb-4 p-3 bg-green-900/20 text-green-400 rounded-lg flex items-center gap-2 text-body-sm">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Select Rule
              </label>
              <select
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-2 pl-3 pr-10 text-body-md focus:ring-2 focus:ring-indigo-accent focus:outline-none"
                value={selectedRule?.id || ""}
                onChange={(e) => {
                  const rule = rules.find((r) => r.id === e.target.value);
                  if (rule) setSelectedRule(rule);
                }}
              >
                {rules
                  .filter(
                    (r) =>
                      r.status === "PENDING_APPROVAL" || r.status === "PAUSED",
                  )
                  .map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.status})
                    </option>
                  ))}
              </select>
            </div>

            {selectedRule ? (
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  {workflowDetails && (
                    <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant space-y-2">
                      <div className="flex justify-between text-xs text-on-surface-variant">
                        <span>Est. Sweep Amount:</span>
                        <span className="font-bold text-on-surface">
                          ${workflowDetails.amount.toLocaleString()} USD
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-on-surface-variant">
                        <span>FX Rate Lock:</span>
                        <span className="font-bold text-indigo-accent">
                          1 CAD = {workflowDetails.fx_rate} USD
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-on-surface-variant">
                        <span>Compliance:</span>
                        <span
                          className={`font-bold ${workflowDetails.local_limit_compliant ? "text-green-400" : "text-red-400"}`}
                        >
                          {workflowDetails.local_limit_compliant
                            ? "Compliant"
                            : "Non-Compliant"}
                        </span>
                      </div>
                    </div>
                  )}

                  <form
                    onSubmit={handleAdjust}
                    className="bg-surface-container-low p-4 rounded-xl border border-outline-variant space-y-3"
                  >
                    <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                      Edit Parameters
                    </h4>
                    <div>
                      <label className="block text-[10px] text-on-surface-variant mb-1">
                        Threshold
                      </label>
                      <input
                        type="text"
                        value={threshold}
                        onChange={(e) => setThreshold(e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant rounded py-1.5 px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-on-surface-variant mb-1">
                        FX Strategy
                      </label>
                      <select
                        value={fxStrategy}
                        onChange={(e) => setFxStrategy(e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant rounded py-1.5 pl-2.5 pr-8 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-accent"
                      >
                        <option value="spot">Spot Rate</option>
                        <option value="forward">24h Forward Contract</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-indigo-accent hover:bg-opacity-90 text-white text-xs font-bold py-2 rounded transition-all flex items-center justify-center gap-1"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save Parameters
                    </button>
                  </form>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-6">
                  {selectedRule.status === "PENDING_APPROVAL" && (
                    <button
                      onClick={handlePause}
                      className="bg-yellow-600 hover:bg-yellow-500 text-white text-xs font-bold py-2.5 rounded-lg transition-all flex flex-col items-center justify-center gap-1"
                    >
                      <Pause className="w-4 h-4" />
                      Pause
                    </button>
                  )}
                  <button
                    onClick={handleApprove}
                    className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-2.5 rounded-lg transition-all flex flex-col items-center justify-center gap-1 col-span-1"
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={handleReject}
                    className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2.5 rounded-lg transition-all flex flex-col items-center justify-center gap-1 col-span-1"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center text-on-surface-variant text-sm">
                No rules pending approval or paused.
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MobileWorkflowPage;
