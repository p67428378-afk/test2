import React from "react";
import { visitService, membershipService } from "../services/api";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";

export default function VisitsPage() {
  const [visits, setVisits] = React.useState([]);
  const [memberships, setMemberships] = React.useState([]);
  const [selectedMembership, setSelectedMembership] = React.useState("");
  const [visitDate, setVisitDate] = React.useState(
    new Date().toISOString().split("T")[0],
  );
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const fetchData = async () => {
    try {
      const [membershipsData, visitsData] = await Promise.all([
        membershipService.getAll(),
        visitService.getAll(),
      ]);
      setMemberships(membershipsData);
      setVisits(visitsData);
      if (membershipsData.length > 0) {
        setSelectedMembership(membershipsData[0].id);
      }
    } catch {
      setError("Failed to load visits or memberships.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await visitService.create(selectedMembership, visitDate);
      setSuccess("Gym visit logged successfully!");
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to log visit.");
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
      {/* Form to Log Visit */}
      <div className="lg:col-span-5 glass-card p-lg rounded-xl h-fit space-y-lg">
        <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">
          Log Gym Visit
        </h2>
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
        {memberships.length === 0 ? (
          <div className="text-center py-6 text-on-surface-variant">
            <p className="mb-4">
              You need to link a membership first before logging visits.
            </p>
            <Button onClick={() => (window.location.href = "/memberships")}>
              Link Membership
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">
                Select Membership
              </label>
              <select
                required
                value={selectedMembership}
                onChange={(e) => setSelectedMembership(e.target.value)}
                className="w-full bg-surface-container-high border border-white/10 rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary transition-colors"
              >
                {memberships.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.gym_name} ({m.membership_type})
                  </option>
                ))}
              </select>
            </div>

            <InputField
              label="Visit Date"
              type="date"
              required
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
            />

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Logging..." : "Log Visit"}
            </Button>
          </form>
        )}
      </div>

      {/* List of Logged Visits */}
      <div className="lg:col-span-7 glass-card p-lg rounded-xl space-y-lg">
        <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">
          Visit History
        </h2>
        {visits.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl mb-2">
              calendar_today
            </span>
            <p>No visits logged yet.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {visits.map((visit) => {
              const membership = memberships.find(
                (m) => m.id === visit.membership_id,
              );
              return (
                <div
                  key={visit.id}
                  className="flex items-center justify-between p-md bg-surface-container-high rounded-lg border border-white/5"
                >
                  <div className="flex items-center gap-md">
                    <div className="w-10 h-10 rounded bg-secondary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary">
                        directions_run
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface">
                        {membership ? membership.gym_name : "Gym Visit"}
                      </h4>
                      <p className="text-sm text-on-surface-variant">
                        {new Date(visit.visit_date).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
