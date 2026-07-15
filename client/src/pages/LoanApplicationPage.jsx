import React, { useState } from "react";
import ApplicationForm from "../components/loans/ApplicationForm";
import { CheckCircle, ArrowLeft, FileText } from "lucide-react";

export default function LoanApplicationPage({
  product,
  customerId,
  onCancel,
  onNavigateToTracking,
}) {
  const [successResult, setSuccessResult] = useState(null);

  const handleSuccess = (result) => {
    setSuccessResult(result);
  };

  if (successResult) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center space-y-6 my-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 mb-2">
          <CheckCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">
            Application Submitted!
          </h2>
          <p className="text-slate-500 text-sm">
            Your application for the <strong>{product.name}</strong> has been
            successfully received.
          </p>
        </div>

        <div className="bg-slate-50 rounded-lg p-4 text-left text-sm space-y-2 border border-slate-100">
          <div className="flex justify-between">
            <span className="text-slate-500">Application ID:</span>
            <span className="font-mono text-xs text-slate-700">
              {successResult.application_id}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Status:</span>
            <span className="font-semibold text-indigo-600">
              {successResult.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Submitted At:</span>
            <span className="text-slate-700">
              {new Date(successResult.submitted_at).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <button
            onClick={onNavigateToTracking}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Track My Applications
          </button>
          <button
            onClick={onCancel}
            className="w-full px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onCancel}
        className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Products
      </button>

      <ApplicationForm
        product={product}
        customerId={customerId}
        onCancel={onCancel}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
