import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import KPIHeaderStrip from '../components/assortment/KPIHeaderStrip';
import SKUPerformanceSection from '../components/assortment/SKUPerformanceSection';
import ScenarioSelector from '../components/assortment/ScenarioSelector';
import ApprovalReviewPanel from '../components/assortment/ApprovalReviewPanel';
import { getKPIs, getSKUs, getScenarios, submitAssortmentPlan } from '../services/api';

export default function DashboardPage() {
  const [scenario, setScenario] = useState('Balanced');
  const [kpis, setKPIs] = useState(null);
  const [skus, setSKUs] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [skuActions, setSkuActions] = useState({});

  // SKU table state
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 6;

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // Fetch KPIs and Scenarios when scenario changes
  useEffect(() => {
    async function fetchKPIsAndScenarios() {
      try {
        const kpiData = await getKPIs(scenario);
        setKPIs(kpiData);

        const scenarioData = await getScenarios(scenario);
        setScenarios(scenarioData);
      } catch (err) {
        console.error('Error fetching KPIs or Scenarios:', err);
      }
    }
    fetchKPIsAndScenarios();
  }, [scenario]);

  // Fetch SKUs when scenario, search, sort, or page changes
  useEffect(() => {
    async function fetchSKUs() {
      try {
        const skip = (page - 1) * limit;
        const skuData = await getSKUs({
          scenario,
          search,
          sort_by: sortBy,
          sort_order: sortOrder,
          skip,
          limit,
        });
        setSKUs(skuData.items);
        setTotal(skuData.total);

        // Initialize actions for newly loaded SKUs if not already set
        const initialActions = { ...skuActions };
        let updated = false;
        skuData.items.forEach((sku) => {
          if (!initialActions[sku.id]) {
            initialActions[sku.id] = sku.status;
            updated = true;
          }
        });
        if (updated) {
          setSkuActions(initialActions);
        }
      } catch (err) {
        console.error('Error fetching SKUs:', err);
      }
    }
    fetchSKUs();
  }, [scenario, search, sortBy, sortOrder, page]);

  const handleScenarioChange = (newScenario) => {
    setScenario(newScenario);
    setPage(1);
    setSubmitResult(null);
    setSubmitError(null);
  };

  const handleActionChange = (skuId, newAction) => {
    setSkuActions((prev) => ({
      ...prev,
      [skuId]: newAction,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitResult(null);
    setSubmitError(null);

    try {
      // Prepare payload
      const actionsPayload = Object.entries(skuActions).map(([skuId, action]) => ({
        sku_id: skuId,
        action,
      }));

      const result = await submitAssortmentPlan({
        scenario_name: scenario,
        sku_actions: actionsPayload,
      });

      setSubmitResult(result);
    } catch (err) {
      console.error('Error submitting assortment plan:', err);
      const errorMsg = err.response?.data?.detail || 'An unexpected error occurred during submission.';
      setSubmitError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col bg-slate-50'>
      <Header />
      <main className='max-w-container-max mx-auto px-margin-x py-stack-lg flex-grow w-full'>
        <KPIHeaderStrip kpis={kpis} />
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-gutter mt-stack-lg'>
          {/* Left Column: SKU Performance */}
          <div className='lg:col-span-8 space-y-stack-md'>
            <SKUPerformanceSection
              skus={skus}
              search={search}
              setSearch={setSearch}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              page={page}
              setPage={setPage}
              total={total}
              limit={limit}
              skuActions={skuActions}
              onActionChange={handleActionChange}
            />
          </div>

          {/* Right Column: Scenario Selector & Approval */}
          <div className='lg:col-span-4 space-y-stack-md flex flex-col'>
            <ScenarioSelector
              scenarios={scenarios}
              selectedScenario={scenario}
              onSelectScenario={handleScenarioChange}
            />
            <ApprovalReviewPanel
              selectedScenario={scenario}
              skuActions={skuActions}
              kpis={kpis}
              onSubmit={handleSubmit}
              submitResult={submitResult}
              isSubmitting={isSubmitting}
              submitError={submitError}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
