import React, { useState, useEffect } from "react";
import { loanService } from "../services/api";
import AmortizationTable from "../components/loans/AmortizationTable";
import {
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Calendar,
  DollarSign,
  Percent,
  Clock,
} from "lucide-react";

export default function LoanOfferPage({
  application,
  userEmail,
  onBack,
  onDecisionSubmitted,
}) {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [declineReason, setDeclineReason] = useState("");
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const declineReasons = [
    "Interest rate is too high",
    "Offered amount is insufficient",
    "Tenure is not suitable",
    "Found a better offer elsewhere",
    "No longer need the loan",
    "Other",
  ];

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await loanService.getSchedule(application.application_id);
        setSchedule(data.schedule || []);
      } catch (err) {
        setError("Failed to load amortization schedule.");
      } finally {
        setLoading(false);
      }
    };

    if (application?.application_id) {
      fetchSchedule();
    }
  }, [application]);

  const handleAccept = async () => {
    setSubmitting(true);
    setError("");
    try {
      await loanService.submitOfferDecision(
        application.application_id,
        userEmail,
        {
          decision: "Accepted",
        },
      );
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      nextMonth.setDate(1);
      const dueDateStr = nextMonth.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setSuccessMessage(
        `Offer accepted successfully! Your first EMI due date is ${dueDateStr}.`,
      );
      setTimeout(() => {
        onDecisionSubmitted();
      }, 5000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to accept offer.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecline = async (e) => {
    e.preventDefault();
    if (!declineReason) {
      setError("Please select a reason for declining the offer.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await loanService.submitOfferDecision(
        application.application_id,
        userEmail,
        {
          decision: "Declined",
          decline_reason: declineReason,
        },
      );
      setSuccessMessage(
        "Offer declined successfully. The application has been returned to Approved status.",
      );
      setTimeout(() => {
        onDecisionSubmitted();
      }, 4000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to decline offer.");
    } finally {
      setSubmitting(false);
    }
  };

  const emiValue = schedule.length > 0 ? schedule[0].emi : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Applications
      </button>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Loan Offer Summary
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Review your customized loan offer and amortization schedule below.
        </p>

        {successMessage && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm flex items-start gap-2">
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Offer Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
              <DollarSign className="w-4 h-4 text-indigo-600" />
              Approved Amount
            </div>
            <p className="text-lg font-bold text-slate-900 mt-1">
              ${parseFloat(application.offered_amount || 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
              <Percent className="w-4 h-4 text-indigo-600" />
              Interest Rate
            </div>
            <p className="text-lg font-bold text-slate-900 mt-1">
              {application.snapshot_interest_rate || "10.5"}%
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Tenure
            </div>
            <p className="text-lg font-bold text-slate-900 mt-1">
              {application.tenure_months || 12} Months
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
              <Clock className="w-4 h-4 text-indigo-600" />
              Monthly EMI
            </div>
            <p className="text-lg font-bold text-indigo-600 mt-1">
              ${parseFloat(emiValue).toFixed(2)}
            </p>
          </div>
        </div>

        {!successMessage && !showDeclineForm && (
          <div className="flex gap-4 mt-8 border-t border-slate-100 pt-6">
            <button
              onClick={handleAccept}
              disabled={submitting || loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm"
            >
              {submitting ? "Processing..." : "Accept Offer"}
            </button>
            <button
              onClick={() => setShowDeclineForm(true)}
              disabled={submitting || loading}
              className="flex-1 bg-white hover:bg-slate-50 text-red-600 border border-red-200 font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Decline Offer
            </button>
          </div>
        )}

        {showDeclineForm && !successMessage && (
          <form
            onSubmit={handleDecline}
            className="mt-6 border-t border-slate-100 pt-6 space-y-4"
          >
            <h3 className="text-sm font-bold text-slate-900">
              Decline Loan Offer
            </h3>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Reason for declining <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">-- Select a reason --</option>
                {declineReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                {submitting ? "Submitting..." : "Confirm Decline"}
              </button>
              <button
                type="button"
                onClick={() => setShowDeclineForm(false)}
                className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">
          Amortization Schedule
        </h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <AmortizationTable schedule={schedule} />
        )}
      </div>
    </div>
  );
}
