import React from "react";
import {
  DollarSign,
  Percent,
  Scale,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export const SplitBreakdownSelector = ({
  members = [],
  splitType = "EQUAL",
  onSplitTypeChange,
  totalAmount = 0,
  participants = [],
  onParticipantsChange,
  splitValues = {}, // { member_id: value }
  onSplitValueChange,
}) => {
  const amount = Number(totalAmount) || 0;

  const handleToggleParticipant = (memberId) => {
    if (participants.includes(memberId)) {
      onParticipantsChange(participants.filter((id) => id !== memberId));
    } else {
      onParticipantsChange([...participants, memberId]);
    }
  };

  // Compute validation
  let sum = 0;
  let isValid = true;
  let validationMessage = "";

  if (splitType === "EXACT") {
    sum = participants.reduce(
      (acc, id) => acc + (Number(splitValues[id]) || 0),
      0,
    );
    const diff = Math.abs(sum - amount);
    isValid = diff < 0.01;
    validationMessage = isValid
      ? `Exact sum matches total bill ($${amount.toFixed(2)})`
      : `Sum of shares ($${sum.toFixed(2)}) does not equal total bill ($${amount.toFixed(2)})`;
  } else if (splitType === "PERCENTAGE") {
    sum = participants.reduce(
      (acc, id) => acc + (Number(splitValues[id]) || 0),
      0,
    );
    const diff = Math.abs(sum - 100);
    isValid = diff < 0.01;
    validationMessage = isValid
      ? `Percentages total 100%`
      : `Percentages sum to ${sum.toFixed(1)}% (must equal 100%)`;
  } else {
    // EQUAL
    const count = participants.length;
    const share = count > 0 ? (amount / count).toFixed(2) : "0.00";
    validationMessage =
      count > 0
        ? `${count} participants • $${share} each`
        : "Select at least 1 participant";
    isValid = count > 0;
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Split Mode
        </label>
        <div className="grid grid-cols-3 gap-2 bg-white p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => onSplitTypeChange("EQUAL")}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
              splitType === "EQUAL"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Scale className="w-3.5 h-3.5 mr-1" />
            <span>Equal</span>
          </button>

          <button
            type="button"
            onClick={() => onSplitTypeChange("EXACT")}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
              splitType === "EXACT"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 mr-1" />
            <span>Exact Amounts</span>
          </button>

          <button
            type="button"
            onClick={() => onSplitTypeChange("PERCENTAGE")}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
              splitType === "PERCENTAGE"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Percent className="w-3.5 h-3.5 mr-1" />
            <span>Percentage</span>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Participating Group Members
        </label>
        <div className="space-y-2">
          {members.map((member) => {
            const isSelected = participants.includes(member.id);
            return (
              <div
                key={member.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  isSelected
                    ? "bg-white border-blue-300 shadow-2xs"
                    : "bg-slate-100/70 border-slate-200 opacity-60"
                }`}
              >
                <label className="flex items-center space-x-3 cursor-pointer select-none flex-1">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleParticipant(member.id)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-slate-800 text-sm">
                    {member.name}
                  </span>
                </label>

                {isSelected && (
                  <div className="w-32">
                    {splitType === "EQUAL" && (
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg block text-right">
                        $
                        {participants.length > 0
                          ? (amount / participants.length).toFixed(2)
                          : "0.00"}
                      </span>
                    )}

                    {splitType === "EXACT" && (
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-xs text-slate-400 font-bold">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={splitValues[member.id] ?? ""}
                          onChange={(e) =>
                            onSplitValueChange(member.id, e.target.value)
                          }
                          className="w-full pl-6 pr-2 py-1 text-right text-xs font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {splitType === "PERCENTAGE" && (
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0"
                          value={splitValues[member.id] ?? ""}
                          onChange={(e) =>
                            onSplitValueChange(member.id, e.target.value)
                          }
                          className="w-full pr-6 pl-2 py-1 text-right text-xs font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-xs text-slate-400 font-bold">
                          %
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={`p-3 rounded-xl border flex items-center space-x-2 text-xs font-medium ${
          isValid
            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
            : "bg-amber-50 text-amber-900 border-amber-200"
        }`}
      >
        {isValid ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
        )}
        <span>{validationMessage}</span>
      </div>
    </div>
  );
};

export default SplitBreakdownSelector;
