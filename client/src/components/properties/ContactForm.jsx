import React, { useState } from "react";
import { submitContactForm } from "../../services/api";

export default function ContactForm({ propertyId, onInquirySubmitted }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("test@example.com");
  const [message, setMessage] = useState(
    "I am interested in this property. Please provide more details.",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !message.trim()) {
      setStatus({ type: "error", text: "Please fill in all fields." });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", text: "" });

    try {
      const response = await submitContactForm({
        property_id: propertyId,
        user_name: fullName,
        user_email: email,
        message: message,
      });
      setStatus({
        type: "success",
        text: "Your inquiry has been submitted successfully!",
      });
      setFullName("");
      if (onInquirySubmitted) {
        onInquirySubmitted(response);
      }
    } catch (err) {
      console.error("Error submitting contact form:", err);
      const errorMsg = err.response?.data?.detail
        ? typeof err.response.data.detail === "string"
          ? err.response.data.detail
          : JSON.stringify(err.response.data.detail)
        : "Failed to submit inquiry. Please try again.";
      setStatus({ type: "error", text: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
      <h4 className="font-label-md text-label-md font-semibold text-slate-900 mb-4">
        Contact Broker
      </h4>

      {status.text && (
        <div
          role="alert"
          className={`p-3 rounded-lg mb-4 text-sm font-medium ${
            status.type === "success"
              ? "bg-emerald-50 text-primary-container border border-primary-container/20"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}
        >
          {status.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-label-md text-label-sm text-slate-900 mb-1">
              Full Name
            </label>
            <input
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body-sm text-body-sm"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Alex Mercer"
              required
            />
          </div>
          <div>
            <label className="block font-label-md text-label-sm text-slate-900 mb-1">
              Email
            </label>
            <input
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body-sm text-body-sm"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
              required
            />
          </div>
        </div>
        <div>
          <label className="block font-label-md text-label-sm text-slate-900 mb-1">
            Message
          </label>
          <textarea
            className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body-sm text-body-sm"
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        <button
          className="w-full bg-primary-container text-white px-6 py-3 rounded-lg font-label-md text-label-md hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Inquiry"}
        </button>
      </form>
      <div className="mt-2 text-xs text-slate-500 text-center">
        Test account: test@example.com / testpassword
      </div>
    </div>
  );
}
