import React, { useState, useEffect } from 'react';
import KPIHeaderStrip from '../components/assortment/KPIHeaderStrip';
import SKUPerformanceTable from '../components/assortment/SKUPerformanceTable';
import ScenarioSelector from '../components/assortment/ScenarioSelector';
import ApprovalReviewPanel from '../components/assortment/ApprovalReviewPanel';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { getKPIs, getSKUs, getScenarios, submitScenario } from '../services/api';

export default function DashboardPage({ searchQuery }) {
  const [kpis, setKPIs] = useState(null);
  const [skus, setSKUs] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  
  const [loadingKPIs, setLoadingKPIs] = useState(true);
  const [loadingSKUs, setLoadingSKUs] = useState(true);
  const [loadingScenarios, setLoadingScenarios] = useState(true);
  
  const [errorKPIs, setErrorKPIs] = useState(null);
  const [errorSKUs, setErrorSKUs] = useState(null);
  const [errorScenarios, setErrorScenarios] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    // Fetch KPIs
    getKPIs()
      .then((data) => {
        setKPIs(data);
        setLoadingKPIs(false);
      })
      .catch((err) => {
        console.error('Error fetching KPIs:', err);
        setErrorKPIs(err);
        setLoadingKPIs(false);
      });

    // Fetch SKUs
    getSKUs()
      .then((data) => {
        setSKUs(data);
        setLoadingSKUs(false);
      })
      .catch((err) => {
        console.error('Error fetching SKUs:', err);
        setErrorSKUs(err);
        setLoadingSKUs(false);
      });

    // Fetch Scenarios
    getScenarios()
      .then((data) => {
        setScenarios(data);
        // Pre-select Balanced scenario
        const balanced = data.find((s) => s.name.toLowerCase() === 'balanced') || data[0];
        setSelectedScenario(balanced);
        setLoadingScenarios(false);
      })
      .catch((err) => {
        console.error('Error fetching scenarios:', err);
        setErrorScenarios(err);
        setLoadingScenarios(false);
      });
  }, []);

  const handleSubmitScenario = async (payload) => {
    setSubmitting(true);
    try {
      const result = await submitScenario(payload);
      setSubmitResult(result);
      setIsConfirmModalOpen(true);
    } catch (err) {
      console.error('Error submitting scenario:', err);
      alert(err.response?.data?.detail || 'Failed to submit scenario. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='space-y-gutter'>
      {/* KPI Header Strip */}
      <KPIHeaderStrip kpis={kpis} loading={loadingKPIs} error={errorKPIs} />

      {/* Main Grid */}
      <div className='grid grid-cols-12 gap-gutter'>
        {/* Left Column: SKU Performance */}
        <div className='col-span-12 lg:col-span-8'>
          <SKUPerformanceTable
            skus={skus}
            loading={loadingSKUs}
            error={errorSKUs}
            searchQuery={searchQuery}
          />
        </div>

        {/* Right Column: Scenarios & Approvals */}
        <div className='col-span-12 lg:col-span-4 flex flex-col gap-gutter'>
          <ScenarioSelector
            scenarios={scenarios}
            selectedScenario={selectedScenario}
            onSelectScenario={setSelectedScenario}
            loading={loadingScenarios}
            error={errorScenarios}
          />
          
          <ApprovalReviewPanel
            selectedScenario={selectedScenario}
            onSubmit={handleSubmitScenario}
            submitting={submitting}
          />
        </div>
      </div>

      {/* Inline Confirmation Banner (if submitted) */}
      {submitResult && (
        <div className='bg-green-900/20 border border-green-800 text-green-400 p-md rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-gutter'>
          <div>
            <h4 className='font-bold text-sm flex items-center gap-1'>
              <span className='material-symbols-outlined text-lg'>check_circle</span>
              Scenario Submitted Successfully
            </h4>
            <p className='text-xs text-on-surface-variant mt-1'>
              Audit ID: <span className='font-mono text-on-surface'>{submitResult.audit_id}</span> | 
              Scenario: <span className='font-semibold text-on-surface'>{submitResult.scenario_name}</span> | 
              Submitted By: <span className='font-semibold text-on-surface'>{submitResult.submitted_by}</span> | 
              Time: <span className='font-semibold text-on-surface'>{new Date(submitResult.submitted_at).toLocaleString()}</span>
            </p>
          </div>
          <Button variant='outline' onClick={() => setSubmitResult(null)} className='text-xs py-1 px-3'>
            Dismiss
          </Button>
        </div>
      )}

      {/* Success Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title='Submission Confirmation'
      >
        <div className='space-y-4 text-on-surface'>
          <div className='flex items-center gap-3 text-green-400'>
            <span className='material-symbols-outlined text-4xl'>check_circle</span>
            <div>
              <h4 className='font-bold text-lg'>Scenario Approved &amp; Submitted</h4>
              <p className='text-xs text-on-surface-variant'>The assortment changes have been logged to the audit trail.</p>
            </div>
          </div>

          {submitResult && (
            <div className='bg-[#0F172A] p-sm rounded border border-[#334155] space-y-2 text-xs font-mono'>
              <div className='flex justify-between'>
                <span className='text-on-surface-variant'>Audit ID:</span>
                <span className='text-on-surface font-bold'>{submitResult.audit_id}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-on-surface-variant'>Scenario:</span>
                <span className='text-on-surface font-bold'>{submitResult.scenario_name}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-on-surface-variant'>Submitted By:</span>
                <span className='text-on-surface font-bold'>{submitResult.submitted_by}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-on-surface-variant'>Timestamp:</span>
                <span className='text-on-surface font-bold'>{new Date(submitResult.submitted_at).toLocaleString()}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-on-surface-variant'>Status:</span>
                <span className='text-green-400 font-bold uppercase'>{submitResult.status}</span>
              </div>
            </div>
          )}

          <div className='flex justify-end pt-2'>
            <Button onClick={() => setIsConfirmModalOpen(false)}>Close</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
