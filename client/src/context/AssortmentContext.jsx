import React, { createContext, useContext, useState, useEffect } from "react";
import { assortmentService } from "../services/api.js";

const AssortmentContext = createContext();

export const AssortmentProvider = ({ children }) => {
  const [kpis, setKpis] = useState(null);
  const [skusData, setSkusData] = useState({ total_skus: 0, skus: [] });
  const [scenariosData, setScenariosData] = useState({
    scenarios: [],
    default_scenario: "Balanced",
  });
  const [guardrailsList, setGuardrailsList] = useState([]);
  const [navigationTabs, setNavigationTabs] = useState({
    sidebar_tabs: [],
    topnav_tabs: [],
  });

  // Navigation Tab State
  const [activeTopTab, setActiveTopTab] = useState("assortment_advisor");
  const [activeSidebarTab, setActiveSidebarTab] = useState("sku_performance");

  const [selectedScenarioName, setSelectedScenarioName] = useState("Balanced");

  const [selectedSubCategory, setSelectedSubCategory] =
    useState("All Sub-Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusBadge, setSelectedStatusBadge] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);

  // Fetch initial data
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        const [navRes, kpiRes, skuRes, scenRes, guardRes] = await Promise.all([
          assortmentService.getNavigationTabs(),
          assortmentService.getKPIs(),
          assortmentService.getSKUs(),
          assortmentService.getScenarios(),
          assortmentService.getGuardrails(),
        ]);
        if (isMounted) {
          if (navRes) setNavigationTabs(navRes);
          if (kpiRes) setKpis(kpiRes);
          if (skuRes) setSkusData(skuRes);
          if (scenRes) {
            setScenariosData(scenRes);
            if (scenRes.default_scenario) {
              setSelectedScenarioName(scenRes.default_scenario);
            }
          }
          if (guardRes) setGuardrailsList(guardRes);
        }
      } catch (err) {
        console.error("Failed to load assortment context data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter SKUs when search or category selection changes
  const skusList = Array.isArray(skusData) ? skusData : skusData.skus || [];
  const filteredSkus = skusList.filter((sku) => {
    const matchesCategory =
      selectedSubCategory === "All Sub-Categories" ||
      selectedSubCategory === "All Sub-categories" ||
      !selectedSubCategory ||
      sku.sub_category === selectedSubCategory;

    const matchesBadge =
      !selectedStatusBadge || sku.status_badge === selectedStatusBadge;

    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      sku.product_name?.toLowerCase().includes(query) ||
      sku.sku_code?.toLowerCase().includes(query) ||
      sku.brand?.toLowerCase().includes(query) ||
      sku.sku_id?.toLowerCase().includes(query);

    return matchesCategory && matchesBadge && matchesQuery;
  });

  const activeScenario = (scenariosData.scenarios || []).find(
    (s) => (s.name || s.scenario_name) === selectedScenarioName,
  ) ||
    scenariosData.scenarios?.[0] || {
      name: selectedScenarioName,
      scenario_name: selectedScenarioName,
      projected_sales_lift_pct: 3.5,
      projected_private_brand_pct: 28.5,
      shelf_capacity_impact_pct: 94.0,
      action_summary: { GROW: 4, MAINTAIN: 85, SWAP: 3, REDUCE: 2 },
      guardrails: [
        { name: "Margin floor maintained", passed: true },
        { name: "Shelf capacity neutral", passed: true },
        { name: "Core brand minimums met", passed: true },
      ],
    };

  const handleSelectScenario = (scenarioName) => {
    setSelectedScenarioName(scenarioName);
  };

  const handleSubmitScenario = async () => {
    setSubmitting(true);
    setSubmissionError(null);
    try {
      const payload = {
        cluster_id: kpis?.cluster_id || "STV-CLUSTER-01",
        category: kpis?.category || "Snacks",
        scenario_name: selectedScenarioName,
        selected_scenario: selectedScenarioName,
        user_id: "USR-CM-882",
        guardrails_override: false,
      };
      const result = await assortmentService.submitScenario(payload);
      setSubmissionResult(result);
    } catch (err) {
      console.error("Scenario submission error:", err);
      setSubmissionError(
        err.response?.data?.detail ||
          "Failed to submit scenario recommendation.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDismissConfirmation = () => {
    setSubmissionResult(null);
  };

  return (
    <AssortmentContext.Provider
      value={{
        kpis,
        skusData,
        filteredSkus,
        scenariosData,
        guardrailsList,
        navigationTabs,
        activeTopTab,
        setActiveTopTab,
        activeSidebarTab,
        setActiveSidebarTab,
        selectedScenarioName,
        activeScenario,
        selectedSubCategory,
        setSelectedSubCategory,
        searchQuery,
        setSearchQuery,
        selectedStatusBadge,
        setSelectedStatusBadge,
        handleSelectScenario,
        handleSubmitScenario,
        handleDismissConfirmation,
        loading,
        submitting,
        submissionResult,
        submissionError,
      }}
    >
      {children}
    </AssortmentContext.Provider>
  );
};

export const useAssortment = () => useContext(AssortmentContext);
export default AssortmentContext;
