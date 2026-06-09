import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import KPIHeaderStrip from './components/assortment/KPIHeaderStrip.jsx';
import SKUPerformanceSection from './components/assortment/SKUPerformanceSection.jsx';
import ScenarioSelector from './components/assortment/ScenarioSelector.jsx';
import ApprovalReviewPanel from './components/assortment/ApprovalReviewPanel.jsx';
import SuccessBanner from './components/common/SuccessBanner.jsx';
import { getSnacksData, submitReview } from './services/api.js';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState('balanced');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [auditData, setAuditData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await getSnacksData();
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Failed to load assortment advisor data:', err);
        setError('Failed to load data from the server. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async () => {
    if (!data) return;
    
    const scenarioDetails = data.scenarios?.[selectedScenario];
    const payload = {
      scenario: selectedScenario,
      actions: scenarioDetails?.sku_actions ?? [],
    };

    try {
      setIsSubmitting(true);
      setError(null);
      const result = await submitReview(payload);
      setAuditData(result);
      // Scroll to top to show success banner
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to submit assortment plan:', err);
      setError('Failed to submit the assortment plan. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-background flex flex-col items-center justify-center p-4'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4'></div>
        <p className='text-body-lg font-medium text-secondary'>Loading Assortment Advisor...</p>
      </div>
    );
  }

  return (
    <div className='bg-background text-on-background min-h-screen'>
      <Header />
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
                onClick={async () => {
                  try {
                    setLoading(true);
                    const result = await getSnacksData();
                    setData(result);
                    setError(null);
                  } catch (err) {
                    setError('Failed to refresh data.');
                  } finally {
                    setLoading(false);
                  }
                }}
                className='px-4 py-2 bg-primary-container text-on-primary-container font-label-md rounded-lg hover:brightness-95 transition-all flex items-center gap-2'
              >
                <span className='material-symbols-outlined text-[20px]'>refresh</span> Re-calculate
              </button>
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className='bg-red-50 border-2 border-error rounded-xl p-4 mb-6 flex items-start gap-3 text-error'>
            <span className='material-symbols-outlined text-[24px]'>error</span>
            <div>
              <h4 className='font-bold text-body-lg'>Error</h4>
              <p className='text-body-md'>{error}</p>
            </div>
          </div>
        )}

        {/* Success Banner */}
        {auditData && (
          <SuccessBanner 
            auditData={auditData} 
            onClose={() => setAuditData(null)} 
          />
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
            <ScenarioSelector 
              scenarios={data?.scenarios} 
              selectedScenario={selectedScenario}
              onSelectScenario={setSelectedScenario}
            />

            <ApprovalReviewPanel 
              scenarioData={data?.scenarios?.[selectedScenario]}
              scenarioName={selectedScenario.charAt(0).toUpperCase() + selectedScenario.slice(1)}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />

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
    </div>
  );
}
