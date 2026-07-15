import React, { useState, useEffect } from "react";
import { loanService } from "../services/api";
import ApplicationsTable from "../components/loans/ApplicationsTable";
import EvaluationPanel from "../components/loans/EvaluationPanel";
import { ShieldAlert, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";

export default function OfficerPortalPage({ officerEmail }) {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // For simplicity, we fetch applications for the test customer to evaluate
  // In a real system, there would be a global GET /api/v1/loans/applications endpoint,
  // but since the spec only defines GET /api/v1/customers/{customerId}/applications,
  // we fetch the test customer's applications (UUID: 00000000-0000-0000-0000-000000000001)
  const testCustomerId = "00000000-0000-0000-0000-000000000001";

  const fetchApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await loanService.getCustomerApplications(
        testCustomerId,
        officerEmail,
      );
      setApplications(data);
    } catch (err) {
      setError(
        "Failed to load applications. Ensure you are authorized as a loan officer.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [officerEmail]);

  const handleDecisionSuccess = () => {
    setSelectedApp(null);
    setSuccessMessage("Action submitted successfully!");
    fetchApplications();
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-indigo-600" />
            Loan Officer Portal
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Review, evaluate, and make decisions on submitted loan applications.
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

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {selectedApp ? (
        <EvaluationPanel
          application={selectedApp}
          officerEmail={officerEmail}
          onDecisionSubmitted={handleDecisionSuccess}
          onCancel={() => setSelectedApp(null)}
        />
      ) : loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Pending Evaluations
          </h3>
          <ApplicationsTable
            applications={applications}
            onSelectApplication={setSelectedApp}
          />
        </div>
      )}
    </div>
  );
}
