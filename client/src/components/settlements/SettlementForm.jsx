import React, { useState, useEffect } from "react";
import { createSettlement } from "../../services/api";
import { DollarSign, ArrowRight, Check, AlertCircle } from "lucide-react";

export const SettlementForm = ({
  group,
  initialPayerId = "",
  initialPayeeId = "",
  initialAmount = "",
  onSettlementCreated,
}) => {
  const members = group?.members || [];

  const [payerId, setPayerId] = useState(initialPayerId);
  const [payeeId, setPayeeId] = useState(initialPayeeId);
  const [amount, setAmount] = useState(initialAmount);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (members.length >= 2) {
      if (!payerId) setPayerId(members[0].id);
      if (!payeeId) setPayeeId(members[1].id);
    }
  }, [members]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const amt = parseFloat(amount);
    if (!payerId || !payeeId) {
      setError("Please select both a payer and payee.");
      return;
    }
    if (payerId === payeeId) {
      setError("Payer and payee cannot be the same member.");
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      setError("Please enter a valid positive settlement amount.");
      return;
    }

    setLoading(true);

    try {
      await createSettlement({
        group_id: group.id,
        payer_id: payerId,
        payee_id: payeeId,
        amount: amt,
        date: date,
        notes: notes.trim() || null,
      });

      setSuccessMsg("Settlement payment recorded successfully!");
      setAmount("");
      setNotes("");
      if (onSettlementCreated) onSettlementCreated();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to record settlement.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
      <div className="border-b border-slate-200 pb-3 mb-4">
        <h2 className="text-lg font-bold text-slate-900">
          Record Settlement Payment
        </h2>
        <p className="text-xs text-slate-500">
          Log a direct transfer between members to reduce or clear outstanding
          debts
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="p-3 mb-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm flex items-center space-x-2"
        >
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Who Paid? (Payer)
            </label>
            <select
              value={payerId}
              onChange={(e) => setPayerId(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden lg:flex items-center justify-center pt-5">
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Who Received? (Payee)
            </label>
            <select
              value={payeeId}
              onChange={(e) => setPayeeId(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Amount ($) *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">
                <DollarSign className="w-4 h-4" />
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 p-2.5 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Venmo transfer"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-sm transition-colors disabled:opacity-50 inline-flex items-center space-x-2"
          >
            <Check className="w-4 h-4" />
            <span>{loading ? "Recording..." : "Record Settlement"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettlementForm;
