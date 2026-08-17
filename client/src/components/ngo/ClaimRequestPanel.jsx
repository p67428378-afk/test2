import React, { useState } from "react";
import { Send, AlertCircle, CheckCircle, Clock, Package } from "lucide-react";
import { claimApi } from "../../services/api";

export default function ClaimRequestPanel({ donation, onClaimCreated }) {
  const [quantity, setQuantity] = useState(donation ? donation.quantity : 1);
  const [targetPickupTime, setTargetPickupTime] = useState(
    new Date(Date.now() + 2 * 3600 * 1000).toISOString().slice(0, 16),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!donation) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center text-slate-500">
        <Package className="h-8 w-8 mx-auto mb-2 text-slate-400" />
        <p className="font-medium text-slate-700">
          Select a food listing to claim
        </p>
        <p className="text-xs">
          Click on an available food card from the list to begin claim request.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        donation_id: donation.id,
        quantity: Number(quantity),
        target_pickup_time: new Date(targetPickupTime).toISOString(),
      };

      const response = await claimApi.createClaim(payload);
      setSuccess(true);
      if (onClaimCreated) {
        onClaimCreated(response);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to submit claim request. Quantity may exceed availability.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold text-slate-800 mb-2 flex items-center space-x-2">
        <Send className="h-5 w-5 text-emerald-600" />
        <span>Submit NGO Claim Request</span>
      </h2>
      <p className="text-xs text-slate-500 mb-4">
        Claiming for:{" "}
        <span className="font-bold text-slate-700">{donation.category}</span> (
        {donation.quantity} kg total available)
      </p>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
          <span>
            {typeof error === "string" ? error : JSON.stringify(error)}
          </span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
          <span>Claim submitted successfully! Volunteer dispatch created.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Requested Quantity (kg / servings)
          </label>
          <input
            type="number"
            min="1"
            max={donation.quantity}
            step="0.5"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <p className="text-xs text-slate-400 mt-1">
            Full or partial claim supported.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Target Pickup Time Slot
          </label>
          <input
            type="datetime-local"
            value={targetPickupTime}
            onChange={(e) => setTargetPickupTime(e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg transition disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <span>Submitting...</span>
          ) : (
            <span>Confirm Claim Request</span>
          )}
        </button>
      </form>
    </div>
  );
}
