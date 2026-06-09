import React, { useState, useEffect } from 'react';
import AppLayout from './components/layout/AppLayout.jsx';
import KPIHeaderStrip from './components/assortment/KPIHeaderStrip.jsx';
import SKUPerformanceSection from './components/assortment/SKUPerformanceSection.jsx';
import ScenarioSelector from './components/assortment/ScenarioSelector.jsx';
import ApprovalReviewPanel from './components/assortment/ApprovalReviewPanel.jsx';
import SuccessBanner from './components/common/SuccessBanner.jsx';
import { getSnacksData, submitReview } from './services/api.js';

export default function App() {
  const [kpis, setKpis] = useState(null);
  const [skuPerformance, setSkuPerformance] = useState([]);
  const [scenarios, setScenarios] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState('balanced');
  const [auditData, setAuditData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const data = await getSnacksData();
        setKpis(data.kpis);
        setSkuPerformance(data.sku_performance || []);
        setScenarios(data.scenarios);
        setError(null);
      } catch (err) {
        console.error('Error fetching assortment advisor data:', err);
        setError('Failed to load assortment advisor data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!scenarios || !scenarios[selectedScenario]) return;
    try {
      setIsSubmitting(true);
      setError(null);
      const currentScenario = scenarios[selectedScenario];
      const result = await submitReview(selectedScenario, currentScenario.sku_actions || []);
      setAuditData(result);
      // Scroll to top to show success banner
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error submitting assortment plan:', err);
      setError('Failed to submit assortment plan. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-body-lg font-semibold text-secondary'>Loading Assortment Advisor...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      {/* Breadcrumbs & Title */}
      <div className='mb-stack-lg'>
        <nav className='flex text-label-sm text-secondary gap-2 mb-2'>
          <span>Category Management</span>
          <span>/</span>
          <span>Snacks</span>
          <span>/</span>
          <span className='text-on-surface'>Small Town Value Cluster</span>
        </nav>
        <div className='flex justify-between items-end'>
          <div>
            <h1 className='font-headline-lg text-headline-lg text-on-surface'>Snacks Assortment Advisor</h1>
            <p className='text-body-md text-secondary'>Optimizing for Small Town Value Cluster • Last updated: Today, 8:42 AM</p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className='bg-red-50 border-2 border-red-500 rounded-xl p-4 mb-stack-lg flex items-center gap-3 text-red-800'>
          <span className='material-symbols-outlined text-red-600'>error</span>
          <p className='text-body-md font-semibold'>{error}</p>
        </div>
      )}

      {/* Success Confirmation Banner */}
      {auditData && (
        <SuccessBanner auditData={auditData} onClose={() => setAuditData(null)} />
      )}

      {/* KPI Header Strip */}
      <KPIHeaderStrip kpis={kpis} />

      {/* Split Pane */}
      <div className='grid grid-cols-12 gap-stack-lg mb-stack-lg'>
        {/* Left: SKU Performance */}
        <div className='col-span-12 lg:col-span-8 flex flex-col gap-stack-md'>
          <SKUPerformanceSection skus={skuPerformance} />
        </div>

        {/* Right: Assortment Strategy */}
        <div className='col-span-12 lg:col-span-4 flex flex-col gap-stack-lg'>
          {scenarios && (
            <section className='bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm'>
              <ScenarioSelector
                scenarios={scenarios}
                selectedScenario={selectedScenario}
                onSelectScenario={setSelectedScenario}
              />
              <ApprovalReviewPanel
                scenarioData={scenarios[selectedScenario]}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </section>
          )}

          {/* Tactical Insight Card */}
          <div className='bg-inverse-surface text-inverse-on-surface p-stack-md rounded-xl shadow-lg relative overflow-hidden'>
            <div className='relative z-10'>
              <h4 className='font-headline-sm text-headline-sm mb-2'>Cluster Insight</h4>
              <p className='text-body-md opacity-80 mb-4'>
                "Clover Valley Potato Chips 8oz" is outperforming the National Brand average in the Small Town Value cluster by 14.2%. Increasing shelf space for Private Brands here is low-risk.
              </p>
              <button className='text-primary font-bold flex items-center gap-2 hover:underline'>
                View Full Analysis <span className='material-symbols-outlined'>arrow_forward</span>
              </button>
            </div>
            <span className='material-symbols-outlined absolute -bottom-4 -right-4 text-[120px] opacity-10'>lightbulb</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
