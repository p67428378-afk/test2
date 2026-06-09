import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitApproval } from '../services/api';
import GuardrailList from '../components/assortment/GuardrailList';
import Button from '../components/common/Button';

const ApprovalReviewPage = ({ selectedScenario, adjustments, setAuditData }) => {
  const [submitting, setSubLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  if (!selectedScenario) {
    return (
      <div className='bg-surface-container rounded-lg p-8 text-center border border-outline-variant/30'>
        <p className='text-on-surface-variant'>No scenario selected. Please go to Scenario Comparison first.</p>
        <Button onClick={() => navigate('/scenarios')} className='mt-4 mx-auto'>
          Go to Scenario Comparison
        </Button>
      </div>
    );
  }

  const { name, projected_sales, change_in_private_brand_pct, shelf_utilization_pct } = selectedScenario;

  // Calculate private brand % (base 24.5% + change)
  const finalPrivateBrandPct = parseFloat((24.5 + change_in_private_brand_pct).toFixed(1));
  const finalShelfUtilization = parseFloat(shelf_utilization_pct.toFixed(1));

  const isShelfUtilizationOk = finalShelfUtilization <= 95.0;
  const isPrivateBrandOk = finalPrivateBrandPct >= 15.0;
  const isSubmitDisabled = !isShelfUtilizationOk || !isPrivateBrandOk;

  const appliedChanges = Object.entries(adjustments).map(([skuId, action]) => ({
    sku_id: skuId,
    action,
  }));

  const handleSubmit = async () => {
    setSubLoading(true);
    setError(null);
    try {
      const result = await submitApproval({
        scenario_id: selectedScenario.scenario_id,
        applied_changes: appliedChanges,
      });
      setAuditData(result);
      navigate('/confirmation');
    } catch (err) {
      console.error('Failed to submit approval:', err);
      setError(err.response?.data?.detail || 'Failed to submit approval. Please try again.');
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-bold text-on-surface'>Approval Review</h3>
        <p className='text-xs text-on-surface-variant'>Review selected scenario, SKU actions, and guardrails before submission</p>
      </div>

      {error && (
        <div className='bg-error-container/20 border border-error-container text-on-error-container p-4 rounded-lg text-sm'>
          {error}
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left Column: Scenario Summary & SKU Actions */}
        <div className='lg:col-span-2 space-y-6'>
          <div className='bg-surface-container rounded-lg p-6 border border-outline-variant/30 space-y-4'>
            <h4 className='text-sm font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant pb-2'>
              Selected Scenario: {name}
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='bg-background p-4 rounded border border-outline-variant/20'>
                <p className='text-xs text-on-surface-variant'>Projected Sales</p>
                <p className='text-lg font-bold text-on-surface'>${projected_sales.toLocaleString()}</p>
              </div>
              <div className='bg-background p-4 rounded border border-outline-variant/20'>
                <p className='text-xs text-on-surface-variant'>Private Brand Share</p>
                <p className={`text-lg font-bold ${isPrivateBrandOk ? 'text-green-status' : 'text-red-status'}`}>
                  {finalPrivateBrandPct}%
                </p>
              </div>
              <div className='bg-background p-4 rounded border border-outline-variant/20'>
                <p className='text-xs text-on-surface-variant'>Shelf Utilization</p>
                <p className={`text-lg font-bold ${isShelfUtilizationOk ? 'text-green-status' : 'text-red-status'}`}>
                  {finalShelfUtilization}%
                </p>
              </div>
            </div>
          </div>

          {/* SKU Action List */}
          <div className='bg-surface-container rounded-lg p-6 border border-outline-variant/30 space-y-4'>
            <h4 className='text-sm font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant pb-2'>
              SKU Assortment Actions
            </h4>
            <div className='overflow-x-auto'>
              <table className='w-full text-left border-collapse'>
                <thead>
                  <tr className='border-b border-surface-variant text-xs font-semibold text-on-surface-variant uppercase tracking-wider'>
                    <th className='p-3 py-2'>SKU ID</th>
                    <th className='p-3 py-2'>Action</th>
                  </tr>
                </thead>
                <tbody className='font-mono text-xs text-on-surface divide-y divide-surface-variant/50'>
                  {appliedChanges.length > 0 ? (
                    appliedChanges.map((change) => (
                      <tr key={change.sku_id} className='hover:bg-surface-container-highest transition-colors'>
                        <td className='p-3 py-2 text-secondary'>{change.sku_id.substring(0, 8).toUpperCase()}</td>
                        <td className='p-3 py-2 font-sans'>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              change.action === 'ADD'
                                ? 'bg-green-status/15 text-green-status'
                                : change.action === 'REMOVE'
                                ? 'bg-red-status/15 text-red-status'
                                : change.action === 'SWAP'
                                ? 'bg-primary-container/15 text-primary-container'
                                : 'bg-blue-status/15 text-blue-status'
                            }`}
                          >
                            {change.action}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className='p-4 text-center text-on-surface-variant font-sans'>
                        No custom SKU actions selected. All SKUs will remain as KEEP.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Guardrails & Submit */}
        <div className='space-y-6'>
          <GuardrailList shelfUtilization={finalShelfUtilization} privateBrandPct={finalPrivateBrandPct} />

          <div className='bg-surface-container rounded-lg p-6 border border-outline-variant/30 space-y-4'>
            <h4 className='text-sm font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant pb-2'>
              Submit Assortment Plan
            </h4>
            <p className='text-xs text-on-surface-variant'>
              Submitting will save the assortment changes and generate an official audit trail.
            </p>
            {isSubmitDisabled && (
              <p className='text-xs text-red-status font-semibold'>
                ⚠️ Submission is disabled because one or more guardrails are violated. Please adjust your SKU actions.
              </p>
            )}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitDisabled || submitting}
              className='w-full py-3'
            >
              {submitting ? 'Submitting...' : 'Submit Assortment Plan'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalReviewPage;
