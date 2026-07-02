import React, { useState } from "react";
import { Phone, Tv, ShieldCheck, AlertTriangle, Loader2 } from "lucide-react";

const OPERATORS = [
  { name: "Airtel", type: "Mobile" },
  { name: "Jio", type: "Mobile" },
  { name: "Vi", type: "Mobile" },
  { name: "BSNL", type: "Mobile" },
  { name: "Tata Play", type: "DTH" },
  { name: "Dish TV", type: "DTH" },
  { name: "Airtel Digital TV", type: "DTH" },
  { name: "Sun Direct", type: "DTH" },
];

export default function RechargeForm({
  onSubmit,
  initialValues = {},
  isSubmitting = false,
}) {
  const [rechargeType, setRechargeType] = useState(
    initialValues.rechargeType || "Mobile",
  );
  const [accountNumber, setAccountNumber] = useState(
    initialValues.accountNumber || "",
  );
  const [operatorName, setOperatorName] = useState(
    initialValues.operatorName || "",
  );
  const [amount, setAmount] = useState(initialValues.amount || "");
  const [validationError, setValidationError] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [billerId, setBillerId] = useState("");

  const handleTypeChange = (type) => {
    setRechargeType(type);
    setOperatorName("");
    setAccountNumber("");
    setIsValidated(false);
    setValidationError("");
  };

  const handleValidate = async (e) => {
    e.preventDefault();
    if (!accountNumber) {
      setValidationError("Please enter an account or mobile number.");
      return;
    }
    if (!operatorName) {
      setValidationError("Please select an operator.");
      return;
    }

    setValidationError("");
    setIsValidating(true);
    try {
      const { validateOperator } = await import("../../services/api");
      const res = await validateOperator(accountNumber, operatorName);
      if (res.is_valid) {
        setIsValidated(true);
        setBillerId(res.biller_id);
      } else {
        setValidationError("Operator validation failed. Please check details.");
      }
    } catch (err) {
      setValidationError(
        err.response?.data?.detail ||
          "Validation failed. Please check operator and account number.",
      );
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidated) return;
    if (!amount || parseFloat(amount) <= 0) {
      setValidationError("Please enter a valid recharge amount.");
      return;
    }
    onSubmit({
      accountNumber,
      operatorName,
      amount: parseFloat(amount),
      billerId,
    });
  };

  const filteredOperators = OPERATORS.filter((op) => op.type === rechargeType);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span>New Prepaid Recharge</span>
        <span className="text-xs font-normal bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">
          BBPS Assured
        </span>
      </h2>

      {/* Recharge Type Selector */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          type="button"
          onClick={() => handleTypeChange("Mobile")}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg border font-semibold transition-all ${
            rechargeType === "Mobile"
              ? "bg-primary-50 border-primary-500 text-primary-700 shadow-sm"
              : "border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Phone className="w-5 h-5" />
          <span>Mobile Recharge</span>
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange("DTH")}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg border font-semibold transition-all ${
            rechargeType === "DTH"
              ? "bg-primary-50 border-primary-500 text-primary-700 shadow-sm"
              : "border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Tv className="w-5 h-5" />
          <span>DTH Connection</span>
        </button>
      </div>

      {validationError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>{validationError}</div>
        </div>
      )}

      <form
        onSubmit={isValidated ? handleSubmit : handleValidate}
        className="space-y-5"
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {rechargeType === "Mobile" ? "Mobile Number" : "DTH Account Number"}
          </label>
          <input
            type="text"
            disabled={isValidated || isSubmitting}
            value={accountNumber}
            onChange={(e) => {
              setAccountNumber(e.target.value);
              setValidationError("");
            }}
            placeholder={
              rechargeType === "Mobile"
                ? "Enter 10-digit mobile number"
                : "Enter DTH customer ID"
            }
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Operator
          </label>
          <select
            disabled={isValidated || isSubmitting}
            value={operatorName}
            onChange={(e) => {
              setOperatorName(e.target.value);
              setValidationError("");
            }}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
          >
            <option value="">-- Choose Operator --</option>
            {filteredOperators.map((op) => (
              <option key={op.name} value={op.name}>
                {op.name}
              </option>
            ))}
          </select>
        </div>

        {!isValidated ? (
          <button
            type="submit"
            disabled={isValidating || isSubmitting}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            {isValidating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verifying with BBPS...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Validate Operator</span>
              </>
            )}
          </button>
        ) : (
          <div className="space-y-5 pt-2 border-t border-dashed border-gray-200">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm flex items-center justify-between">
              <span className="font-medium">✓ Operator Validated via BBPS</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded font-mono">
                Biller ID: {billerId}
              </span>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Recharge Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  disabled={isSubmitting}
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setValidationError("");
                  }}
                  placeholder="Enter amount"
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setIsValidated(false)}
                className="w-1/3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Edit Details
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <span>Proceed to Recharge</span>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
