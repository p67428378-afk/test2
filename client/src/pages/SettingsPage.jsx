import React from "react";
import { notificationService } from "../services/api";
import InputField from "../components/common/InputField";
import Toggle from "../components/common/Toggle";
import Button from "../components/common/Button";

export default function SettingsPage() {
  const [inactiveDays, setInactiveDays] = React.useState("14");
  const [costThreshold, setCostThreshold] = React.useState("10.00");
  const [emailEnabled, setEmailEnabled] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Call configure with nulls to fetch current settings without modifying them
        const data = await notificationService.configure(null, null, null);
        if (data) {
          setInactiveDays(data.inactive_days_threshold.toString());
          setCostThreshold(
            data.cost_per_visit_threshold
              ? data.cost_per_visit_threshold.toString()
              : "",
          );
          setEmailEnabled(data.email_notifications_enabled);
        }
      } catch {
        setError("Failed to load notification settings.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await notificationService.configure(
        inactiveDays ? parseInt(inactiveDays) : null,
        costThreshold ? parseFloat(costThreshold) : null,
        emailEnabled,
      );
      setSuccess("Notification settings updated successfully!");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update settings.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto glass-card p-lg rounded-xl space-y-lg">
      <div className="border-b border-white/5 pb-sm">
        <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">
          Notification Settings
        </h2>
        <p className="text-sm text-on-surface-variant mt-1">
          Configure alerts and thresholds to keep your gym membership
          cost-effective.
        </p>
      </div>

      {error && (
        <div className="bg-error-container/20 border border-error-container/30 text-error p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-secondary-container/20 border border-secondary-container/30 text-secondary p-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Toggle
          label="Enable Email Notifications"
          checked={emailEnabled}
          onChange={setEmailEnabled}
        />

        <InputField
          label="Inactive Days Threshold"
          type="number"
          required
          min="1"
          placeholder="e.g. 14"
          value={inactiveDays}
          onChange={(e) => setInactiveDays(e.target.value)}
        />
        <p className="text-xs text-on-surface-variant -mt-4">
          Receive an alert if you haven't visited the gym for this many
          consecutive days.
        </p>

        <InputField
          label="Cost Per Visit Alert Threshold ($)"
          type="number"
          min="0"
          step="0.01"
          placeholder="e.g. 15.00"
          value={costThreshold}
          onChange={(e) => setCostThreshold(e.target.value)}
        />
        <p className="text-xs text-on-surface-variant -mt-4">
          Receive an alert if your calculated cost per visit exceeds this
          amount.
        </p>

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}
