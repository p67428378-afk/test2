import React, { useState } from "react";
import {
  Gift,
  Mail,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { createGiftSubscription } from "../../services/api";

export default function GiftSubscriptionCard({
  boxId,
  boxTitle,
  isOpen,
  onClose,
}) {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [giftSuccess, setGiftSuccess] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setGiftSuccess(null);

    if (!recipientEmail || !recipientEmail.includes("@")) {
      setError("Please enter a valid recipient email address.");
      return;
    }

    setLoading(true);
    try {
      const result = await createGiftSubscription(boxId, {
        recipient_email: recipientEmail,
        message: message.trim() || undefined,
      });
      setGiftSuccess(result);
    } catch (err) {
      console.error("Gift subscription error:", err);
      const detail =
        err.response?.data?.detail ||
        err.message ||
        "Failed to send gift subscription. Please try again.";
      setError(typeof detail === "string" ? detail : JSON.stringify(detail));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRecipientEmail("");
    setMessage("");
    setError(null);
    setGiftSuccess(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
              Gift This Subscription
            </h3>
            <p className="text-xs text-slate-500">
              Send {boxTitle ? `"${boxTitle}"` : "this curation"} directly to a
              friend or loved one
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        )}
      </div>

      {giftSuccess ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-serif text-xl font-bold text-emerald-900">
              Gift Subscription Created!
            </h4>
            <p className="text-emerald-800 text-sm mt-1">
              Your gift for{" "}
              <span className="font-semibold">
                {giftSuccess.recipient_email}
              </span>{" "}
              has been processed successfully.
            </p>
            {giftSuccess.message && (
              <p className="text-xs text-emerald-700 italic mt-2 bg-emerald-100/60 p-3 rounded-xl max-w-md mx-auto">
                "{giftSuccess.message}"
              </p>
            )}
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={handleReset}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-xl text-xs transition-colors shadow-sm"
            >
              Send Another Gift
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-5 py-2 border border-emerald-300 text-emerald-800 hover:bg-emerald-100/50 rounded-xl text-xs font-medium transition-colors"
              >
                Done
              </button>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Recipient Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="friend@example.com"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-none transition-all text-slate-900 placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              Gift Message{" "}
              <span className="text-slate-400 font-normal lowercase">
                (optional)
              </span>
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Happy Birthday! Hope you enjoy this curated subscription box."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-none transition-all text-slate-900 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Recipient will receive gift notification and claim instructions.
            </span>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Sending Gift...</span>
                </>
              ) : (
                <span>Send Gift Subscription</span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
