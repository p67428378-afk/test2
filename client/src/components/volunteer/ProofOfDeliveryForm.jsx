import React, { useState } from "react";
import {
  Camera,
  FileCheck,
  CheckCircle,
  AlertCircle,
  Upload,
} from "lucide-react";
import { deliveryApi } from "../../services/api";

export default function ProofOfDeliveryForm({ delivery, onProofSubmitted }) {
  const [photoUrl, setPhotoUrl] = useState(
    "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=500",
  );
  const [signature, setSignature] = useState("NGO Receiver E-Signature Signed");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!delivery) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center text-slate-500">
        <Camera className="h-8 w-8 mx-auto mb-2 text-slate-400" />
        <p className="font-medium text-slate-700">Digital Proof of Delivery</p>
        <p className="text-xs">
          Select an active delivery task to submit photo proof and signature.
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
        status: "DELIVERED",
        photo_url: photoUrl,
        signature: signature,
      };

      const response = await deliveryApi.updateDeliveryStatus(
        delivery.id,
        payload,
      );
      setSuccess(true);
      if (onProofSubmitted) onProofSubmitted(response);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to submit proof of delivery.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold text-slate-800 mb-2 flex items-center space-x-2">
        <FileCheck className="h-5 w-5 text-emerald-600" />
        <span>Digital Proof of Delivery</span>
      </h2>
      <p className="text-xs text-slate-500 mb-4">
        Task #{delivery.id.slice(0, 8)} - Upload photo evidence & obtain
        recipient signature.
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
          <span>Delivery completed and verified with proof!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Delivery Photo URL / Proof
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            NGO Representative Signature / Full Name
          </label>
          <input
            type="text"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            placeholder="Recipient e-signature"
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
            <span>Complete Delivery & Verify</span>
          )}
        </button>
      </form>
    </div>
  );
}
