import React, { useState, useEffect } from "react";
import { Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { availabilityService } from "../services/api";
import CalendarGrid from "../components/availability/CalendarGrid";

export default function AvailabilityPage() {
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const fetchAvailability = async () => {
    try {
      const data = await availabilityService.getAvailability();
      // Extract unavailable_date strings
      const dates = data.map((item) => item.unavailable_date);
      setUnavailableDates(dates);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch availability:", err);
      setError("Failed to load availability schedule.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const handleToggleDate = (dateStr) => {
    setUnavailableDates((prev) => {
      if (prev.includes(dateStr)) {
        return prev.filter((d) => d !== dateStr);
      } else {
        return [...prev, dateStr];
      }
    });
    setSuccess(false); // Reset success banner on change
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await availabilityService.updateAvailability(unavailableDates);
      setSuccess(true);
    } catch (err) {
      console.error("Failed to update availability:", err);
      setError("Failed to save availability changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-on-surface-variant mt-4">
          Loading availability schedule...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">
            Availability Management
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Set your unavailable dates to prevent booking conflicts.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-primary text-on-primary-container font-semibold rounded-lg hover:brightness-110 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-on-primary-container"></div>
              Saving...
            </>
          ) : (
            "Save Schedule"
          )}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 text-error rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-primary/10 border border-primary/20 text-primary rounded-xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5" />
          <span>Availability schedule updated successfully!</span>
        </div>
      )}

      <CalendarGrid
        unavailableDates={unavailableDates}
        onToggleDate={handleToggleDate}
      />
    </div>
  );
}
