import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getKPIs,
  getSKUs,
  getScenarios,
  submitAssortment,
} from "../services/api";

const AssortmentContext = createContext();

export const AssortmentProvider = ({ children }) => {
  const [kpiData, setKpiData] = useState({
    sales_per_linear_ft: 142.5,
    private_brand_mix_pct: 28.5,
    in_stock_rate_pct: 96.2,
    shelf_capacity_utilization_pct: 94.0,
    cluster_id: "STV-CLUSTER-01",
    category: "Snacks",
    updated_at: new Date().toISOString(),
  });
  const [kpiLoading, setKpiLoading] = useState(false);
  const [kpiError, setKpiError] = useState(null);

  const [skuList, setSkuList] = useState([]);
  const [totalSkus, setTotalSkus] = useState(0);
  const [skuLoading, setSkuLoading] = useState(false);
  const [skuError, setSkuError] = useState(null);
  const [subCategoryFilter, setSubCategoryFilter] =
    useState("All Sub-Categories");
  const [searchFilter, setSearchFilter] = useState("");
  const [statusBadgeFilter, setStatusBadgeFilter] = useState("All Statuses");

  const [scenarios, setScenarios] = useState([
    {
      scenario_id: "SCEN-01",
      name: "Conservative",
      projected_sales_lift_pct: 2.1,
      projected_private_brand_pct: 27.2,
      shelf_capacity_impact_pct: 91.5,
      action_summary: { GROW: 2, MAINTAIN: 12, REDUCE: 2, SWAP: 1 },
    },
    {
      scenario_id: "SCEN-02",
      name: "Balanced",
      projected_sales_lift_pct: 5.2,
      projected_private_brand_pct: 28.5,
      shelf_capacity_impact_pct: 94.0,
      action_summary: { GROW: 4, MAINTAIN: 10, REDUCE: 1, SWAP: 2 },
    },
    {
      scenario_id: "SCEN-03",
      name: "Aggressive Growth",
      projected_sales_lift_pct: 8.4,
      projected_private_brand_pct: 25.1,
      shelf_capacity_impact_pct: 98.0,
      action_summary: { GROW: 8, MAINTAIN: 6, REDUCE: 0, SWAP: 3 },
    },
  ]);
  const [selectedScenarioName, setSelectedScenarioName] = useState("Balanced");
  const [scenariosLoading, setScenariosLoading] = useState(false);
  const [scenariosError, setScenariosError] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);

  const fetchKPIs = async () => {
    setKpiLoading(true);
    setKpiError(null);
    try {
      const data = await getKPIs();
      if (data) {
        setKpiData(data);
      }
    } catch (err) {
      console.warn(
        "Using fallback/initial KPI data due to API error:",
        err.message,
      );
      setKpiError(err.message);
    } finally {
      setKpiLoading(false);
    }
  };

  const fetchSKUs = async () => {
    setSkuLoading(true);
    setSkuError(null);
    try {
      const data = await getSKUs(
        subCategoryFilter !== "All Sub-Categories" ? subCategoryFilter : null,
        statusBadgeFilter !== "All Statuses" ? statusBadgeFilter : null,
      );
      if (data && data.skus) {
        setSkuList(data.skus);
        setTotalSkus(data.total_skus || data.skus.length);
      }
    } catch (err) {
      console.warn("API error fetching SKUs:", err.message);
      setSkuError(err.message);
    } finally {
      setSkuLoading(false);
    }
  };

  const fetchScenarios = async () => {
    setScenariosLoading(true);
    setScenariosError(null);
    try {
      const data = await getScenarios();
      if (data && data.scenarios && data.scenarios.length > 0) {
        setScenarios(data.scenarios);
        if (data.default_scenario) {
          setSelectedScenarioName(data.default_scenario);
        }
      }
    } catch (err) {
      console.warn("API error fetching scenarios:", err.message);
      setScenariosError(err.message);
    } finally {
      setScenariosLoading(false);
    }
  };

  useEffect(() => {
    fetchKPIs();
    fetchSKUs();
    fetchScenarios();
  }, []);

  useEffect(() => {
    fetchSKUs();
  }, [subCategoryFilter, statusBadgeFilter]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        cluster_id: kpiData.cluster_id || "STV-CLUSTER-01",
        category: "Snacks",
        scenario_name: selectedScenarioName,
        user_id: "USR-CM-882",
        guardrails_override: false,
      };
      const result = await submitAssortment(payload);
      setSubmissionResult(result);
    } catch (err) {
      console.error("Submission failed:", err.message);
      setSubmitError(err.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedScenario =
    scenarios.find((s) => s.name === selectedScenarioName) || scenarios[0];

  return (
    <AssortmentContext.Provider
      value={{
        kpiData,
        kpiLoading,
        kpiError,
        fetchKPIs,
        skuList,
        totalSkus,
        skuLoading,
        skuError,
        subCategoryFilter,
        setSubCategoryFilter,
        searchFilter,
        setSearchFilter,
        statusBadgeFilter,
        setStatusBadgeFilter,
        fetchSKUs,
        scenarios,
        selectedScenarioName,
        setSelectedScenarioName,
        selectedScenario,
        scenariosLoading,
        scenariosError,
        fetchScenarios,
        submitting,
        submitError,
        submissionResult,
        setSubmissionResult,
        handleSubmit,
      }}
    >
      {children}
    </AssortmentContext.Provider>
  );
};

export const useAssortment = () => useContext(AssortmentContext);
export default AssortmentContext;
