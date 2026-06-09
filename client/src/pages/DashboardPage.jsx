import React, { useState, useEffect } from 'react';
import KPIHeaderStrip from '../components/assortment/KPIHeaderStrip.jsx';
import SKUPerformanceTable from '../components/assortment/SKUPerformanceTable.jsx';
import ScenarioSelector from '../components/assortment/ScenarioSelector.jsx';
import ApprovalReviewPanel from '../components/assortment/ApprovalReviewPanel.jsx';
import SuccessConfirmationModal from '../components/assortment/SuccessConfirmationModal.jsx';
import { getDashboardData, getScenarioData, submitAssortment } from '../services/api.js';

export default function DashboardPage() {
  const [kpis, setKpis] = useState(null);
  const [skus, setSkus] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState('Balanced');
  const [scenarioData, setScenarioData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [auditTrail, setAuditTrail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const dashData = await getDashboardData();
        if (dashData) {
          setKpis(dashData.kpis);
          setSkus(dashData.skus);
        }
        
        // Fetch default scenario (Balanced)
        const scenData = await getScenarioData('Balanced');
        setScenarioData(scenData);
        
        setError(null);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
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
      const scenData = await getScenarioData(scenarioName);
      setScenarioData(scenData);
      
      // Update KPIs with projected metrics if available
      if (scenData?.projected_metrics && kpis) {
        setKpis(prev => ({
          ...prev,
          sales_per_linear_ft: {
            ...prev.sales_per_linear_ft,
            value: scenData.projected_metrics.sales_per_linear_ft.value,
            change: scenData.projected_metrics.sales_per_linear_ft.change
          },
          private_brand_pct: {
            ...prev.private_brand_pct,
            value: scenData.projected_metrics.private_brand_pct.value,
            change: scenData.projected_metrics.private_brand_pct.change
          },
          in_stock_rate: {
            ...prev.in_stock_rate,
            value: scenData.projected_metrics.in_stock_rate.value,
            change: scenData.projected_metrics.in_stock_rate.change
          },
          shelf_capacity: {
            ...prev.shelf_capacity,
            value: scenData.projected_metrics.shelf_capacity.value,
            change: scenData.projected_metrics.shelf_capacity.change
          }
        }));
      }
    } catch (err) {
      console.error(`Failed to load scenario data for ${scenarioName}:`, err);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        scenario_name: selectedScenario,
        actions: (scenarioData?.actions || []).map(act => ({
          sku_id: act.sku_id || 'sku-unknown',
          action_type: act.action_type
        }))
      };
      const result = await submitAssortment(payload);
      if (result && result.status === 'SUCCESS') {
        setAuditTrail(result.audit_trail);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error('Failed to submit assortment plan:', err);
      alert('Failed to submit assortment plan. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='flex-1 flex items-center justify-center text-on-surface-variant'>
        <div className='flex flex-col items-center gap-2'>
          <span className='material-symbols-outlined animate-spin text-4xl text-primary'>sync</span>
          <span>Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex-1 flex items-center justify-center text-red-400 p-6'>
        <div className='flex flex-col items-center gap-4 max-w-md text-center'>
          <span className='material-symbols-outlined text-5xl'>error</span>
          <p className='text-lg font-bold'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='bg-[#6366F1] hover:bg-[#4f46e5] text-white font-bold py-2 px-4 rounded transition-colors text-sm'
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className='flex-1 p-6 overflow-x-hidden flex flex-col gap-6 max-w-[1600px] mx-auto w-full'>
      <KPIHeaderStrip kpis={kpis} />
      
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)] min-h-[600px]'>
        <SKUPerformanceTable skus={skus} />
        
        <div className='lg:col-span-4 flex flex-col gap-4 h-full'>
          <ScenarioSelector
            selectedScenario={selectedScenario}
            onSelectScenario={handleSelectScenario}
          />
          <ApprovalReviewPanel
            scenarioName={selectedScenario}
            scenarioData={scenarioData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      <SuccessConfirmationModal
        isOpen={isModalOpen}
        auditTrail={auditTrail}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}