import React, { useState } from "react";
import { inquiryService } from "../../services/api";

export default function InquiryForm({ propertyId, onInquirySubmitted }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message:
      "I am interested in this property and would like to schedule a viewing.",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await inquiryService.submit({
        ...formData,
        property_id: propertyId,
      });
      setSuccess(true);
      if (onInquirySubmitted) {
        onInquirySubmitted();
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          "Failed to submit inquiry. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-secondary-container/20 border border-secondary text-on-secondary-container p-md rounded-lg text-center">
        <span className="material-symbols-outlined text-secondary text-[32px] mb-xs">
          check_circle
        </span>
        <h4 className="font-bold text-body-lg mb-xs">Inquiry Sent!</h4>
        <p className="text-body-sm">The broker will contact you shortly.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-md bg-surface-container-low p-md rounded-lg border border-outline-variant/50"
    >
      <h4 className="font-headline-sm text-body-lg font-bold text-on-surface">
        Contact Broker
      </h4>
      {error && (
        <div className="bg-error-container text-on-error-container p-sm rounded text-body-sm">
          {error}
        </div>
      )}
      <div>
        <label
          className="block text-label-sm text-on-surface-variant mb-xs"
          htmlFor="name"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:outline-none focus:border-primary"
          placeholder="Your Name"
        />
      </div>
      <div>
        <label
          className="block text-label-sm text-on-surface-variant mb-xs"
          htmlFor="email"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:outline-none focus:border-primary"
          placeholder="your.email@example.com"
        />
      </div>
      <div>
        <label
          className="block text-label-sm text-on-surface-variant mb-xs"
          htmlFor="message"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows="4"
          required
          value={formData.message}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:outline-none focus:border-primary"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-primary-container text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Inquiry"}
      </button>
    </form>
  );
}
