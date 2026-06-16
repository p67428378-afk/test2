import React, { useState, useEffect } from 'react';
import TopNavBar from '../components/layout/TopNavBar';
import KPIHeaderStrip from '../components/assortment/KPIHeaderStrip';
import SKUPerformanceSection from '../components/assortment/SKUPerformanceSection';
import ScenarioSelector from '../components/assortment/ScenarioSelector';
import ApprovalReviewPanel from '../components/assortment/ApprovalReviewPanel';
import Modal from '../components/common/Modal';
import { getKPIs, getScenario, submitAssortmentDecision } from '../services/api';

export default function DashboardPage() {
  const [kpis, setKPIs] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState('balanced');
  const [scenarioData, setScenarioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const kpiData = await getKPIs();
        setKPIs(kpiData);
        
        const scenarioDetails = await getScenario('balanced');
        setScenarioData(scenarioDetails);
        setError(null);
      } catch (err) {
        console.error('Error fetching initial dashboard data:', err);
        setError('Failed to load dashboard data. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSelectScenario = async (scenarioName) => {
    try {
      setSelectedScenario(scenarioName);
      const scenarioDetails = await getScenario(scenarioName);
      setScenarioData(scenarioDetails);
    } catch (err) {
      console.error(`Error fetching scenario ${scenarioName}:`, err);
      setError(`Failed to load scenario: ${scenarioName}`);
    }
  };

  const handleSubmitPlan = async () => {
    if (!scenarioData) return;
    try {
      setIsSubmitting(true);
      const actions = scenarioData.sku_actions.map((item) => ({
        sku_name: item.sku_name,
        action: item.action,
      }));
      const result = await submitAssortmentDecision(selectedScenario, actions);
      setSubmitResult(result);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error submitting assortment plan:', err);
      setError('Failed to submit assortment plan. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col min-h-screen bg-surface text-on-surface'>
      <TopNavBar />
      
      <div className='flex flex-1 overflow-hidden'>
        {/* SideNavBar */}
        <nav className='hidden lg:flex flex-col h-[calc(100vh-64px)] sticky left-0 top-16 w-64 bg-surface-container-low dark:bg-surface-container-lowest border-r border-outline-variant dark:border-outline p-unit gap-2 shrink-0'>
          <div className='p-4 mb-2'>
            <h2 className='font-headline-md text-headline-md text-primary font-bold'>Control Center</h2>
            <p className='font-label-bold text-label-bold text-secondary mt-1'>Region 402</p>
            <button className='mt-4 w-full bg-on-surface text-surface py-2 rounded-DEFAULT font-label-bold text-label-bold transition-transform scale-95 active:scale-90 flex items-center justify-center gap-2'>
              <span className='material-symbols-outlined text-[16px]'>add</span>
              New Analysis
            </button>
          </div>
          <div className='flex flex-col gap-1 flex-1 px-2 overflow-y-auto'>
            <a className='bg-primary-container text-on-primary-container rounded-lg font-bold p-3 flex items-center gap-3 scale-95 active:scale-90 transition-transform' href='#'>
              <span className='material-symbols-outlined'>dashboard</span>
              <span className='font-label-bold text-label-bold'>Dashboard</span>
            </a>
            <a className='text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high rounded-lg p-3 flex items-center gap-3 scale-95 active:scale-90 transition-transform' href='#'>
              <span className='material-symbols-outlined'>inventory_2</span>
              <span className='font-label-bold text-label-bold'>SKU Analytics</span>
            </a>
            <a className='text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high rounded-lg p-3 flex items-center gap-3 scale-95 active:scale-90 transition-transform' href='#'>
              <span className='material-symbols-outlined'>insights</span>
              <span className='font-label-bold text-label-bold'>Scenario Planning</span>
            </a>
            <a className='text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high rounded-lg p-3 flex items-center gap-3 scale-95 active:scale-90 transition-transform' href='#'>
              <span className='material-symbols-outlined'>fact_check</span>
              <span className='font-label-bold text-label-bold'>Approvals</span>
            </a>
            <a className='text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high rounded-lg p-3 flex items-center gap-3 scale-95 active:scale-90 transition-transform' href='#'>
              <span className='material-symbols-outlined'>description</span>
              <span className='font-label-bold text-label-bold'>Reporting</span>
            </a>
          </div>
          <div className='mt-auto border-t border-outline-variant p-2 flex flex-col gap-1'>
            <a className='text-on-surface-variant hover:bg-surface-container-high rounded-lg p-3 flex items-center gap-3 scale-95 active:scale-90 transition-transform' href='#'>
              <span className='material-symbols-outlined'>contact_support</span>
              <span className='font-label-bold text-label-bold'>Support</span>
            </a>
            <a className='text-on-surface-variant hover:bg-surface-container-high rounded-lg p-3 flex items-center gap-3 scale-95 active:scale-90 transition-transform' href='#'>
              <span className='material-symbols-outlined'>help</span>
              <span className='font-label-bold text-label-bold'>Help</span>
            </a>
          </div>
        </nav>

        {/* Main Content Canvas */}
        <main className='flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop bg-surface flex flex-col gap-gutter'>
          <div className='mb-2'>
            <h2 className='font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold'>
              Small Town Value Cluster
            </h2>
            <p className='font-body-lg text-body-lg text-secondary mt-1'>
              Reviewing Category: Snacks &amp; Beverages
            </p>
          </div>

          {error && (
            <div className='bg-error-container text-on-error-container p-4 rounded-lg border border-error flex items-center gap-3'>
              <span className='material-symbols-outlined'>error</span>
              <span className='font-body-md text-body-md'>{error}</span>
            </div>
          )}

          {loading ? (
            <div className='flex-1 flex items-center justify-center p-12'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            </div>
          ) : (
            <>
              {/* KPI Row */}
              <KPIHeaderStrip kpis={kpis} />

              {/* Main Grid Area */}
              <div className='grid grid-cols-1 xl:grid-cols-12 gap-gutter'>
                {/* Left Column: SKU Performance Table (8 col) */}
                <div className='xl:col-span-8'>
                  <SKUPerformanceSection skuActions={scenarioData?.sku_actions} />
                </div>

                {/* Right Column: Scenarios & Review (4 col) */}
                <div className='xl:col-span-4 flex flex-col gap-gutter'>
                  <ScenarioSelector
                    selectedScenario={selectedScenario}
                    onSelectScenario={handleSelectScenario}
                  />
                  
                  <ApprovalReviewPanel
                    scenario={selectedScenario}
                    skuActions={scenarioData?.sku_actions}
                    guardrailStatus={scenarioData?.guardrail_status}
                    onSubmit={handleSubmitPlan}
                    isSubmitting={isSubmitting}
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Success Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title='Submission Successful'
      >
        <div className='flex flex-col items-center text-center gap-4'>
          <span className='material-symbols-outlined text-[64px] text-[#146c2e]'>check_circle</span>
          <p className='font-body-lg text-body-lg text-on-surface font-semibold'>
            {submitResult?.message || 'Assortment plan submitted successfully.'}
          </p>
          <div className='bg-surface-container-low border border-outline-variant rounded p-3 w-full text-left'>
            <span className='font-label-bold text-label-bold text-secondary uppercase block mb-1'>
              Audit Trail ID
            </span>
            <code className='font-body-sm-tabular text-body-sm-tabular text-on-surface break-all font-mono bg-surface-container-high px-2 py-1 rounded block'>
              {submitResult?.audit_trail_id}
            </code>
          </div>
        </div>
      </Modal>
    </div>
  );
}
