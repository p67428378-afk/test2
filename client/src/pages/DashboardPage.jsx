import React, { useState, useEffect } from 'react';
import KPIHeaderStrip from '../components/assortment/KPIHeaderStrip';
import SKUPerformanceTable from '../components/assortment/SKUPerformanceTable';
import ScenarioSelector from '../components/assortment/ScenarioSelector';
import ApprovalReviewPanel from '../components/assortment/ApprovalReviewPanel';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import api from '../services/api';

export default function DashboardPage() {
  const [kpis, setKPIs] = useState(null);
  const [skus, setSKUs] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState('balanced');
  const [scenarioDetails, setScenarioDetails] = useState(null);
  const [loadingKPIs, setLoadingKPIs] = useState(true);
  const [loadingSKUs, setLoadingSKUs] = useState(true);
  const [loadingScenario, setLoadingScenario] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingKPIs(true);
        setLoadingSKUs(true);
        const [kpiData, skuData] = await Promise.all([
          api.getKPIs(),
          api.getSKUs(),
        ]);
        setKPIs(kpiData);
        setSKUs(skuData);
      } catch (err) {
        console.error('Error fetching initial dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoadingKPIs(false);
        setLoadingSKUs(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchScenario = async () => {
      try {
        setLoadingScenario(true);
        const details = await api.getScenarioDetails(selectedScenario);
        setScenarioDetails(details);
      } catch (err) {
        console.error(`Error fetching scenario details for ${selectedScenario}:`, err);
        setError(`Failed to load scenario details for ${selectedScenario}.`);
      } finally {
        setLoadingScenario(false);
      }
    };

    fetchScenario();
  }, [selectedScenario]);

  const handleSubmit = async () => {
    if (!scenarioDetails) return;
    try {
      setSubmitting(true);
      setError(null);
      const payload = {
        scenario_name: selectedScenario,
        projected_sales: scenarioDetails.projected_sales,
        projected_private_brand_pct: scenarioDetails.projected_private_brand_pct,
        sku_action_list: scenarioDetails.sku_action_list || [],
        submitted_by: 'John Doe',
      };
      const result = await api.submitAssortmentPlan(payload);
      setSubmitResult(result);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error submitting assortment plan:', err);
      setError('Failed to submit assortment plan. Please check guardrails and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col gap-6'>
      {error && (
        <div className='bg-rose-900/50 border border-rose-500 text-rose-200 px-4 py-3 rounded-lg flex justify-between items-center'>
          <span>{error}</span>
          <button className='text-rose-200 hover:text-white' onClick={() => setError(null)}>
            <span className='material-symbols-outlined' style={{ fontSize: '20px' }}>close</span>
          </button>
        </div>
      )}

      <KPIHeaderStrip kpis={kpis} loading={loadingKPIs} />

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
        <div className='lg:col-span-8 flex flex-col gap-6'>
          <SKUPerformanceTable skus={skus} loading={loadingSKUs} />
        </div>
        <div className='lg:col-span-4 flex flex-col gap-6'>
          <ScenarioSelector
            selectedScenario={selectedScenario}
            onSelectScenario={setSelectedScenario}
          />
          <ApprovalReviewPanel
            scenarioName={selectedScenario}
            scenarioDetails={scenarioDetails}
            loading={loadingScenario}
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className='w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4'>
          <span className='material-symbols-outlined text-emerald-400' style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>
        <h2 className='text-xl font-bold text-white mb-2'>Success!</h2>
        <p className='text-sm text-[#d8c3ad] mb-6'>Assortment Plan Submitted Successfully!</p>
        
        <div className='bg-[#0F172A] w-full border border-[#334155] rounded-lg p-4 mb-6 text-left space-y-2'>
          <div className='flex justify-between items-center border-b border-[#334155]/50 pb-2'>
            <span className='text-xs font-semibold text-[#d8c3ad] uppercase'>Audit ID</span>
            <span className='font-mono text-sm text-[#F59E0B] truncate max-w-[200px]'>
              {submitResult?.audit_trail_id || 'N/A'}
            </span>
          </div>
          <div className='flex justify-between items-start border-b border-[#334155]/50 py-2'>
            <span className='text-xs font-semibold text-[#d8c3ad] uppercase'>Summary</span>
            <span className='text-sm text-white text-right whitespace-pre-line'>
              {submitResult?.summary || 'N/A'}
            </span>
          </div>
          <div className='flex justify-between items-center border-b border-[#334155]/50 py-2'>
            <span className='text-xs font-semibold text-[#d8c3ad] uppercase'>Submitter</span>
            <span className='text-sm text-white'>{submitResult?.submitted_by || 'John Doe'}</span>
          </div>
          <div className='flex justify-between items-center pt-2'>
            <span className='text-xs font-semibold text-[#d8c3ad] uppercase'>Timestamp</span>
            <span className='font-mono text-xs text-[#d8c3ad]'>
              {submitResult?.submitted_at ? new Date(submitResult.submitted_at).toLocaleString() : 'N/A'}
            </span>
          </div>
        </div>

        <Button className='w-full py-2' variant='secondary' onClick={() => setIsModalOpen(false)}>
          Close
        </Button>
      </Modal>
    </div>
  );
}
