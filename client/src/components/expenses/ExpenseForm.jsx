import React, { useState, useEffect } from "react";
import { createExpense } from "../../services/api";
import SplitTypeTabs from "./SplitTypeTabs";
import {
  CheckCircle2,
  AlertCircle,
  Users,
  DollarSign,
  Tag,
  Calendar,
  User,
  PlusCircle,
  Loader2,
} from "lucide-react";

export default function ExpenseForm({
  groups = [],
  selectedGroupId = "",
  onSuccess,
  onCancel,
}) {
  const [groupId, setGroupId] = useState(
    selectedGroupId || groups[0]?.id || "",
  );
  const [title, setTitle] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [payerId, setPayerId] = useState("");
  const [category, setCategory] = useState("Food & Dining");
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().substring(0, 10),
  );
  const [splitType, setSplitType] = useState("EQUAL");

  // Participants: array of { member_id, name, isSelected, splitValue }
  const [participants, setParticipants] = useState([]);

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const currentGroup = groups.find((g) => g.id === groupId);
  const groupMembers = currentGroup?.members || [];

  // Initialize participants when selected group changes
  useEffect(() => {
    if (groupMembers.length > 0) {
      setParticipants(
        groupMembers.map((m) => ({
          member_id: m.id,
          name: m.name,
          isSelected: true,
          splitValue: "",
        })),
      );
      if (!payerId || !groupMembers.some((m) => m.id === payerId)) {
        setPayerId(groupMembers[0]?.id || "");
      }
    } else {
      setParticipants([]);
      setPayerId("");
    }
  }, [groupId, groups]);

  // Adjust default split values when splitType changes
  useEffect(() => {
    const selectedCount = participants.filter((p) => p.isSelected).length;
    if (splitType === "PERCENTAGE" && selectedCount > 0) {
      const equalPct = (100 / selectedCount).toFixed(2);
      setParticipants((prev) =>
        prev.map((p) => ({
          ...p,
          splitValue: p.isSelected ? equalPct : "",
        })),
      );
    } else if (
      splitType === "FIXED" &&
      selectedCount > 0 &&
      Number(totalAmount) > 0
    ) {
      const equalAmt = (Number(totalAmount) / selectedCount).toFixed(2);
      setParticipants((prev) =>
        prev.map((p) => ({
          ...p,
          splitValue: p.isSelected ? equalAmt : "",
        })),
      );
    }
  }, [splitType]);

  const handleParticipantToggle = (memberId) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.member_id === memberId ? { ...p, isSelected: !p.isSelected } : p,
      ),
    );
  };

  const handleSplitValueChange = (memberId, value) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.member_id === memberId ? { ...p, splitValue: value } : p,
      ),
    );
  };

  const selectedParticipants = participants.filter((p) => p.isSelected);
  const amountNum = parseFloat(totalAmount) || 0;

  // Real-time calculation of split shares & validation status
  const calculateSplitsSummary = () => {
    if (selectedParticipants.length === 0) {
      return {
        isValid: false,
        message: "At least one participant must be selected.",
        diff: 0,
        shares: {},
      };
    }

    if (amountNum <= 0) {
      return {
        isValid: false,
        message: "Please enter a valid expense amount greater than $0.",
        diff: 0,
        shares: {},
      };
    }

    if (splitType === "EQUAL") {
      const perPerson = amountNum / selectedParticipants.length;
      const shares = {};
      selectedParticipants.forEach((p) => {
        shares[p.member_id] = perPerson;
      });
      return {
        isValid: true,
        message: `Split equally: $${perPerson.toFixed(2)} per participant.`,
        diff: 0,
        shares,
      };
    }

    if (splitType === "PERCENTAGE") {
      let totalPct = 0;
      const shares = {};
      selectedParticipants.forEach((p) => {
        const pct = parseFloat(p.splitValue) || 0;
        totalPct += pct;
        shares[p.member_id] = (amountNum * pct) / 100;
      });
      const diff = Math.round((100 - totalPct) * 100) / 100;
      const isValid = Math.abs(diff) < 0.01;
      return {
        isValid,
        message: isValid
          ? "Percentages sum up to exactly 100%."
          : `Total percentage is ${totalPct.toFixed(2)}%. Must equal 100% (difference: ${
              diff > 0 ? `+${diff}%` : `${diff}%`
            }).`,
        diff,
        shares,
        totalPct,
      };
    }

    if (splitType === "FIXED") {
      let totalFixed = 0;
      const shares = {};
      selectedParticipants.forEach((p) => {
        const amt = parseFloat(p.splitValue) || 0;
        totalFixed += amt;
        shares[p.member_id] = amt;
      });
      const diff = Math.round((amountNum - totalFixed) * 100) / 100;
      const isValid = Math.abs(diff) < 0.01;
      return {
        isValid,
        message: isValid
          ? "Split amounts match total expense exactly."
          : `Total allocated is $${totalFixed.toFixed(2)}. Must equal $${amountNum.toFixed(
              2,
            )} (difference: ${diff > 0 ? `+$${diff.toFixed(2)}` : `-$${Math.abs(diff).toFixed(2)}`}).`,
        diff,
        shares,
        totalFixed,
      };
    }

    return { isValid: true, message: "", diff: 0, shares: {} };
  };

  const splitSummary = calculateSplitsSummary();

  const validateForm = () => {
    const errs = {};
    if (!groupId) errs.groupId = "Please select a group.";
    if (!title.trim()) errs.title = "Expense title is required.";
    if (!totalAmount || amountNum <= 0)
      errs.totalAmount = "Total amount must be greater than $0.";
    if (!payerId) errs.payerId = "Please select the member who paid.";
    if (selectedParticipants.length === 0)
      errs.participants = "Please select at least one participant.";
    if (!splitSummary.isValid) errs.split = splitSummary.message;

    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const splitsPayload = selectedParticipants.map((p) => ({
        member_id: p.member_id,
        split_value:
          splitType === "EQUAL" ? null : parseFloat(p.splitValue) || 0,
      }));

      const payload = {
        group_id: groupId,
        title: title.trim(),
        total_amount: amountNum,
        payer_id: payerId,
        category: category.trim() || "General",
        split_type: splitType,
        expense_date: expenseDate
          ? new Date(expenseDate).toISOString()
          : new Date().toISOString(),
        splits: splitsPayload,
      };

      const result = await createExpense(payload);
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.detail ||
        err.message ||
        "Failed to create expense. Please review inputs and try again.";
      setApiError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#E3E8F0] rounded-xl p-6 shadow-sm"
    >
      <div className="border-b border-[#E3E8F0] pb-4 mb-6">
        <h2 className="text-xl font-bold text-[#171C29]">
          Record New Shared Expense
        </h2>
        <p className="text-sm text-[#707A8C] mt-1">
          Enter expense details and allocate shares among participants.
        </p>
      </div>

      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-red-800">
              Expense Creation Error
            </h4>
            <p className="text-sm text-red-700 mt-0.5">{apiError}</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Group Selection */}
        <div>
          <label
            htmlFor="group-select"
            className="block text-sm font-semibold text-[#171C29] mb-1"
          >
            Group <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Users className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              id="group-select"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-[#E3E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.members?.length || 0} members)
                </option>
              ))}
            </select>
          </div>
          {validationErrors.groupId && (
            <p className="text-xs text-red-600 mt-1">
              {validationErrors.groupId}
            </p>
          )}
        </div>

        {/* Title & Amount */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="expense-title"
              className="block text-sm font-semibold text-[#171C29] mb-1"
            >
              Expense Title <span className="text-red-500">*</span>
            </label>
            <input
              id="expense-title"
              type="text"
              placeholder="e.g. Dinner at Italian Bistro, Uber, Airbnb"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E3E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            {validationErrors.title && (
              <p className="text-xs text-red-600 mt-1">
                {validationErrors.title}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="expense-amount"
              className="block text-sm font-semibold text-[#171C29] mb-1"
            >
              Total Amount ($) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="expense-amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-[#E3E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            {validationErrors.totalAmount && (
              <p className="text-xs text-red-600 mt-1">
                {validationErrors.totalAmount}
              </p>
            )}
          </div>
        </div>

        {/* Payer, Category, and Date */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="payer-select"
              className="block text-sm font-semibold text-[#171C29] mb-1"
            >
              Paid By <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                id="payer-select"
                value={payerId}
                onChange={(e) => setPayerId(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-[#E3E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {groupMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} {m.email ? `(${m.email})` : ""}
                  </option>
                ))}
              </select>
            </div>
            {validationErrors.payerId && (
              <p className="text-xs text-red-600 mt-1">
                {validationErrors.payerId}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="category-select"
              className="block text-sm font-semibold text-[#171C29] mb-1"
            >
              Category
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                id="category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-[#E3E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Food & Dining">Food & Dining</option>
                <option value="Travel & Transportation">
                  Travel & Transportation
                </option>
                <option value="Lodging & Hotels">Lodging & Hotels</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Groceries">Groceries</option>
                <option value="Utilities">Utilities</option>
                <option value="Shopping">Shopping</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="expense-date"
              className="block text-sm font-semibold text-[#171C29] mb-1"
            >
              Expense Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="expense-date"
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-[#E3E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Split Allocation Rule Selector */}
        <div className="pt-2 border-t border-[#E3E8F0]">
          <SplitTypeTabs splitType={splitType} onChange={setSplitType} />
        </div>

        {/* Participant Splitting Table */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#171C29]">
              Participating Members ({selectedParticipants.length}/
              {participants.length})
            </span>
            <button
              type="button"
              onClick={() =>
                setParticipants((prev) =>
                  prev.map((p) => ({ ...p, isSelected: true })),
                )
              }
              className="text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              Select All
            </button>
          </div>

          <div className="border border-[#E3E8F0] rounded-xl divide-y divide-[#E3E8F0] overflow-hidden">
            {participants.map((p) => {
              const computedShare = splitSummary.shares[p.member_id] || 0;
              return (
                <div
                  key={p.member_id}
                  className={`p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors ${
                    p.isSelected ? "bg-white" : "bg-gray-50/70 opacity-60"
                  }`}
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={p.isSelected}
                      onChange={() => handleParticipantToggle(p.member_id)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                      {p.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-[#171C29]">
                      {p.name}
                    </span>
                  </label>

                  {p.isSelected && (
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                      {splitType === "PERCENTAGE" && (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            placeholder="0"
                            value={p.splitValue}
                            onChange={(e) =>
                              handleSplitValueChange(
                                p.member_id,
                                e.target.value,
                              )
                            }
                            className="w-20 px-2 py-1 text-sm text-right bg-white border border-[#E3E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                          <span className="text-xs text-[#707A8C]">%</span>
                        </div>
                      )}

                      {splitType === "FIXED" && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-[#707A8C]">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={p.splitValue}
                            onChange={(e) =>
                              handleSplitValueChange(
                                p.member_id,
                                e.target.value,
                              )
                            }
                            className="w-24 px-2 py-1 text-sm text-right bg-white border border-[#E3E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                        </div>
                      )}

                      <div className="text-right min-w-[80px]">
                        <span className="text-xs font-semibold text-[#171C29]">
                          ${computedShare.toFixed(2)}
                        </span>
                        <p className="text-[10px] text-[#707A8C]">share</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {validationErrors.participants && (
            <p className="text-xs text-red-600 mt-1">
              {validationErrors.participants}
            </p>
          )}
        </div>

        {/* Real-time Validation Banner */}
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-3 transition-colors ${
            splitSummary.isValid
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-amber-50 border-amber-200 text-amber-900"
          }`}
        >
          {splitSummary.isValid ? (
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-medium">
            {splitSummary.message}
          </span>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="mt-8 pt-4 border-t border-[#E3E8F0] flex items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2.5 text-sm font-medium text-[#707A8C] hover:text-[#171C29] hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !splitSummary.isValid}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white shadow-sm transition-all ${
            loading || !splitSummary.isValid
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving Expense...
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              Save Expense
            </>
          )}
        </button>
      </div>
    </form>
  );
}
