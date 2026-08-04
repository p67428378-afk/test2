import React, { useState, useEffect } from "react";
import Sidebar from "./components/layout/Sidebar.jsx";
import Header from "./components/layout/Header.jsx";
import Dashboard from "./components/Dashboard.jsx";
import SKUViewPanel from "./components/dashboard/SKUViewPanel.jsx";
import ClusterSelectPanel from "./components/dashboard/ClusterSelectPanel.jsx";
import OptimizationPanel from "./components/dashboard/OptimizationPanel.jsx";
import AuditTrailPanel from "./components/dashboard/AuditTrailPanel.jsx";
import SettingsModal from "./components/common/SettingsModal.jsx";
import NotificationsDrawer from "./components/common/NotificationsDrawer.jsx";
import {
  fetchKPIs,
  fetchSKUs,
  fetchScenarios,
  submitRecommendation,
  authService,
} from "./services/api.js";

export default function App() {
  const [user, setUser] = useState({
    id: "00000000-0000-0000-0000-000000000000",
    full_name: "Aarchi Jain",
    role: "Category Manager",
  });

  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeTopNav, setActiveTopNav] = useState("scenarios");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [kpiData, setKpiData] = useState(null);
  const [skusData, setSkusData] = useState([]);
  const [scenariosData, setScenariosData] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState({
    id: "balanced",
    label: "Balanced",
    projected_sales_delta_pct: 4.5,
    projected_pb_share_pct: 28.5,
    shelf_capacity_impact_pct: 1.2,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      setIsLoading(true);
      try {
        const [kpiRes, skusRes, scenarioRes] = await Promise.allSettled([
          fetchKPIs("small-town-value"),
          fetchSKUs("small-town-value", "Snacks"),
          fetchScenarios(),
        ]);

        if (isMounted) {
          if (kpiRes.status === "fulfilled") setKpiData(kpiRes.value);
          if (skusRes.status === "fulfilled" && skusRes.value?.skus)
            setSkusData(skusRes.value.skus);
          if (
            scenarioRes.status === "fulfilled" &&
            scenarioRes.value?.scenarios
          ) {
            setScenariosData(scenarioRes.value.scenarios);
            const defaultId = scenarioRes.value.default_selected || "balanced";
            const matchedScenario = scenarioRes.value.scenarios.find(
              (s) => s.id === defaultId,
            );
            if (matchedScenario) setSelectedScenario(matchedScenario);
          }
        }
      } catch (err) {
        // Fallback handled inside api.js
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectScenario = (scenario) => {
    setSelectedScenario(scenario);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const payload = {
        cluster_id: "small-town-value",
        scenario_id: selectedScenario?.id || "balanced",
        manager_id: user?.full_name || "Aarchi Jain",
        notes: `Submitted ${selectedScenario?.label || "Balanced"} scenario recommendation for Snacks category.`,
      };

      const result = await submitRecommendation(payload);
      setSubmissionResult(result);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.detail ||
          err.message ||
          "Failed to submit assortment recommendation. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
  };

  // Top Nav Tab handler sync
  const handleTopNavChange = (navId) => {
    setActiveTopNav(navId);
    if (navId === "performance") {
      setActiveTab("sku");
    } else if (navId === "history") {
      setActiveTab("audit");
    } else if (navId === "scenarios") {
      setActiveTab("dashboard");
    }
  };

  const renderActivePanel = () => {
    switch (activeTab) {
      case "dashboard":
      case "overview":
        return (
          <Dashboard
            kpiData={kpiData}
            skusData={skusData}
            scenariosData={scenariosData}
            selectedScenario={selectedScenario}
            onSelectScenario={handleSelectScenario}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            submissionResult={submissionResult}
            errorMessage={errorMessage}
            onClearError={() => setErrorMessage(null)}
            onClearResult={() => setSubmissionResult(null)}
          />
        );
      case "sku":
        return <SKUViewPanel skusData={skusData} />;
      case "cluster":
        return <ClusterSelectPanel />;
      case "optimization":
        return (
          <OptimizationPanel
            scenariosData={scenariosData}
            selectedScenario={selectedScenario}
            onSelectScenario={handleSelectScenario}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        );
      case "audit":
        return <AuditTrailPanel />;
      case "inventory":
        return (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-3">
            <h2 className="text-xl font-bold text-slate-100">
              Inventory & Distribution Management
            </h2>
            <p className="text-xs text-slate-400">
              Distribution center stock levels, linear shelf capacity planning,
              and automated reorder triggers for Small Town Value Cluster.
            </p>
          </div>
        );
      case "team":
        return (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-3">
            <h2 className="text-xl font-bold text-slate-100">
              Category Team Members & Permissions
            </h2>
            <p className="text-xs text-slate-400">
              Dollar General Enterprise Assortment Advisor team roles, approval
              delegates, and audit log access policies.
            </p>
          </div>
        );
      default:
        return (
          <Dashboard
            kpiData={kpiData}
            skusData={skusData}
            scenariosData={scenariosData}
            selectedScenario={selectedScenario}
            onSelectScenario={handleSelectScenario}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            submissionResult={submissionResult}
            errorMessage={errorMessage}
            onClearError={() => setErrorMessage(null)}
            onClearResult={() => setSubmissionResult(null)}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 antialiased font-sans">
      <Sidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          clusterName="Small Town Value Cluster (#CL-8802)"
          activeTopNav={activeTopNav}
          setActiveTopNav={handleTopNavChange}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          user={user}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          {renderActivePanel()}
        </main>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
}
