import React, { useState } from "react";
import { createFD } from "../services/api";
import TransactionSummary from "../components/fd/TransactionSummary";
import { ArrowLeft, ShieldCheck, Loader2, AlertCircle } from "lucide-react";

export default function FDConfirmationPage({
  onBack,
  onSuccess,
  selectedProduct,
  depositAmount,
  sourceAccount,
}) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!pin || pin.length !== 4) {
      setError("Please enter a valid 4-digit PIN");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const payload = {
        product_id: selectedProduct.id,
        source_account_id: sourceAccount.id,
        deposit_amount: parseFloat(depositAmount),
        pin: pin,
      };
      const result = await createFD(payload);
      onSuccess(result);
    } catch (err) {
      console.error(err);
      const errMsg =
        err.response?.data?.detail ||
        "Transaction failed. Please verify your PIN and try again.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <button
          onClick={onBack}
          disabled={loading}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h2 className="text-xl font-bold text-gray-900">Confirm Investment</h2>
      </div>

      <TransactionSummary
        product={selectedProduct}
        depositAmount={depositAmount}
        sourceAccount={sourceAccount}
      />

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start space-x-3 text-red-800">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Transaction Failed</h4>
            <p className="text-xs mt-1">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleConfirm} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="pin"
            className="block text-sm font-bold text-gray-700"
          >
            Enter 4-Digit Secure PIN
          </label>
          <input
            type="password"
            name="pin"
            id="pin"
            maxLength={4}
            pattern="[0-9]*"
            inputMode="numeric"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value.replace(/\D/g, ""));
              setError(null);
            }}
            className="block w-full text-center tracking-widest text-2xl font-extrabold py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
            placeholder="••••"
            required
            disabled={loading}
          />
          <p className="text-[11px] text-gray-400 text-center">
            Demo PIN: <strong className="text-gray-600">1234</strong>
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || pin.length !== 4}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Processing Transaction...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="h-5 w-5" />
              <span>Confirm & Open Fixed Deposit</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
