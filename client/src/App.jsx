import React, { useState, useEffect } from 'react';
import AppLayout from './components/layout/AppLayout.jsx';
import KPIHeaderStrip from './components/assortment/KPIHeaderStrip.jsx';
import SKUPerformanceSection from './components/assortment/SKUPerformanceSection.jsx';
import ScenarioSelector from './components/assortment/ScenarioSelector.jsx';
import ApprovalReviewPanel from './components/assortment/ApprovalReviewPanel.jsx';
import SuccessBanner from './components/common/SuccessBanner.jsx';
import { getSnacksData, submitReview } from './services/api.js';

export const App = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState('balanced');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [auditData, setAuditData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getSnacksData();
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Failed to load assortment advisor data. Please ensure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmitPlan = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setAuditData(null);

      const scenarioData = data?.scenarios?.[selectedScenario];
      const actions = scenarioData?.sku_actions || [];

      // If actions are empty, generate some mock actions based on the scenario
      const finalActions = actions.length > 0 ? actions : [
        { sku_id: 'sku-1', action: 'GROW' },
        { sku_id: 'sku-2', action: 'MAINTAIN' },
      ];

      const result = await submitReview(selectedScenario, finalActions);
      setAuditData(result);
    } catch (err) {
      console.error('Failed to submit assortment plan:', err);
      setSubmitError('Failed to submit assortment plan. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-body-lg font-semibold text-on-surface'>Loading Assortment Advisor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center p-4'>
        <div className='bg-white border border-error rounded-xl p-6 max-w-md w-full shadow-md text-center'>
          <span className='material-symbols-outlined text-error text-[48px] mb-4'>error</span>
          <h2 className='text-headline-sm font-bold text-on-surface mb-2'>Connection Error</h2>
          <p className='text-body-md text-secondary mb-6'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='px-6 py-2.5 bg-primary-container text-on-primary-container font-semibold rounded-lg hover:brightness-95 transition-all'
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const currentScenarioData = data?.scenarios?.[selectedScenario];

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
          <div className='flex gap-stack-sm'>
            <button className='px-4 py-2 border border-outline-variant rounded-lg text-label-md flex items-center gap-2 hover:bg-surface-container-low transition-colors'>
              <span className='material-symbols-outlined text-[20px]'>filter_list</span> Filter Cluster
            </button>
            <button 
              onClick={() => window.location.reload()}
              className='px-4 py-2 bg-primary-container text-on-primary-container font-label-md rounded-lg hover:brightness-95 transition-all flex items-center gap-2'
            >
              <span className='material-symbols-outlined text-[20px]'>refresh</span> Re-calculate
            </button>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {auditData && (
        <SuccessBanner
          auditData={auditData}
          scenarioName={selectedScenario}
          onClose={() => setAuditData(null)}
        />
      )}

      {/* Submit Error Banner */}
      {submitError && (
        <div className='bg-red-50 border-2 border-error rounded-xl p-4 mb-6 flex items-center justify-between'>
          <div className='flex items-center gap-3 text-error'>
            <span className='material-symbols-outlined'>error</span>
            <span className='text-body-md font-semibold'>{submitError}</span>
          </div>
          <button onClick={() => setSubmitError(null)} className='text-secondary hover:bg-red-100 p-1 rounded-full'>
            <span className='material-symbols-outlined'>close</span>
          </button>
        </div>
      )}

      {/* KPI Header Strip */}
      <KPIHeaderStrip kpis={data?.kpis} />

      {/* Split Pane */}
      <div className='grid grid-cols-12 gap-stack-lg mb-stack-lg'>
        {/* Left: SKU Performance */}
        <div className='col-span-12 lg:col-span-8 flex flex-col gap-stack-md'>
          <SKUPerformanceSection skus={data?.sku_performance} />
        </div>

        {/* Right: Assortment Strategy */}
        <div className='col-span-12 lg:col-span-4 flex flex-col gap-stack-lg'>
          <div className='bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm'>
            <ScenarioSelector
              scenarios={data?.scenarios}
              selectedScenario={selectedScenario}
              onSelectScenario={setSelectedScenario}
            />
            <ApprovalReviewPanel
              scenarioKey={selectedScenario}
              scenarioData={currentScenarioData}
              onSubmit={handleSubmitPlan}
              isSubmitting={isSubmitting}
            />
          </div>

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
};

export default App;