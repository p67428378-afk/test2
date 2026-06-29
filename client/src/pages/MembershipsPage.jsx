import React from "react";
import { membershipService } from "../services/api";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";

export default function MembershipsPage() {
  const [memberships, setMemberships] = React.useState([]);
  const [gymName, setGymName] = React.useState("");
  const [membershipType, setMembershipType] = React.useState("Monthly Basic");
  const [monthlyFee, setMonthlyFee] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const popularGyms = [
    "Gold's Gym",
    "Planet Fitness",
    "LA Fitness",
    "Anytime Fitness",
    "24 Hour Fitness",
    "Equinox",
    "OrangeTheory Fitness",
    "F45 Training",
  ];

  const membershipTypes = [
    "Monthly Basic",
    "Monthly Premium",
    "Annual Basic",
    "Annual Premium",
    "Student Pass",
    "Family Plan",
  ];

  const fetchMemberships = async () => {
    try {
      const data = await membershipService.getAll();
      setMemberships(data);
    } catch {
      setError("Failed to load memberships.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMemberships();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await membershipService.create(gymName, membershipType, monthlyFee);
      setSuccess("Membership linked successfully!");
      setGymName("");
      setMonthlyFee("");
      fetchMemberships();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to link membership.");
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
      {/* Form to Link Membership */}
      <div className="lg:col-span-5 glass-card p-lg rounded-xl h-fit space-y-lg">
        <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">
          Link Gym Membership
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              Gym Chain
            </label>
            <select
              required
              value={gymName}
              onChange={(e) => setGymName(e.target.value)}
              className="w-full bg-surface-container-high border border-white/10 rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary transition-colors"
            >
              <option value="">Select a Gym Chain</option>
              {popularGyms.map((gym) => (
                <option key={gym} value={gym}>
                  {gym}
                </option>
              ))}
              <option value="Other">Other / Independent Gym</option>
            </select>
          </div>

          {gymName === "Other" && (
            <InputField
              label="Custom Gym Name"
              required
              placeholder="Enter gym name"
              value={gymName === "Other" ? "" : gymName}
              onChange={(e) => setGymName(e.target.value)}
            />
          )}

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              Membership Type
            </label>
            <select
              required
              value={membershipType}
              onChange={(e) => setMembershipType(e.target.value)}
              className="w-full bg-surface-container-high border border-white/10 rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary transition-colors"
            >
              {membershipTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <InputField
            label="Monthly Fee ($)"
            type="number"
            required
            min="0"
            step="0.01"
            placeholder="e.g. 49.99"
            value={monthlyFee}
            onChange={(e) => setMonthlyFee(e.target.value)}
          />

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Linking..." : "Link Membership"}
          </Button>
        </form>
      </div>

      {/* List of Linked Memberships */}
      <div className="lg:col-span-7 glass-card p-lg rounded-xl space-y-lg">
        <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">
          Linked Memberships
        </h2>
        {memberships.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl mb-2">
              card_membership
            </span>
            <p>No memberships linked yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {memberships.map((membership) => (
              <div
                key={membership.id}
                className="flex items-center justify-between p-md bg-surface-container-high rounded-lg border border-white/5"
              >
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">
                      fitness_center
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">
                      {membership.gym_name}
                    </h4>
                    <p className="text-sm text-on-surface-variant">
                      {membership.membership_type}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono-data font-bold text-primary">
                    ${membership.monthly_fee.toFixed(2)}
                  </p>
                  <p className="text-xs text-on-surface-variant">per month</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
