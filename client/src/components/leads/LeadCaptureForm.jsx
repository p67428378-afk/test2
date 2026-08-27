import React, { useState } from "react";
import { createLead } from "../../services/api.js";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  DollarSign,
  Mail,
  User,
  MessageSquare,
} from "lucide-react";

export default function LeadCaptureForm() {
  const [formData, setFormData] = useState({
    client_name: "",
    email: "",
    budget_range: "$1,000 - $5,000",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const budgetOptions = [
    "< $1,000",
    "$1,000 - $5,000",
    "$5,000 - $10,000",
    "$10,000 - $25,000",
    "$25,000+",
  ];

  const validate = () => {
    const errs = {};
    if (!formData.client_name.trim()) {
      errs.client_name = "Client name is required.";
    }
    if (!formData.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }
    if (!formData.budget_range.trim()) {
      errs.budget_range = "Budget range is required.";
    }
    if (!formData.message.trim()) {
      errs.message = "Project message details are required.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitSuccess(null);
    setSubmitError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createLead({
        client_name: formData.client_name.trim(),
        email: formData.email.trim(),
        budget_range: formData.budget_range.trim(),
        message: formData.message.trim(),
      });

      // ONLY set success on real 2xx response from backend API
      setSubmitSuccess(response);
      setFormData({
        client_name: "",
        email: "",
        budget_range: "$1,000 - $5,000",
        message: "",
      });
      setErrors({});
    } catch (err) {
      // Never synthesize fake success on error. Display error banner and keep form inputs.
      const errorMsg =
        err.response?.data?.detail ||
        (Array.isArray(err.response?.data?.detail)
          ? err.response.data.detail.map((d) => d.msg).join(", ")
          : null) ||
        err.message ||
        "Failed to submit lead inquiry. Please check your network and try again.";
      setSubmitError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-[#E3E8F0] rounded-2xl shadow-sm p-6 sm:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-[#171C29] tracking-tight">
          Let&apos;s Build Something Great
        </h3>
        <p className="text-sm text-[#707A8C] mt-1">
          Have an upcoming project or need consulting? Fill out the brief form
          below to start the conversation.
        </p>
      </div>

      {submitSuccess && (
        <div
          role="alert"
          data-testid="lead-success-message"
          className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-emerald-800">
              Inquiry submitted successfully!
            </p>
            <p className="text-emerald-700 mt-0.5">
              Thank you, {submitSuccess.client_name}. Your message has been
              received with status &quot;{submitSuccess.status || "new"}&quot;.
              I will get back to you within 24 hours.
            </p>
          </div>
        </div>
      )}

      {submitError && (
        <div
          role="alert"
          data-testid="lead-error-message"
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-red-800">Submission Error</p>
            <p className="text-red-700 mt-0.5">{submitError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label
            htmlFor="client_name"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Your Name / Company <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="client_name"
              name="client_name"
              type="text"
              placeholder="e.g. Jane Smith or Acme Corp"
              value={formData.client_name}
              onChange={handleChange}
              className={`w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                errors.client_name
                  ? "border-red-300 focus:ring-red-500 bg-red-50/30"
                  : "border-[#E3E8F0] focus:ring-blue-500 bg-white"
              }`}
            />
          </div>
          {errors.client_name && (
            <p className="text-xs text-red-600 mt-1">{errors.client_name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="e.g. jane@example.com"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-300 focus:ring-red-500 bg-red-50/30"
                  : "border-[#E3E8F0] focus:ring-blue-500 bg-white"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-600 mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="budget_range"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Estimated Budget Range <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              id="budget_range"
              name="budget_range"
              value={formData.budget_range}
              onChange={handleChange}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#E3E8F0] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {budgetOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          {errors.budget_range && (
            <p className="text-xs text-red-600 mt-1">{errors.budget_range}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Project Description &amp; Requirements{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Tell me about your goals, timelines, and technical requirements..."
              value={formData.message}
              onChange={handleChange}
              className={`w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                errors.message
                  ? "border-red-300 focus:ring-red-500 bg-red-50/30"
                  : "border-[#E3E8F0] focus:ring-blue-500 bg-white"
              }`}
            />
          </div>
          {errors.message && (
            <p className="text-xs text-red-600 mt-1">{errors.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium text-sm shadow-sm transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting Inquiry...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send Project Inquiry</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
