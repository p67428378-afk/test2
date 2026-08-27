import React, { useState } from "react";
import { DollarSign, Heart, CheckCircle, AlertCircle } from "lucide-react";
import { donationsAPI } from "../../services/api";

export default function ContributionForm({
  campaignId,
  campaignTitle,
  onSuccess,
  currentUser,
}) {
  const [selectedPreset, setSelectedPreset] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState(
    currentUser?.full_name || "Jane Doe",
  );
  const [donorEmail, setDonorEmail] = useState(
    currentUser?.email || "test@example.com",
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successReceipt, setSuccessReceipt] = useState(null);

  const PRESETS = [10, 25, 50, 100];

  const handlePresetClick = (amount) => {
    setSelectedPreset(amount);
    setCustomAmount("");
    setErrorMsg("");
  };

  const handleCustomChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedPreset(null);
    setErrorMsg("");
  };

  const getFinalAmount = () => {
    if (selectedPreset !== null) return Number(selectedPreset);
    return parseFloat(customAmount) || 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessReceipt(null);

    const amount = getFinalAmount();

    if (!amount || amount <= 0) {
      setErrorMsg("Donation amount must be greater than zero.");
      return;
    }

    if (!donorName.trim()) {
      setErrorMsg("Donor name is required.");
      return;
    }

    if (!donorEmail.trim()) {
      setErrorMsg("Donor email address is required.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await donationsAPI.createDonation({
        campaign_id: campaignId,
        donor_name: donorName.trim(),
        donor_email: donorEmail.trim(),
        amount: amount,
      });

      setSuccessReceipt(response);
      if (onSuccess) {
        onSuccess(response);
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.detail ||
          "Failed to process contribution. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (successReceipt) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-emerald-900">
            Thank You for Your Contribution!
          </h3>
          <p className="text-xs text-emerald-700 mt-1">
            Your generous donation has been processed successfully.
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-emerald-100 text-left text-xs space-y-2 text-slate-700">
          <div className="flex justify-between">
            <span className="text-slate-500">Transaction ID:</span>
            <span className="font-mono font-bold text-slate-900">
              {successReceipt.transaction_id}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Amount Contributed:</span>
            <span className="font-bold text-emerald-600">
              ${Number(successReceipt.amount).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Donor Name:</span>
            <span className="font-medium text-slate-900">
              {successReceipt.donor_name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Payment Status:</span>
            <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded text-[10px] uppercase">
              {successReceipt.payment_status || "Completed"}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            setSuccessReceipt(null);
            setCustomAmount("");
            setSelectedPreset(50);
          }}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
        >
          Make Another Contribution
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6"
    >
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
        <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
          <Heart className="w-5 h-5 fill-current" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-lg">
            Support This Campaign
          </h3>
          <p className="text-xs text-slate-500">
            Select an amount to contribute
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Preset Amounts */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Select Contribution Amount
        </label>
        <div className="grid grid-cols-4 gap-2">
          {PRESETS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => handlePresetClick(amt)}
              className={`py-2.5 rounded-xl font-bold text-sm border transition-all ${
                selectedPreset === amt
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              ${amt}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Amount */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-slate-700">
          Or Enter Custom Amount ($)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <DollarSign className="w-4 h-4" />
          </div>
          <input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="Custom Amount (e.g. 75.00)"
            value={customAmount}
            onChange={handleCustomChange}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Donor Information */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Your Name
          </label>
          <input
            type="text"
            required
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            placeholder="Jane Doe"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            value={donorEmail}
            onChange={(e) => setDonorEmail(e.target.value)}
            placeholder="donor@example.com"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Heart className="w-4 h-4 fill-current" />
        <span>
          {submitting
            ? "Processing Contribution..."
            : `Donate $${getFinalAmount().toFixed(2)}`}
        </span>
      </button>
    </form>
  );
}
