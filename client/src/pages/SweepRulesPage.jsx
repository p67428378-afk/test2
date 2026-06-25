import React, { useState, useEffect } from "react";
import SweepRulesTable from "../components/sweep/SweepRulesTable";
import SlideOutPanel from "../components/common/SlideOutPanel";
import {
  getSweepRules,
  createSweepRule,
  updateSweepRule,
  deleteSweepRule,
  getAccounts,
} from "../services/api";

export default function SweepRulesPage() {
  const [rules, setRules] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [error, setError] = useState("");

  // Form state
  const [sourceAccountId, setSourceAccountId] = useState("");
  const [hubAccountId, setHubAccountId] = useState("");
  const [targetBalance, setTargetBalance] = useState("");
  const [sweepThreshold, setSweepThreshold] = useState("");
  const [schedule, setSchedule] = useState("18:00 CET");
  const [status, setStatus] = useState("ACTIVE");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rulesData, accountsData] = await Promise.all([
        getSweepRules(),
        getAccounts(),
      ]);
      setRules(rulesData);
      setAccounts(accountsData);
    } catch (err) {
      console.error("Error fetching sweep rules:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingRule(null);
    setSourceAccountId("");
    setHubAccountId("");
    setTargetBalance("");
    setSweepThreshold("");
    setSchedule("18:00 CET");
    setStatus("ACTIVE");
    setError("");
    setIsPanelOpen(true);
  };

  const handleOpenEdit = (rule) => {
    setEditingRule(rule);
    setSourceAccountId(rule.source_account_id);
    setHubAccountId(rule.hub_account_id);
    setTargetBalance(rule.target_balance.toString());
    setSweepThreshold(rule.sweep_threshold.toString());
    setSchedule(rule.schedule);
    setStatus(rule.status);
    setError("");
    setIsPanelOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingRule) {
        await updateSweepRule(editingRule.id, {
          target_balance: parseFloat(targetBalance),
          sweep_threshold: parseFloat(sweepThreshold),
          schedule,
          status,
        });
      } else {
        await createSweepRule({
          source_account_id: sourceAccountId,
          hub_account_id: hubAccountId,
          target_balance: parseFloat(targetBalance),
          sweep_threshold: parseFloat(sweepThreshold),
          schedule,
          status,
        });
      }
      setIsPanelOpen(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save sweep rule");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sweep rule?")) {
      try {
        await deleteSweepRule(id);
        fetchData();
      } catch (err) {
        console.error("Error deleting sweep rule:", err);
      }
    }
  };

  const operatingAccounts = accounts.filter((a) => !a.is_hub);
  const hubAccounts = accounts.filter((a) => a.is_hub);

  return (
    <div className="space-y-grid-margin">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-headline-md font-bold text-on-surface">
            Sweep Rules
          </h1>
          <p className="text-body-sm text-on-surface-variant">
            Configure automated end-of-day balance sweeps
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary font-semibold rounded-DEFAULT hover:bg-primary-fixed transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Create Sweep Rule
        </button>
      </div>

      <SweepRulesTable
        rules={rules}
        accounts={accounts}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <SlideOutPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        title={editingRule ? "Edit Sweep Rule" : "Create Sweep Rule"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-error/10 border border-error text-error rounded-DEFAULT text-sm">
              {error}
            </div>
          )}

          {!editingRule && (
            <>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Source Operating Account
                </label>
                <select
                  required
                  value={sourceAccountId}
                  onChange={(e) => setSourceAccountId(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant rounded-DEFAULT px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="">Select Account</option>
                  {operatingAccounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.currency})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Central Hub Account
                </label>
                <select
                  required
                  value={hubAccountId}
                  onChange={(e) => setHubAccountId(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant rounded-DEFAULT px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="">Select Account</option>
                  {hubAccounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.currency})
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              Target Balance (USD)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={targetBalance}
              onChange={(e) => setTargetBalance(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant rounded-DEFAULT px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
              placeholder="e.g. 10000.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              Sweep Threshold (USD)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={sweepThreshold}
              onChange={(e) => setSweepThreshold(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant rounded-DEFAULT px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
              placeholder="e.g. 5000.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              Schedule
            </label>
            <input
              type="text"
              required
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant rounded-DEFAULT px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
              placeholder="e.g. 18:00 CET"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant rounded-DEFAULT px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="PAUSED">PAUSED</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-primary text-on-primary font-semibold rounded-DEFAULT hover:bg-primary-fixed transition-colors"
          >
            {editingRule ? "Update Rule" : "Create Rule"}
          </button>
        </form>
      </SlideOutPanel>
    </div>
  );
}
