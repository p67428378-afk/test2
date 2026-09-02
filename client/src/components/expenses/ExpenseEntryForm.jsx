import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SplitBreakdownSelector from "./SplitBreakdownSelector";
import { createExpense } from "../../services/api";
import {
  Calendar,
  Tag,
  DollarSign,
  User,
  FileText,
  Check,
  AlertCircle,
} from "lucide-react";

export const ExpenseEntryForm = ({ group, onExpenseCreated }) => {
  const navigate = useNavigate();

  const members = group?.members || [];

  const [title, setTitle] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [category, setCategory] = useState("Dining");
  const [payerId, setPayerId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");

  const [splitType, setSplitType] = useState("EQUAL");
  const [participants, setParticipants] = useState([]);
  const [splitValues, setSplitValues] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Default payer & participants when group members load
  useEffect(() => {
    if (members.length > 0) {
      if (!payerId) setPayerId(members[0].id);
      if (participants.length === 0) setParticipants(members.map((m) => m.id));
    }
  }, [members]);

  const handleSplitValueChange = (memberId, val) => {
    setSplitValues((prev) => ({ ...prev, [memberId]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const amount = parseFloat(totalAmount);
    if (!title.trim()) {
      setError("Expense title is required.");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid positive total bill amount.");
      return;
    }
    if (!payerId) {
      setError("Please select who paid for the expense.");
      return;
    }
    if (participants.length === 0) {
      setError("At least one group member must participate in the split.");
      return;
    }

    // Build splits payload based on splitType
    let splitsPayload = [];

    if (splitType === "EQUAL") {
      const perShare = amount / participants.length;
      splitsPayload = participants.map((id) => ({
        member_id: id,
        share_amount: Number(perShare.toFixed(2)),
        percentage: Number((100 / participants.length).toFixed(2)),
      }));
    } else if (splitType === "EXACT") {
      let sum = 0;
      for (const id of participants) {
        const val = parseFloat(splitValues[id] || 0);
        if (isNaN(val) || val < 0) {
          setError(
            "Please enter valid non-negative exact amounts for all participants.",
          );
          return;
        }
        sum += val;
        splitsPayload.push({
          member_id: id,
          share_amount: Number(val.toFixed(2)),
          percentage:
            amount > 0 ? Number(((val / amount) * 100).toFixed(2)) : 0,
        });
      }
      if (Math.abs(sum - amount) >= 0.01) {
        setError(
          `Exact amounts sum ($${sum.toFixed(2)}) must equal total amount ($${amount.toFixed(2)}).`,
        );
        return;
      }
    } else if (splitType === "PERCENTAGE") {
      let sumPct = 0;
      for (const id of participants) {
        const pct = parseFloat(splitValues[id] || 0);
        if (isNaN(pct) || pct < 0) {
          setError(
            "Please enter valid non-negative percentages for all participants.",
          );
          return;
        }
        sumPct += pct;
        const calculatedShare = (pct / 100) * amount;
        splitsPayload.push({
          member_id: id,
          share_amount: Number(calculatedShare.toFixed(2)),
          percentage: Number(pct.toFixed(2)),
        });
      }
      if (Math.abs(sumPct - 100) >= 0.01) {
        setError(`Percentages sum (${sumPct.toFixed(1)}%) must equal 100%.`);
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        group_id: group.id,
        title: title.trim(),
        total_amount: amount,
        payer_id: payerId,
        split_type: splitType,
        date: date,
        category: category,
        description: description.trim() || null,
        splits: splitsPayload,
      };

      await createExpense(payload);
      if (onExpenseCreated) onExpenseCreated();
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to record expense.",
      );
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = [
    "Dining",
    "Travel",
    "Lodging",
    "Entertainment",
    "Groceries",
    "Utilities",
    "General",
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-3xl mx-auto">
      <div className="border-b border-slate-200 pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Record Group Expense
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Enter bill details and select split calculations for{" "}
          {group?.name || "group"}
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="p-4 mb-6 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm flex items-start space-x-2"
        >
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Expense Title *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Dinner at Olive Garden"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Total Amount ($) *
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
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="w-full pl-8 p-2.5 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Paid By *
            </label>
            <select
              value={payerId}
              onChange={(e) => setPayerId(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500"
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Date *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Notes / Description
            </label>
            <input
              type="text"
              placeholder="Optional notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <SplitBreakdownSelector
          members={members}
          splitType={splitType}
          onSplitTypeChange={setSplitType}
          totalAmount={totalAmount}
          participants={participants}
          onParticipantsChange={setParticipants}
          splitValues={splitValues}
          onSplitValueChange={handleSplitValueChange}
        />

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-sm transition-colors disabled:opacity-50 inline-flex items-center space-x-2"
          >
            <Check className="w-4 h-4" />
            <span>{loading ? "Recording..." : "Record Expense"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseEntryForm;
