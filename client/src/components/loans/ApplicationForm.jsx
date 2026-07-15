import React, { useState, useEffect } from "react";
import { loanService } from "../../services/api";
import DTIAnalysis from "./DTIAnalysis";
import {
  FileText,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function ApplicationForm({
  product,
  customerId,
  onCancel,
  onSuccess,
}) {
  const [step, setStep] = useState(1); // 1 = Form, 2 = Review
  const [amount, setAmount] = useState("");
  const [tenure, setTenure] = useState("");
  const [income, setIncome] = useState("");
  const [employmentType, setEmploymentType] = useState("salaried");
  const [emi, setEmi] = useState(0);
  const [calculating, setCalculating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill defaults if available
  useEffect(() => {
    if (product) {
      setAmount(
        Math.min(50000, parseFloat(product.max_loan_amount)).toString(),
      );
      setTenure(Math.min(24, product.max_tenure_months).toString());
    }
  }, [product]);

  // Calculate EMI for review screen
  useEffect(() => {
    if (step === 2 && amount && tenure && product) {
      setCalculating(true);
      loanService
        .calculateEMI({
          loan_amount: parseFloat(amount),
          interest_rate: parseFloat(product.interest_rate),
          tenure_months: parseInt(tenure, 10),
        })
        .then((res) => {
          setEmi(res.emi);
          setError("");
        })
        .catch(() => {
          setError("Failed to calculate EMI for review.");
        })
        .finally(() => {
          setCalculating(false);
        });
    }
  }, [step, amount, tenure, product]);

  const validateForm = () => {
    setError("");
    const amt = parseFloat(amount);
    const ten = parseInt(tenure, 10);
    const inc = parseFloat(income);

    if (isNaN(amt) || amt <= 0) {
      setError("Please enter a valid requested amount.");
      return false;
    }
    if (amt > parseFloat(product.max_loan_amount)) {
      setError(
        `Requested amount cannot exceed the maximum allowed limit of $${parseFloat(product.max_loan_amount).toLocaleString()}.`,
      );
      return false;
    }
    if (
      isNaN(ten) ||
      ten < product.min_tenure_months ||
      ten > product.max_tenure_months
    ) {
      setError(
        `Tenure must be between ${product.min_tenure_months} and ${product.max_tenure_months} months.`,
      );
      return false;
    }
    if (isNaN(inc) || inc <= 0) {
      setError("Please enter a valid monthly income.");
      return false;
    }
    return true;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await loanService.createApplication({
        product_id: product.id,
        customer_id: customerId,
        requested_amount: parseFloat(amount),
        tenure_months: parseInt(tenure, 10),
        monthly_income: parseFloat(income),
        employment_type: employmentType,
      });
      onSuccess(res);
    } catch (err) {
      const errMsg =
        err.response?.data?.detail ||
        "Failed to submit application. Please try again.";
      setError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
        <FileText className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-bold text-slate-900">
          Apply for {product.name}
        </h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleNext} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Requested Amount ($)
              </label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="e.g. 50000"
              />
              <p className="text-xs text-slate-500 mt-1">
                Max: ${parseFloat(product.max_loan_amount).toLocaleString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tenure (Months)
              </label>
              <input
                type="number"
                required
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="e.g. 24"
              />
              <p className="text-xs text-slate-500 mt-1">
                Range: {product.min_tenure_months} - {product.max_tenure_months}{" "}
                months
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Monthly Income ($)
              </label>
              <input
                type="number"
                required
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="e.g. 6000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Employment Type
              </label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="salaried">Salaried</option>
                <option value="self-employed">Self-Employed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center gap-1"
            >
              Review Application
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
              Review Details
            </h3>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <span className="text-slate-500">Loan Product:</span>
              <span className="font-semibold text-slate-800">
                {product.name}
              </span>

              <span className="text-slate-500">Interest Rate:</span>
              <span className="font-semibold text-slate-800">
                {product.interest_rate}% p.a.
              </span>

              <span className="text-slate-500">Requested Amount:</span>
              <span className="font-semibold text-slate-800">
                ${parseFloat(amount).toLocaleString()}
              </span>

              <span className="text-slate-500">Tenure:</span>
              <span className="font-semibold text-slate-800">
                {tenure} Months
              </span>

              <span className="text-slate-500">Monthly Income:</span>
              <span className="font-semibold text-slate-800">
                ${parseFloat(income).toLocaleString()}
              </span>

              <span className="text-slate-500">Employment Type:</span>
              <span className="font-semibold text-slate-800 capitalize">
                {employmentType}
              </span>
            </div>
          </div>

          {calculating ? (
            <div className="text-center py-4 text-sm text-slate-500">
              Calculating Debt-to-Income ratio...
            </div>
          ) : (
            <DTIAnalysis emi={emi} monthlyIncome={parseFloat(income)} />
          )}

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Edit
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || calculating}
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1"
            >
              {submitting ? "Submitting..." : "Confirm & Submit"}
              <CheckCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
