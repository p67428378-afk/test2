import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getScenarios, getDashboardKPIs, getDashboardSKUs, submitApproval } from '../services/api';

export default function ApprovalReview() {
  const navigate = useNavigate();
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [skus, setSkus] = useState([]);
  const [approverName, setApproverName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [scenariosData, kpiData, skusData] = await Promise.all([
          getScenarios(),
          getDashboardKPIs(),
          getDashboardSKUs(),
        ]);
        setScenarios(scenariosData);
        setKpis(kpiData);
        setSkus(skusData);

        // Find selected scenario
        const selected = scenariosData.find((s) => s.is_selected) || scenariosData.find((s) => s.id === 'balanced');
        setSelectedScenario(selected);
      } catch (err) {
        console.error(err);
        setError('Failed to load approval review data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Calculate guardrails locally for display
  const totalSkusCount = skus.length;
  const currentPbPct = kpis?.private_brand_pct || 0.0;
  const currentShelfSpace = skus.reduce((sum, s) => sum + s.shelf_space, 0);

  const itemsToAddCount = selectedScenario?.items_to_add?.length || 0;
  const newSkuRatio = totalSkusCount > 0 ? itemsToAddCount / totalSkusCount : 0.0;
  const newSkuLimitCheck = newSkuRatio <= 0.20 ? 'PASS' : 'FAIL';

  const newPbPct = selectedScenario?.new_private_brand_pct || 0.0;
  const privateBrandCheck = newPbPct >= currentPbPct ? 'PASS' : 'FAIL';

  const spaceImpact = selectedScenario?.shelf_space_impact_ft || 0.0;
  const projectedSpace = currentShelfSpace + spaceImpact;
  const shelfSpaceCheck = projectedSpace <= 80.0 ? 'PASS' : 'FAIL';

  const anyGuardrailFailed =
    newSkuLimitCheck === 'FAIL' ||
    privateBrandCheck === 'FAIL' ||
    shelfSpaceCheck === 'FAIL';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!approverName.trim()) {
      setError('Approver name is required.');
      return;
    }
    if (anyGuardrailFailed) {
      setError('Cannot submit: One or more guardrail checks have failed.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const result = await submitApproval(selectedScenario.id, approverName);
      if (result.success) {
        navigate('/confirmation', {
          state: {
            approvalId: result.approval_id,
            approverName: result.approver_name,
            scenarioName: selectedScenario.name,
            scenarioId: selectedScenario.id,
            timestamp: result.timestamp,
            guardrailStatus: result.guardrail_status,
            itemsToAdd: selectedScenario.items_to_add,
            itemsToRemove: selectedScenario.items_to_remove,
          },
        });
      } else {
        setError('Approval submission failed.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to submit approval.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-full p-8'>
        <div className='text-slate-500 font-medium'>Loading approval review...</div>
      </div>
    );
  }

  if (!selectedScenario) {
    return (
      <div className='p-8'>
        <div className='bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4'>
          No scenario selected. Please select a scenario on the Scenario Comparison screen first.
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6 max-w-4xl mx-auto'>
      <div>
        <h3 className='text-xl font-bold text-slate-900'>Approval Review</h3>
        <p className='text-sm text-slate-500'>
          Review the selected scenario, verify guardrails, and submit for final approval.
        </p>
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-sm font-medium'>
          {error}
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Left Column: Scenario Summary & SKU Changes */}
        <div className='md:col-span-2 space-y-6'>
          {/* Scenario Summary */}
          <div className='glass-card rounded-xl p-6 bg-white space-y-4'>
            <div className='flex justify-between items-start'>
              <div>
                <h4 className='text-lg font-bold text-slate-900'>{selectedScenario.name} Scenario</h4>
                <p className='text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1'>
                  Selected Strategy
                </p>
              </div>
              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200'>
                Active
              </span>
            </div>
            <p className='text-sm text-slate-600 leading-relaxed'>
              {selectedScenario.description}
            </p>
            <div className='grid grid-cols-3 gap-4 pt-4 border-t border-slate-100'>
              <div>
                <p className='text-xs text-slate-400 font-medium'>Sales Lift</p>
                <p className='text-lg font-bold text-emerald-700'>
                  +{selectedScenario.projected_sales_lift.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className='text-xs text-slate-400 font-medium'>Private Brand</p>
                <p className='text-lg font-bold text-slate-900'>
                  {selectedScenario.new_private_brand_pct.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className='text-xs text-slate-400 font-medium'>Space Impact</p>
                <p className='text-lg font-bold text-slate-900'>
                  {selectedScenario.shelf_space_impact_ft > 0 ? '+' : ''}
                  {selectedScenario.shelf_space_impact_ft.toFixed(1)} ft
                </p>
              </div>
            </div>
          </div>

          {/* SKU Action List */}
          <div className='glass-card rounded-xl p-6 bg-white space-y-4'>
            <h4 className='text-sm font-bold text-slate-900 uppercase tracking-wider'>
              SKU Action List
            </h4>
            <div className='divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-2'>
              {selectedScenario.items_to_add.map((item) => (
                <div key={item.sku} className='py-3 flex items-center justify-between text-sm'>
                  <div>
                    <p className='font-semibold text-slate-900'>{item.name}</p>
                    <p className='font-mono text-xs text-slate-500 mt-0.5'>{item.sku}</p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <span className='text-xs text-slate-500'>{item.shelf_space.toFixed(1)} ft</span>
                    <span className='text-xs font-bold uppercase text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full'>
                      Add
                    </span>
                  </div>
                </div>
              ))}
              {selectedScenario.items_to_remove.map((item) => (
                <div key={item.sku} className='py-3 flex items-center justify-between text-sm'>
                  <div>
                    <p className='font-semibold text-slate-900'>{item.name}</p>
                    <p className='font-mono text-xs text-slate-500 mt-0.5'>{item.sku}</p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <span className='text-xs font-bold uppercase text-red-800 bg-red-100 border border-red-200 px-2 py-0.5 rounded-full'>
                      Remove
                    </span>
                  </div>
                </div>
              ))}
              {selectedScenario.items_to_add.length === 0 && selectedScenario.items_to_remove.length === 0 && (
                <p className='py-4 text-center text-slate-400 text-sm'>No SKU changes in this scenario.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Guardrails & Submit Form */}
        <div className='space-y-6'>
          {/* Guardrail Status Checks */}
          <div className='glass-card rounded-xl p-6 bg-white space-y-4'>
            <h4 className='text-sm font-bold text-slate-900 uppercase tracking-wider'>
              Guardrail Status
            </h4>
            <div className='space-y-4'>
              {/* Guardrail 1 */}
              <div className='flex items-start gap-3'>
                <span className={`material-symbols-outlined mt-0.5 ${
                  newSkuLimitCheck === 'PASS' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {newSkuLimitCheck === 'PASS' ? 'check_circle' : 'cancel'}
                </span>
                <div>
                  <p className='text-sm font-semibold text-slate-900'>New SKU Limit Check</p>
                  <p className='text-xs text-slate-500 mt-0.5'>
                    New SKUs must not exceed 20% of total assortment.
                  </p>
                  <p className='text-xs font-mono text-slate-400 mt-1'>
                    Current: {(newSkuRatio * 100).toFixed(1)}% (Limit: 20.0%)
                  </p>
                </div>
              </div>

              {/* Guardrail 2 */}
              <div className='flex items-start gap-3'>
                <span className={`material-symbols-outlined mt-0.5 ${
                  privateBrandCheck === 'PASS' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {privateBrandCheck === 'PASS' ? 'check_circle' : 'cancel'}
                </span>
                <div>
                  <p className='text-sm font-semibold text-slate-900'>Private Brand Check</p>
                  <p className='text-xs text-slate-500 mt-0.5'>
                    Private Brand % must not fall below current level.
                  </p>
                  <p className='text-xs font-mono text-slate-400 mt-1'>
                    Projected: {newPbPct.toFixed(1)}% (Current: {currentPbPct.toFixed(1)}%)
                  </p>
                </div>
              </div>

              {/* Guardrail 3 */}
              <div className='flex items-start gap-3'>
                <span className={`material-symbols-outlined mt-0.5 ${
                  shelfSpaceCheck === 'PASS' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {shelfSpaceCheck === 'PASS' ? 'check_circle' : 'cancel'}
                </span>
                <div>
                  <p className='text-sm font-semibold text-slate-900'>Shelf Space Check</p>
                  <p className='text-xs text-slate-500 mt-0.5'>
                    Total required shelf space must not exceed capacity.
                  </p>
                  <p className='text-xs font-mono text-slate-400 mt-1'>
                    Projected: {projectedSpace.toFixed(1)} ft (Limit: 80.0 ft)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Form */}
          <div className='glass-card rounded-xl p-6 bg-white'>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label htmlFor='approverName' className='block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2'>
                  Approver Name
                </label>
                <input
                  type='text'
                  id='approverName'
                  className='w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors'
                  placeholder='Enter your full name'
                  value={approverName}
                  onChange={(e) => setApproverName(e.target.value)}
                  required
                />
              </div>

              <button
                type='submit'
                disabled={submitting || anyGuardrailFailed || !approverName.trim()}
                className={`w-full py-3 rounded-lg text-sm font-bold transition-all shadow-sm ${
                  anyGuardrailFailed
                    ? 'bg-red-100 text-red-400 cursor-not-allowed'
                    : !approverName.trim()
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {submitting ? 'Submitting...' : anyGuardrailFailed ? 'Guardrail Failure' : 'Submit Approval'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
