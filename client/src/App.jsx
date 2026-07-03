import React, { useState, useEffect } from "react";
import AppLayout from "./components/layout/AppLayout.jsx";
import SuccessBanner from "./components/common/SuccessBanner.jsx";
import KPIHeaderStrip from "./components/dashboard/KPIHeaderStrip.jsx";
import SKUPerformanceTable from "./components/dashboard/SKUPerformanceTable.jsx";
import ScenarioSelector from "./components/dashboard/ScenarioSelector.jsx";
import ApprovalReviewPanel from "./components/dashboard/ApprovalReviewPanel.jsx";
import {
  getKPIs,
  getSKUs,
  getScenarioProjections,
  submitDecision,
} from "./services/api.js";

export default function App() {
  const [kpis, setKpis] = useState(null);
  const [filteredSkus, setSkusFiltered] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState("Balanced");
  const [scenarioData, setScenarioData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [auditTrail, setAuditTrail] = useState(null);
  const [error, setError] = useState(null);

  // Table sorting and searching state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("sku_id");
  const [sortOrder, setSortOrder] = useState("asc");

  // Fetch initial KPIs and SKUs
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const kpiData = await getKPIs();
        setKpis(kpiData);
      } catch (err) {
        console.error("Error fetching KPIs:", err);
        // Fallback to default KPIs if API fails
        setKpis({
          sales_per_linear_ft: 15.75,
          private_brand_percentage: 22.0,
          in_stock_rate: 96.0,
          shelf_capacity_utilized: 85.0,
          sales_trend_percentage: 2.5,
        });
      }
    };
    fetchInitialData();
  }, []);

  // Fetch SKUs whenever search or sort changes
  useEffect(() => {
    const fetchSKUData = async () => {
      try {
        const skuData = await getSKUs({
          search: searchQuery || undefined,
          sort_by: sortBy || undefined,
          sort_order: sortOrder,
        });
        setSkusFiltered(skuData);
      } catch (err) {
        console.error("Error fetching SKUs:", err);
        // Fallback static data if API fails
        const fallback = [
          {
            sku_id: "12345",
            product_name: "DG Chips - Salt & Vinegar",
            current_sales: 5200,
            sales_growth: 8,
            is_private_brand: true,
            status: "GROW",
          },
          {
            sku_id: "67890",
            product_name: "Bubbly Cola 12oz",
            current_sales: 1100,
            sales_growth: -15,
            is_private_brand: false,
            status: "REDUCE",
          },
          {
            sku_id: "24680",
            product_name: "Clover Valley Pretzels",
            current_sales: 3400,
            sales_growth: 2,
            is_private_brand: true,
            status: "MAINTAIN",
          },
          {
            sku_id: "13579",
            product_name: "Premium Sweet Popcorn",
            current_sales: 2800,
            sales_growth: -1,
            is_private_brand: false,
            status: "SWAP",
          },
          {
            sku_id: "11223",
            product_name: "DG Brand Roasted Peanuts",
            current_sales: 4100,
            sales_growth: 12,
            is_private_brand: true,
            status: "GROW",
          },
        ];

        // Apply local search and sort
        let result = [...fallback];
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          result = result.filter(
            (s) =>
              s.sku_id.includes(q) || s.product_name.toLowerCase().includes(q),
          );
        }
        result.sort((a, b) => {
          let valA = a[sortBy];
          let valB = b[sortBy];
          if (typeof valA === "string") {
            return sortOrder === "asc"
              ? valA.localeCompare(valB)
              : valB.localeCompare(valA);
          }
          return sortOrder === "asc" ? valA - valB : valB - valA;
        });
        setSkusFiltered(result);
      }
    };
    fetchSKUData();
  }, [searchQuery, sortBy, sortOrder]);

  // Fetch scenario projections when selected scenario changes
  useEffect(() => {
    const fetchScenario = async () => {
      try {
        const data = await getScenarioProjections(selectedScenario);
        setScenarioData(data);
      } catch (err) {
        console.error("Error fetching scenario projections:", err);
        // Fallback static scenario data
        if (selectedScenario.toLowerCase() === "conservative") {
          setScenarioData({
            scenario_name: "Conservative",
            projected_sales_impact: 1.0,
            projected_pb_impact: 0.5,
            sku_actions: [
              {
                action: "KEEP",
                product_name: "DG Chips - Salt & Vinegar",
                sku_id: "12345",
              },
              {
                action: "KEEP",
                product_name: "Clover Valley Pretzels",
                sku_id: "24680",
              },
            ],
            guardrails: [
              {
                name: "Shelf capacity < 95%",
                passed: true,
                details: "85% utilized",
              },
              {
                name: "Private Brand % goal met",
                passed: false,
                details: "22.5% vs 25% target",
              },
            ],
          });
        } else if (selectedScenario.toLowerCase() === "balanced") {
          setScenarioData({
            scenario_name: "Balanced",
            projected_sales_impact: 3.0,
            projected_pb_impact: 1.5,
            sku_actions: [
              {
                action: "ADD",
                product_name: "DG Brand Roasted Peanuts",
                sku_id: "11223",
              },
              {
                action: "REMOVE",
                product_name: "Bubbly Cola 12oz",
                sku_id: "67890",
              },
              {
                action: "SWAP",
                product_name: "Premium Sweet Popcorn",
                sku_id: "13579",
              },
            ],
            guardrails: [
              {
                name: "Shelf capacity < 95%",
                passed: true,
                details: "85% utilized",
              },
              {
                name: "Private Brand % goal met",
                passed: false,
                details: "23.5% vs 25% target",
              },
            ],
          });
        } else {
          setScenarioData({
            scenario_name: "Aggressive",
            projected_sales_impact: 6.0,
            projected_pb_impact: 2.0,
            sku_actions: [
              {
                action: "ADD",
                product_name: "DG Brand Roasted Peanuts",
                sku_id: "11223",
              },
              {
                action: "REMOVE",
                product_name: "Bubbly Cola 12oz",
                sku_id: "67890",
              },
              {
                action: "SWAP",
                product_name: "Premium Sweet Popcorn",
                sku_id: "13579",
              },
              {
                action: "ADD",
                product_name: "Clover Valley Pretzels Extra",
                sku_id: "99999",
              },
            ],
            guardrails: [
              {
                name: "Shelf capacity < 95%",
                passed: true,
                details: "92% utilized",
              },
              {
                name: "Private Brand % goal met",
                passed: false,
                details: "24.0% vs 25% target",
              },
            ],
          });
        }
      }
    };
    fetchScenario();
  }, [selectedScenario]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleSubmit = async () => {
    if (!scenarioData) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await submitDecision(
        scenarioData.scenario_name,
        scenarioData.sku_actions,
      );
      setAuditTrail(result);
      // Scroll to top to show success banner
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Error submitting decision:", err);
      setError("Failed to submit assortment plan. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      {/* Success Banner */}
      {auditTrail && (
        <div className="mb-6">
          <SuccessBanner
            auditTrail={auditTrail}
            onClose={() => setAuditTrail(null)}
          />
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mb-6 bg-rose-900/20 border border-rose-700/50 rounded-lg p-4 flex items-center justify-between text-rose-400">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">error</span>
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-rose-400 hover:text-white"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}

      {/* Row 1: KPI Cards */}
      <div className="mb-6">
        <KPIHeaderStrip kpis={kpis} />
      </div>

      {/* Row 2: Tables and Actions */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Left Column: Table */}
        <SKUPerformanceTable
          skus={filteredSkus}
          onSearch={handleSearch}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />

        {/* Right Column: Scenarios & Review */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
          <ScenarioSelector
            selectedScenario={selectedScenario}
            onSelectScenario={setSelectedScenario}
          />
          <ApprovalReviewPanel
            scenarioData={scenarioData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </AppLayout>
  );
}
