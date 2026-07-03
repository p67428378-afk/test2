import React, { useState } from "react";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import { eventService } from "../../services/api";
import Button from "../common/Button";

export default function RegistrationModal({ event, onClose }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [agreeReminders, setAgreeReminders] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await eventService.registerForEvent(event.id, {
        full_name: fullName,
        email,
        phone_number: phoneNumber || null,
        agree_reminders: agreeReminders,
      });
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Registration failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-md w-full overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:bg-surface-container-low p-1.5 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-lg">
          {!success ? (
            <>
              <h2 className="font-headline-md text-headline-md font-bold text-on-background mb-2">
                Register for Event
              </h2>
              <p className="text-on-surface-variant font-body-md mb-6">
                You are registering for{" "}
                <span className="font-semibold text-primary">
                  {event.title}
                </span>
                .
              </p>

              {error && (
                <div className="mb-4 p-3 bg-error-container/30 border border-error/20 text-error rounded-lg flex items-start gap-2 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label
                    className="font-label-sm text-label-sm text-on-surface-variant"
                    htmlFor="fullName"
                  >
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md text-on-background"
                    placeholder="John Doe"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    className="font-label-sm text-label-sm text-on-surface-variant"
                    htmlFor="email"
                  >
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md text-on-background"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    className="font-label-sm text-label-sm text-on-surface-variant"
                    htmlFor="phone"
                  >
                    Phone Number (Optional)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md text-on-background"
                    placeholder="(123) 456-7890"
                  />
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <input
                    id="reminders"
                    type="checkbox"
                    checked={agreeReminders}
                    onChange={(e) => setAgreeReminders(e.target.checked)}
                    className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary cursor-pointer"
                  />
                  <label
                    htmlFor="reminders"
                    className="font-label-sm text-label-sm text-on-surface-variant cursor-pointer select-none"
                  >
                    I agree to receive automatic email reminders 24 hours before
                    the event.
                  </label>
                </div>

                <div className="flex gap-3 mt-4 justify-end">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Registering..." : "Confirm Registration"}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-6 flex flex-col items-center gap-4">
              <CheckCircle2 className="w-16 h-16 text-primary-container" />
              <h2 className="font-headline-md text-headline-md font-bold text-on-background">
                Registration Successful!
              </h2>
              <p className="text-on-surface-variant font-body-md max-w-xs">
                You have successfully registered for{" "}
                <span className="font-semibold text-primary">
                  {event.title}
                </span>
                . A confirmation email has been sent to{" "}
                <span className="font-semibold">{email}</span>.
              </p>
              <Button
                variant="primary"
                onClick={onClose}
                className="mt-4 w-full"
              >
                Close Window
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
