import React, { useState } from "react";
import { Mail, User, MessageSquare, Send, CheckCircle } from "lucide-react";
import { submitContactForm } from "../services/api";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await submitContactForm(formData);
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to send inquiry. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-margin-mobile md:px-margin-desktop flex items-center justify-center">
      <div className="max-w-md w-full bg-surface border border-outline-variant/30 rounded-xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="font-headline-md text-headline-md text-primary mb-2">
            Get in Touch
          </h1>
          <p className="font-body-md text-on-surface-variant">
            Have questions or want to discuss a custom shoot? Send us a message!
          </p>
        </div>

        {success ? (
          <div className="text-center py-8 animate-scale-up">
            <CheckCircle className="h-16 w-16 text-tertiary-fixed-dim mx-auto mb-4" />
            <h2 className="font-headline-sm text-headline-sm text-primary mb-2">
              Inquiry Sent!
            </h2>
            <p className="font-body-md text-on-surface-variant mb-6">
              Thank you for reaching out. We will get back to you as soon as
              possible.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="bg-primary text-on-primary font-button text-button px-6 py-3 rounded-lg transition-all duration-200 hover:bg-primary-container active:scale-95"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                className="bg-error-container text-on-error-container p-4 rounded-lg text-body-md font-medium"
                role="alert"
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block font-label-caps text-label-caps text-on-surface-variant mb-2"
              >
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-outline-variant" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest text-on-surface font-body-md"
                  placeholder="Jane Smith"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block font-label-caps text-label-caps text-on-surface-variant mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-outline-variant" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest text-on-surface font-body-md"
                  placeholder="jane@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block font-label-caps text-label-caps text-on-surface-variant mb-2"
              >
                Message
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-4 h-5 w-5 text-outline-variant" />
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest text-on-surface font-body-md"
                  placeholder="Tell us about your photography needs..."
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary font-button text-button py-4 rounded-lg transition-all duration-200 hover:bg-primary-container active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                "Sending..."
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Message
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
