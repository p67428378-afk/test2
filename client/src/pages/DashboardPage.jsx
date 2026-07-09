import React, { useState, useEffect } from "react";
import AppLayout from "../components/layout/AppLayout.jsx";
import KPIHeaderStrip from "../components/advisor/KPIHeaderStrip.jsx";
import SKUPerformanceSection from "../components/advisor/SKUPerformanceSection.jsx";
import ScenarioSelector from "../components/advisor/ScenarioSelector.jsx";
import ApprovalReviewPanel from "../components/advisor/ApprovalReviewPanel.jsx";
import SuccessBanner from "../components/common/SuccessBanner.jsx";
import {
  getKPIs,
  getSKUPerformance,
  getScenarioProjections,
  submitAssortmentDecision,
} from "../services/api.js";

export default function DashboardPage() {
  const [kpis, setKPIs] = useState(null);
  const [skuData, setSkuData] = useState({
    items: [],
    total: 0,
    page: 1,
    limit: 10,
  });
  const [selectedScenario, setSelectedScenario] = useState("Balanced");
  const [projections, setProjections] = useState({});
  const [loadingKPIs, setLoadingKPIs] = useState(true);
  const [loadingSKUs, setLoadingSKUs] = useState(true);
  const [loadingProjections, setLoadingProjections] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchKPIsData = async () => {
    try {
      setLoadingKPIs(true);
      const data = await getKPIs();
      setKPIs(data);
    } catch (err) {
      console.error("Error fetching KPIs:", err);
    } finally {
      setLoadingKPIs(false);
    }
  };

  const fetchSKUData = async (page = 1) => {
    try {
      setLoadingSKUs(true);
      const skip = (page - 1) * skuData.limit;
      const data = await getSKUPerformance(skip, skuData.limit);
      setSkuData({
        items: data.items || [],
        total: data.total || 0,
        page: data.page || 1,
        limit: data.limit || 10,
      });
    } catch (err) {
      console.error("Error fetching SKU performance:", err);
    } finally {
      setLoadingSKUs(false);
    }
  };

  const fetchProjections = async () => {
    try {
      setLoadingProjections(true);
      const scenarios = ["Conservative", "Balanced", "Aggressive"];
      const results = {};
      for (const sc of scenarios) {
        const data = await getScenarioProjections(sc);
        results[sc] = data;
      }
      setProjections(results);
    } catch (err) {
      console.error("Error fetching scenario projections:", err);
    } finally {
      setLoadingProjections(false);
    }
  };

  useEffect(() => {
    fetchKPIsData();
    fetchSKUData();
    fetchProjections();
  }, []);

  const handlePageChange = (newPage) => {
    fetchSKUData(newPage);
  };

  const handleSubmitPlan = async () => {
    try {
      setSubmitting(true);
      setSuccessMessage("");
      const result = await submitAssortmentDecision(selectedScenario);
      if (result.success) {
        setSuccessMessage(
          `${result.summary} (Audit ID: ${result.audit_id}, Submitted at: ${new Date(result.submitted_at).toLocaleString()})`,
        );
        // Refresh KPIs and SKU data to reflect any changes
        fetchKPIsData();
        fetchSKUData(skuData.page);
      }
    } catch (err) {
      console.error("Error submitting assortment decision:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Success Banner */}
        <SuccessBanner
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />

        {/* KPI Header Strip */}
        <KPIHeaderStrip kpis={kpis} loading={loadingKPIs} />

        {/* SKU Performance Section */}
        <SKUPerformanceSection
          items={skuData.items}
          loading={loadingSKUs}
          onRefresh={() => fetchSKUData(skuData.page)}
          total={skuData.total}
          page={skuData.page}
          limit={skuData.limit}
          onPageChange={handlePageChange}
        />

        {/* Scenario Selector */}
        <ScenarioSelector
          selectedScenario={selectedScenario}
          onSelect={setSelectedScenario}
          projections={projections}
          loading={loadingProjections}
        />

        {/* Approval Review Panel */}
        <ApprovalReviewPanel
          selectedScenario={selectedScenario}
          projection={projections[selectedScenario]}
          onSubmit={handleSubmitPlan}
          submitting={submitting}
        />
      </div>
    </AppLayout>
  );
}
