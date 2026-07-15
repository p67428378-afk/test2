import React, { useState, useEffect } from "react";
import { loanService } from "../services/api";
import ApplicationsTable from "../components/loans/ApplicationsTable";
import LoanOfferPage from "./LoanOfferPage";
import { RefreshCw, AlertCircle, ShieldCheck } from "lucide-react";

export default function MyApplicationsPage({ customerId, userEmail }) {
  const [applications, setApplications] = useState([]);
  const [selectedOfferApp, setSelectedOfferApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await loanService.getCustomerApplications(
        customerId,
        userEmail,
      );
      setApplications(data);
    } catch (err) {
      setError("Failed to load your applications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchApplications();
    }
  }, [customerId, userEmail]);

  const handleDecisionSuccess = () => {
    setSelectedOfferApp(null);
    fetchApplications();
  };

  if (selectedOfferApp) {
    return (
      <LoanOfferPage
        application={selectedOfferApp}
        userEmail={userEmail}
        onBack={() => setSelectedOfferApp(null)}
        onDecisionSubmitted={handleDecisionSuccess}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            My Applications
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track the real-time status of your submitted loan applications.
          </p>
        </div>
        <button
          onClick={fetchApplications}
          className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2 text-slate-500" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <ApplicationsTable
          applications={applications}
          onViewOffer={(app) => setSelectedOfferApp(app)}
        />
      )}

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-sm text-indigo-800">
          <p className="font-semibold">Secure Financial Tracking</p>
          <p className="mt-1 text-indigo-700/90">
            Your financial data is handled securely. Only you and authorized
            loan officers can access these application details.
          </p>
        </div>
      </div>
    </div>
  );
}
