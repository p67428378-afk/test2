import React, { useState, useEffect } from 'react';
import KpiHeaderStrip from '../components/advisor/KpiHeaderStrip';
import SkuPerformanceTable from '../components/advisor/SkuPerformanceTable';
import ScenarioSelector from '../components/advisor/ScenarioSelector';
import ApprovalReviewPanel from '../components/advisor/ApprovalReviewPanel';
import SuccessModal from '../components/advisor/SuccessModal';
import { getKpis, getSkus, submitDecision } from '../services/api';

export default function DashboardPage() {
  const [scenario, setScenario] = useState('Balanced');
  const [kpis, setKpis] = useState(null);
  const [skus, setSkus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [kpiData, skuData] = await Promise.all([
          getKpis(scenario),
          getSkus(scenario),
        ]);
        setKpis(kpiData);
        setSkus(skuData);
      } catch (err) {
        setError('Failed to fetch assortment data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [scenario]);

  const handleScenarioChange = (newScenario) => {
    setScenario(newScenario);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        scenario_name: scenario,
        submitted_by: 'category_manager@dollargeneral.com',
        items: skus.map((sku) => ({
          sku_id: sku.id,
          action: sku.recommended_action,
        })),
      };
      const result = await submitDecision(payload);
      setSuccessData(result);
      setIsModalOpen(true);
    } catch (err) {
      setError('Failed to submit assortment plan. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='flex-1'>
      {error && (
        <div className='mb-6 p-4 bg-[#ba1a1a]/10 border border-[#ba1a1a]/30 text-[#ba1a1a] rounded-lg flex items-center gap-2 text-sm font-medium'>
          <span className='material-symbols-outlined'>error</span>
          {error}
        </div>
      )}

      {/* KPI Strip */}
      <KpiHeaderStrip kpis={kpis} loading={loading} />

      {/* Main Layout Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
        {/* Left: SKU Performance Table */}
        <div className='lg:col-span-8'>
          <SkuPerformanceTable skus={skus} loading={loading} />
        </div>

        {/* Right: Scenario Selector & Approval Review Panel */}
        <div className='lg:col-span-4 flex flex-col gap-6'>
          <ScenarioSelector
            selectedScenario={scenario}
            onSelectScenario={handleScenarioChange}
          />
          <ApprovalReviewPanel
            selectedScenario={scenario}
            skus={skus}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={successData}
      />
    </div>
  );
}
