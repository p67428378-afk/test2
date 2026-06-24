import React, { useState, useEffect } from "react";
import { getDashboardData, submitDecision } from "../services/api";
import KPIHeaderStrip from "../components/portfolio/KPIHeaderStrip";
import ProductPerformanceTable from "../components/portfolio/ProductPerformanceTable";
import ScenarioSelector from "../components/portfolio/ScenarioSelector";
import ApprovalReviewPanel from "../components/portfolio/ApprovalReviewPanel";
import InlineConfirmationBanner from "../components/portfolio/InlineConfirmationBanner";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [products, setProducts] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [decision, setDecision] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardData();
      setKpis(data.kpis);
      setProducts(data.products);
      setScenarios(data.scenarios);

      // Pre-select "Balanced" scenario
      const balanced = data.scenarios.find((s) => s.name === "Balanced");
      if (balanced) {
        setSelectedScenarioId(balanced.id);
      } else if (data.scenarios.length > 0) {
        setSelectedScenarioId(data.scenarios[0].id);
      }
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectScenario = (id) => {
    setSelectedScenarioId(id);
    // Clear previous decision banner when switching scenarios
    setDecision(null);
  };

  const handleSubmit = async () => {
    if (!selectedScenarioId) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await submitDecision(selectedScenarioId, "Ananya Sharma");
      setDecision(result);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to submit decision. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const selectedScenario = scenarios.find((s) => s.id === selectedScenarioId);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="text-on-surface font-body-md antialiased overflow-hidden flex h-screen w-full bg-[#0F172A]">
      {/* Sidebar */}
      <aside className="sidebar-bg fixed left-0 top-0 h-full w-[260px] flex flex-col p-stack_md z-20 hidden md:flex">
        <div className="flex items-center gap-3 mb-stack_lg px-2">
          <div className="w-8 h-8 rounded-sm bg-indigo-primary flex items-center justify-center text-white font-bold">
            CI
          </div>
          <div>
            <h1 className="font-headline-sm text-sm font-bold text-indigo-primary">
              Capital Intel
            </h1>
            <p className="font-label-mono text-[10px] text-slate-muted">
              Product Management
            </p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          <a
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface-container-high text-indigo-primary font-bold border-r-2 border-indigo-primary opacity-80 scale-95 transition-all"
            href="#"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              dashboard
            </span>
            <span className="font-body-md text-sm">Portfolio Dashboard</span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors text-sm"
            href="#"
          >
            <span className="material-symbols-outlined">history</span>
            <span className="font-body-md">Audit Logs</span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors text-sm"
            href="#"
          >
            <span className="material-symbols-outlined">rule</span>
            <span className="font-body-md">Compliance Rules</span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors text-sm"
            href="#"
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="font-body-md">Settings</span>
          </a>
        </nav>

        <div className="mt-auto pt-4 border-t border-outline-variant">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-bold text-sm">
              AS
            </div>
            <div>
              <p className="font-body-md font-bold text-on-surface text-sm">
                Ananya Sharma
              </p>
              <p className="font-body-sm text-slate-muted text-xs">
                Product Manager
              </p>
              <p className="font-label-mono text-[10px] text-slate-muted mt-0.5">
                Semi-Urban/Rural Cluster A
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-0 md:ml-[260px] h-screen flex flex-col bg-[#0F172A] overflow-y-auto">
        <header className="bg-surface sticky top-0 z-10 border-b border-outline-variant flex justify-between items-center px-container_gutter h-16 w-full">
          <div className="flex items-center gap-4">
            <div>
              <nav className="flex text-slate-muted font-body-sm mb-0.5 text-xs">
                <ol className="flex items-center space-x-2">
                  <li>
                    <a
                      className="hover:text-primary transition-colors"
                      href="#"
                    >
                      Portfolio
                    </a>
                  </li>
                  <li>
                    <span className="material-symbols-outlined text-[14px]">
                      chevron_right
                    </span>
                  </li>
                  <li class="text-on-surface font-medium">Decision Support</li>
                </ol>
              </nav>
              <h2 className="font-headline-md text-xl text-on-surface font-bold">
                Product Portfolio Optimizer
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-muted text-[18px]">
                search
              </span>
              <input
                className="w-64 bg-[#0F172A] border border-outline-variant rounded-full py-1.5 pl-9 pr-4 font-body-sm text-on-surface focus:outline-none focus:border-indigo-primary focus:ring-1 focus:ring-indigo-primary transition-colors placeholder-slate-500 text-sm"
                placeholder="Search products..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              className="text-on-surface-variant hover:bg-surface-container-highest rounded-full p-2 transition-colors relative"
              title="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-status rounded-full"></span>
            </button>
            <button
              onClick={fetchData}
              className="text-on-surface-variant hover:bg-surface-container-highest rounded-full p-2 transition-colors"
              title="Refresh"
              aria-label="Refresh data"
            >
              <span className="material-symbols-outlined">refresh</span>
            </button>
          </div>
        </header>

        <div className="p-container_gutter flex flex-col gap-stack_md pb-12">
          {error && (
            <div
              className="w-full bg-rose-status-light border border-rose-500/30 rounded-lg p-4 flex items-start gap-3"
              data-testid="error-banner"
            >
              <span className="material-symbols-outlined text-rose-status mt-0.5">
                error
              </span>
              <div className="flex-1">
                <p className="font-body-sm text-on-surface text-sm">{error}</p>
              </div>
            </div>
          )}

          {decision && (
            <InlineConfirmationBanner
              decision={decision}
              onClose={() => setDecision(null)}
            />
          )}

          <KPIHeaderStrip kpis={kpis} loading={loading} />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-stack_md">
            <div className="xl:col-span-8">
              <ProductPerformanceTable
                products={filteredProducts}
                loading={loading}
              />
            </div>
            <div className="xl:col-span-4">
              <ScenarioSelector
                scenarios={scenarios}
                selectedScenarioId={selectedScenarioId}
                onSelectScenario={handleSelectScenario}
                loading={loading}
              />
            </div>
          </div>

          <ApprovalReviewPanel
            scenario={selectedScenario}
            onSubmit={handleSubmit}
            submitting={submitting}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
}
