import React from "react";
import { Link } from "react-router-dom";
import KPICard from "../components/dashboard/KPICard";
import AttendanceChart from "../components/dashboard/AttendanceChart";
import ValueGauge from "../components/dashboard/ValueGauge";
import AlternativeCard from "../components/dashboard/AlternativeCard";
import { analysisService } from "../services/api";

export default function DashboardPage() {
  const [analysis, setAnalysis] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const data = await analysisService.getAnalysis();
        setAnalysis(data);
      } catch {
        setError(
          "Failed to load dashboard analysis. Please make sure you have linked a membership.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (
    error ||
    !analysis ||
    !analysis.memberships_analysis ||
    analysis.memberships_analysis.length === 0
  ) {
    return (
      <div className="glass-card p-8 rounded-xl text-center max-w-lg mx-auto mt-12">
        <span className="material-symbols-outlined text-6xl text-primary mb-4">
          fitness_center
        </span>
        <h2 className="text-2xl font-bold text-on-surface mb-2">
          No Active Memberships
        </h2>
        <p className="text-on-surface-variant mb-6">
          Link your gym membership details to start tracking your visits and
          analyzing your value-for-money goals.
        </p>
        <Link
          to="/memberships"
          className="bg-primary text-on-primary font-bold px-6 py-3 rounded-lg hover:bg-primary-fixed transition-colors inline-block shadow-[0_0_15px_rgba(192,193,255,0.2)]"
        >
          Link Membership
        </Link>
      </div>
    );
  }

  const activeAnalysis = analysis.memberships_analysis[0];

  return (
    <div className="space-y-2xl">
      {/* Row 1: KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <KPICard
          title="Active Membership"
          subtitle={`${activeAnalysis.gym_name} - ${activeAnalysis.membership_type}`}
          value={`$${activeAnalysis.monthly_fee.toFixed(2)}/mo`}
          icon="fitness_center"
          variant="primary"
          progress={100}
        />
        <KPICard
          title="Visits This Month"
          subtitle={`${activeAnalysis.total_visits} visits`}
          value={`${activeAnalysis.total_visits} / 8 Target`}
          icon="directions_run"
          variant="secondary"
          progress={(activeAnalysis.total_visits / 8) * 100}
        />
        <KPICard
          title="Current Cost Per Visit"
          subtitle={activeAnalysis.status}
          value={`$${activeAnalysis.cost_per_visit.toFixed(2)}`}
          icon="account_balance_wallet"
          variant="warning"
          alert={activeAnalysis.status === "Underutilized"}
        />
      </section>

      {/* Row 2: Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        <div className="lg:col-span-7 flex">
          <AttendanceChart
            data={activeAnalysis.attendance_frequency || [0, 0, 0, 0]}
          />
        </div>
        <ValueGauge
          efficiency={activeAnalysis.utilization_percentage}
          waste={activeAnalysis.estimated_monthly_waste}
          targetVisits={8}
          currentVisits={activeAnalysis.total_visits}
        />
      </section>

      {/* Row 3: Alternatives */}
      {activeAnalysis.alternatives &&
        activeAnalysis.alternatives.length > 0 && (
          <section className="space-y-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                Cost-Effective Alternatives
              </h2>
              <span className="font-label-sm text-label-sm text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                Data-driven recommendations
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              {activeAnalysis.alternatives.map((alt, index) => (
                <AlternativeCard
                  key={index}
                  name={alt.name}
                  description={alt.description}
                  estimatedCost={alt.estimated_monthly_cost}
                  estimatedSavings={alt.estimated_savings}
                  actionLabel={index === 0 ? "Switch" : "Explore"}
                  onAction={() => alert(`Initiating switch to ${alt.name}`)}
                />
              ))}
            </div>
          </section>
        )}
    </div>
  );
}
