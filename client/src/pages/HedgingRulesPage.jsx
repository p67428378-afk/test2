import React, { useState, useEffect } from "react";
import HedgingRulesTable from "../components/hedging/HedgingRulesTable";
import SlideOutPanel from "../components/common/SlideOutPanel";
import {
  getHedgeRules,
  createHedgeRule,
  updateHedgeRule,
  deleteHedgeRule,
} from "../services/api";

export default function HedgingRulesPage() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [error, setError] = useState("");

  // Form state
  const [currencyPair, setCurrencyPair] = useState("EUR/USD");
  const [amountThreshold, setAmountThreshold] = useState("");
  const [volatilityThreshold, setVolatilityThreshold] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  const fetchData = async () => {
    try {
      setLoading(true);
      const rulesData = await getHedgeRules();
      setRules(rulesData);
    } catch (err) {
      console.error("Error fetching hedging rules:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingRule(null);
    setCurrencyPair("EUR/USD");
    setAmountThreshold("");
    setVolatilityThreshold("");
    setStatus("ACTIVE");
    setError("");
    setIsPanelOpen(true);
  };

  const handleOpenEdit = (rule) => {
    setEditingRule(rule);
    setCurrencyPair(rule.currency_pair);
    setAmountThreshold(rule.amount_threshold.toString());
    setVolatilityThreshold(
      rule.volatility_threshold !== null
        ? rule.volatility_threshold.toString()
        : "",
    );
    setStatus(rule.status);
    setError("");
    setIsPanelOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        amount_threshold: parseFloat(amountThreshold),
        volatility_threshold:
          volatilityThreshold !== "" ? parseFloat(volatilityThreshold) : null,
        status,
      };

      if (editingRule) {
        await updateHedgeRule(editingRule.id, payload);
      } else {
        await createHedgeRule({
          currency_pair: currencyPair,
          ...payload,
        });
      }
      setIsPanelOpen(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save hedging rule");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this hedging rule?")) {
      try {
        await deleteHedgeRule(id);
        fetchData();
      } catch (err) {
        console.error("Error deleting hedging rule:", err);
      }
    }
  };

  return (
    <div className="space-y-grid-margin">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-headline-md font-bold text-on-surface">
            Hedging Rules
          </h1>
          <p className="text-body-sm text-on-surface-variant">
            Configure conditional forward-contract hedging rules
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary font-semibold rounded-DEFAULT hover:bg-primary-fixed transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Create Hedging Rule
        </button>
      </div>

      <HedgingRulesTable
        rules={rules}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <SlideOutPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        title={editingRule ? "Edit Hedging Rule" : "Create Hedging Rule"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-error/10 border border-error text-error rounded-DEFAULT text-sm">
              {error}
            </div>
          )}

          {!editingRule && (
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">
                Currency Pair
              </label>
              <select
                required
                value={currencyPair}
                onChange={(e) => setCurrencyPair(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant rounded-DEFAULT px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
              >
                <option value="EUR/USD">EUR/USD</option>
                <option value="GBP/USD">GBP/USD</option>
                <option value="JPY/USD">JPY/USD</option>
                <option value="CAD/USD">CAD/USD</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              Amount Threshold (USD)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={amountThreshold}
              onChange={(e) => setAmountThreshold(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant rounded-DEFAULT px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
              placeholder="e.g. 1000000.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              Volatility Threshold (%) (Optional)
            </label>
            <input
              type="number"
              step="0.01"
              value={volatilityThreshold}
              onChange={(e) => setVolatilityThreshold(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant rounded-DEFAULT px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
              placeholder="e.g. 2.5"
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
