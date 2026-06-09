import React, { useState, useEffect } from 'react';
import KPIHeaderStrip from '../components/assortment/KPIHeaderStrip';
import SKUPerformanceSection from '../components/assortment/SKUPerformanceSection';
import ScenarioSelector from '../components/assortment/ScenarioSelector';
import ApprovalReviewPanel from '../components/assortment/ApprovalReviewPanel';
import SuccessBanner from '../components/assortment/SuccessBanner';
import api from '../services/api';

export default function DashboardPage({ searchQuery }) {
  const [kpis, setKPIs] = useState(null);
  const [skus, setSKUs] = useState([]);
  const [totalSKUs, setTotalSKUs] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState(null);
  const [selectedScenarioDetails, setSelectedScenarioDetails] = useState(null);
  const [auditTrail, setAuditTrail] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [kpiData, skuData, scenarioList] = await Promise.all([
          api.getKPIs(),
          api.getSKUs(page, limit),
          api.getScenarios(),
        ]);
        setKPIs(kpiData);
        setSKUs(skuData.items || []);
        setTotalSKUs(skuData.total || 0);
        setScenarios(scenarioList);

        // Pre-select "Balanced" scenario if available
        const balanced = scenarioList.find(s => s.name.toLowerCase().includes('balanced'));
        if (balanced) {
          setSelectedScenarioId(balanced.id);
        } else if (scenarioList.length > 0) {
          setSelectedScenarioId(scenarioList[0].id);
        }
      } catch (err) {
        console.error('Error fetching initial dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      }
    };

    fetchInitialData();
  }, []);

  // Fetch SKUs when page changes
  useEffect(() => {
    const fetchSKUs = async () => {
      try {
        const skuData = await api.getSKUs(page, limit);
        setSKUs(skuData.items || []);
        setTotalSKUs(skuData.total || 0);
      } catch (err) {
        console.error('Error fetching SKUs:', err);
      }
    };

    if (kpis) { // Only fetch if initial load is done
      fetchSKUs();
    }
  }, [page]);

  // Fetch scenario details when selected scenario changes
  useEffect(() => {
    const fetchScenarioDetails = async () => {
      if (!selectedScenarioId) return;
      try {
        const details = await api.selectScenario(selectedScenarioId);
        setSelectedScenarioDetails(details);
      } catch (err) {
        console.error('Error selecting scenario:', err);
      }
    };

    fetchScenarioDetails();
  }, [selectedScenarioId]);

  const handleSubmit = async () => {
    if (!selectedScenarioId) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await api.submitApproval(selectedScenarioId);
      if (result.success) {
        setAuditTrail(result);
      } else {
        setError('Submission failed. Please check guardrails.');
      }
    } catch (err) {
      console.error('Error submitting assortment plan:', err);
      setError(err.response?.data?.detail || 'Failed to submit assortment plan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col gap-lg'>
      {error && (
        <div className='bg-red-50 border border-red-200 text-red-800 p-md rounded-lg text-sm font-medium'>
          {error}
        </div>
      )}

      <SuccessBanner auditTrail={auditTrail} onClose={() => setAuditTrail(null)} />

      <KPIHeaderStrip kpis={kpis} />

      <div className='grid grid-cols-12 gap-gutter'>
        <SKUPerformanceSection
          skus={skus}
          total={totalSKUs}
          page={page}
          limit={limit}
          onPageChange={setPage}
          searchQuery={searchQuery}
        />

        <div className='col-span-12 lg:col-span-4 flex flex-col gap-lg'>
          <ScenarioSelector
            scenarios={scenarios}
            selectedScenarioId={selectedScenarioId}
            onSelectScenario={setSelectedScenarioId}
          />

          <ApprovalReviewPanel
            selectedScenarioDetails={selectedScenarioDetails}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
