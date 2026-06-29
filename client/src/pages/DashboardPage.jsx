import React, { useState, useEffect } from "react";
import AppLayout from "../components/layout/AppLayout";
import KpiHeaderStrip from "../components/dashboard/KpiHeaderStrip";
import SkuTable from "../components/dashboard/SkuTable";
import ScenarioSelector from "../components/dashboard/ScenarioSelector";
import ApprovalReviewPanel from "../components/dashboard/ApprovalReviewPanel";
import {
  getKpis,
  getSkus,
  getScenarioDetails,
  submitApproval,
} from "../services/api";
import { CheckCircle2, X } from "lucide-react";

export default function DashboardPage() {
  const [kpis, setKpis] = useState(null);
  const [skus, setSkus] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState("Balanced");
  const [scenarioDetails, setScenarioDetails] = useState(null);
  const [kpisLoading, setKpisLoading] = useState(true);
  const [skusLoading, setSkusLoading] = useState(true);
  const [scenarioLoading, setScenarioLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState(null);

  // Fetch KPIs and SKUs on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setKpisLoading(true);
        const kpiData = await getKpis();
        setKpis(kpiData);
      } catch (err) {
        console.error("Error fetching KPIs:", err);
        setError("Failed to load KPI data.");
      } finally {
        setKpisLoading(false);
      }

      try {
        setSkusLoading(true);
        const skuData = await getSkus();
        setSkus(skuData);
      } catch (err) {
        console.error("Error fetching SKUs:", err);
        setError("Failed to load SKU performance data.");
      } finally {
        setSkusLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch scenario details when selected scenario changes
  useEffect(() => {
    const fetchScenario = async () => {
      try {
        setScenarioLoading(true);
        const details = await getScenarioDetails(selectedScenario);
        setScenarioDetails(details);
      } catch (err) {
        console.error(`Error fetching scenario ${selectedScenario}:`, err);
        setError(`Failed to load details for ${selectedScenario} scenario.`);
      } finally {
        setScenarioLoading(false);
      }
    };

    fetchScenario();
  }, [selectedScenario]);

  const handleSubmitApproval = async () => {
    try {
      setSubmitting(true);
      setError(null);

      // Map current SKUs to the actions payload
      const actions = skus.map((item) => ({
        sku: item.sku,
        action: item.status || "GROW",
      }));

      const payload = {
        scenario_name: selectedScenario,
        actions: actions,
      };

      const result = await submitApproval(payload);
      if (result.success) {
        setConfirmation({
          message: result.message,
          auditTrailId: result.audit_trail_id,
        });
      } else {
        setError("Submission failed. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting approval:", err);
      setError(
        err.response?.data?.detail || "An error occurred during submission.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      {/* Error Banner */}
      {error && (
        <div className="w-full bg-rose-500/10 border-l-2 border-rose-500 p-md rounded flex justify-between items-center gap-sm">
          <p className="font-body-md text-body-md text-rose-100">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-rose-400 hover:text-rose-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Success Confirmation Banner */}
      {confirmation && (
        <div className="w-full bg-emerald-500/10 border-l-2 border-emerald-500 p-md rounded flex justify-between items-center gap-sm">
          <div className="flex items-center gap-sm">
            <CheckCircle2 className="text-emerald-400 h-5 w-5 shrink-0" />
            <p className="font-body-md text-body-md text-emerald-100">
              {confirmation.message}{" "}
              <span className="opacity-70 ml-2">
                Audit Trail ID: {confirmation.auditTrailId}
              </span>
            </p>
          </div>
          <button
            onClick={() => setConfirmation(null)}
            className="text-emerald-400 hover:text-emerald-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* KPI Row */}
      <KpiHeaderStrip kpis={kpis} loading={kpisLoading} />

      {/* Split Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-lg items-start">
        {/* SKU Table */}
        <SkuTable skus={skus} loading={skusLoading} />

        {/* Scenarios & Approval */}
        <div className="xl:col-span-4 flex flex-col gap-lg h-full">
          <ScenarioSelector
            selectedScenario={selectedScenario}
            onSelectScenario={setSelectedScenario}
          />
          <ApprovalReviewPanel
            scenarioName={selectedScenario}
            scenarioDetails={scenarioDetails}
            loading={scenarioLoading}
            onSubmit={handleSubmitApproval}
            submitting={submitting}
          />
        </div>
      </div>
    </AppLayout>
  );
}
