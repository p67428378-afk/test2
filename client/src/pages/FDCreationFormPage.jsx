import React, { useEffect, useState } from "react";
import { getAccountDetails } from "../services/api";
import MaturityCalculator from "../components/fd/MaturityCalculator";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  AlertCircle,
  Wallet,
} from "lucide-react";

export default function FDCreationFormPage({
  onBack,
  onNext,
  selectedProduct,
  depositAmount,
  setDepositAmount,
  sourceAccount,
  setSourceAccount,
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState("");

  // Default test account ID
  const defaultAccountId = "88888888-8888-8888-8888-888888888888";

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setLoading(true);
        const data = await getAccountDetails(defaultAccountId);
        setSourceAccount(data);
      } catch (err) {
        console.error(err);
        setError(
          "Failed to load source savings account. Please try again later.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAccount();
  }, [setSourceAccount]);

  const handleAmountChange = (e) => {
    const val = e.target.value;
    setDepositAmount(val);
    setValidationError("");

    if (!val) return;

    const numVal = parseFloat(val);
    if (isNaN(numVal)) {
      setValidationError("Please enter a valid number");
    } else if (numVal < selectedProduct.min_deposit) {
      setValidationError(
        `Minimum deposit for this plan is $${selectedProduct.min_deposit.toLocaleString()}`,
      );
    } else if (sourceAccount && numVal > sourceAccount.balance) {
      setValidationError(
        `Insufficient funds. Available balance is $${sourceAccount.balance.toLocaleString()}`,
      );
    }
  };

  const handleNext = () => {
    const numVal = parseFloat(depositAmount);
    if (!depositAmount || isNaN(numVal)) {
      setValidationError("Please enter a valid deposit amount");
      return;
    }
    if (numVal < selectedProduct.min_deposit) {
      setValidationError(
        `Minimum deposit for this plan is $${selectedProduct.min_deposit.toLocaleString()}`,
      );
      return;
    }
    if (sourceAccount && numVal > sourceAccount.balance) {
      setValidationError(
        `Insufficient funds. Available balance is $${sourceAccount.balance.toLocaleString()}`,
      );
      return;
    }
    onNext();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-3">
        <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
        <p className="text-sm text-gray-500 font-medium">
          Retrieving savings account balance...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start space-x-3 text-red-800 my-6">
        <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm">System Error</h4>
          <p className="text-xs mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <button
          onClick={onBack}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h2 className="text-xl font-bold text-gray-900">Configure Deposit</h2>
      </div>

      {sourceAccount && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-primary-50 rounded-xl text-primary-600">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase">
                Savings Account
              </p>
              <p className="text-sm font-bold text-gray-800">
                {sourceAccount.account_number}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 font-semibold uppercase">
              Available Balance
            </p>
            <p className="text-base font-extrabold text-gray-900">
              $
              {sourceAccount.balance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="deposit-amount"
          className="block text-sm font-bold text-gray-700"
        >
          Deposit Amount ($)
        </label>
        <div className="relative rounded-xl shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-gray-500 font-bold text-lg">$</span>
          </div>
          <input
            type="number"
            name="deposit-amount"
            id="deposit-amount"
            value={depositAmount}
            onChange={handleAmountChange}
            className={`block w-full pl-8 pr-4 py-3.5 text-lg font-bold rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all ${
              validationError
                ? "border-red-300 focus:border-red-500"
                : "border-gray-200 focus:border-primary-500"
            }`}
            placeholder={`Min. $${selectedProduct.min_deposit.toLocaleString()}`}
          />
        </div>
        {validationError && (
          <p className="text-xs text-red-600 font-medium flex items-center mt-1">
            <AlertCircle className="h-3.5 w-3.5 mr-1 shrink-0" />
            <span>{validationError}</span>
          </p>
        )}
      </div>

      <MaturityCalculator
        product={selectedProduct}
        depositAmount={depositAmount}
      />

      <div className="pt-4">
        <button
          onClick={handleNext}
          disabled={!!validationError || !depositAmount}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Review Investment</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
