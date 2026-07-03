import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { eventService } from "../services/api";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import RegistrationModal from "../components/events/RegistrationModal";

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Feedback states
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const data = await eventService.getEvent(eventId);
        setEvent(data);
      } catch (err) {
        setError("Event not found or failed to load details.");
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [eventId]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackSubmitting(true);
    setFeedbackError("");
    try {
      // Call feedback endpoint
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/api/v1/events/${eventId}/feedback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating: parseInt(rating), comments }),
        },
      );
      if (!response.ok) throw new Error("Failed to submit feedback");
      setFeedbackSuccess(true);
      setComments("");
    } catch (err) {
      setFeedbackError("Failed to submit feedback. Please try again.");
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 flex-grow">
        <RefreshCw className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-4xl mx-auto px-gutter py-12 text-center flex-grow">
        <div className="text-error font-bold text-lg mb-4">
          {error || "Event not found"}
        </div>
        <Link
          to="/"
          className="text-primary hover:underline flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Events
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(event.date_time).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const defaultImage =
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="max-w-4xl mx-auto px-margin-mobile md:px-gutter py-xl flex-grow flex flex-col gap-lg">
      <Link
        to="/"
        className="text-on-surface-variant hover:text-primary flex items-center gap-2 font-label-md self-start transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Events
      </Link>

      <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm">
        <div className="relative w-full aspect-[21/9] bg-surface-container-low">
          <img
            className="w-full h-full object-cover"
            src={event.image_url || defaultImage}
            alt={event.title}
            onError={(e) => {
              e.target.src = defaultImage;
            }}
          />
          <div className="absolute top-4 left-4">
            <Badge category={event.category} />
          </div>
        </div>

        <div className="p-lg md:p-xl flex flex-col gap-md">
          <h1 className="font-display text-headline-lg font-bold text-on-background">
            {event.title}
          </h1>

          <div className="flex flex-wrap gap-md border-y border-outline-variant/20 py-md">
            <div className="flex items-center gap-2 text-on-surface-variant font-label-md">
              <Calendar className="w-5 h-5 text-primary" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant font-label-md">
              <MapPin className="w-5 h-5 text-primary" />
              <span>{event.location}</span>
            </div>
          </div>

          <div className="flex flex-col gap-sm">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-background">
              About this Event
            </h2>
            <p className="text-on-surface-variant font-body-md whitespace-pre-line leading-relaxed">
              {event.description}
            </p>
          </div>

          <div className="mt-lg flex justify-end">
            <Button
              variant="primary"
              onClick={() => setShowRegisterModal(true)}
              className="px-8 py-3 text-lg"
            >
              Register for Event
            </Button>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="bg-surface-container-lowest rounded-xl p-lg md:p-xl border border-outline-variant/20 shadow-sm flex flex-col gap-md">
        <h2 className="font-headline-sm text-headline-sm font-bold text-on-background">
          Provide Feedback
        </h2>
        <p className="text-on-surface-variant font-body-md">
          Have you attended this event? Let us know how it went!
        </p>

        {feedbackSuccess ? (
          <div className="p-4 bg-primary-container/10 border border-primary-container/20 text-primary rounded-lg flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-primary-container" />
            <span className="font-semibold">
              Thank you for your feedback! Your response has been recorded.
            </span>
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-4">
            {feedbackError && (
              <div className="p-3 bg-error-container/30 border border-error/20 text-error rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle className="w-5 h-5" />
                <span>{feedbackError}</span>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label
                className="font-label-sm text-label-sm text-on-surface-variant"
                htmlFor="rating-select"
              >
                Rating
              </label>
              <select
                id="rating-select"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-32 px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md text-on-background"
              >
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Very Good</option>
                <option value={3}>3 - Good</option>
                <option value={2}>2 - Fair</option>
                <option value={1}>1 - Poor</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label
                className="font-label-sm text-label-sm text-on-surface-variant"
                htmlFor="comments-textarea"
              >
                Comments
              </label>
              <textarea
                id="comments-textarea"
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md text-on-background"
                placeholder="Share your thoughts about the event..."
              />
            </div>

            <Button
              type="submit"
              disabled={feedbackSubmitting}
              className="self-start"
            >
              {feedbackSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        )}
      </div>

      {showRegisterModal && (
        <RegistrationModal
          event={event}
          onClose={() => setShowRegisterModal(false)}
        />
      )}
    </div>
  );
}
