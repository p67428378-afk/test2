import React, { useState, useEffect } from 'react';
import Button from '../common/Button';

export default function ApprovalReviewPanel({ selectedScenario, onSubmit, submitting }) {
  const [acknowledge, setAcknowledge] = useState(false);

  // Reset acknowledgment when scenario changes
  useEffect(() => {
    setAcknowledge(false);
  }, [selectedScenario]);

  if (!selectedScenario) {
    return (
      <div className='bg-[#1E293B] border border-[#334155] rounded-xl p-md flex flex-col items-center justify-center h-96 text-on-surface-variant'>
        <span className='material-symbols-outlined text-4xl mb-2'>info</span>
        <p className='text-sm'>Select a scenario to review and submit.</p>
      </div>
    );
  }

  const pbPassed = selectedScenario.projected_pb_percentage >= 20;
  const capacityPassed = selectedScenario.projected_shelf_capacity <= 90;
  const instockPassed = selectedScenario.projected_in_stock_rate >= 95;

  const allPassed = pbPassed && capacityPassed && instockPassed;
  const canSubmit = allPassed || acknowledge;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      scenario_id: selectedScenario.id,
      submitted_by: 'Marcus Vance',
      acknowledge_violations: acknowledge,
    });
  };

  return (
    <div className='bg-[#1E293B] border border-[#334155] rounded-xl flex flex-col h-full' id='approvals'>
      <div className='p-md border-b border-[#334155] bg-surface-container-low'>
        <h3 className='font-title-sm text-title-sm text-on-surface'>Approval Review Panel</h3>
        <p className='text-xs text-[#FFD100] font-mono-data mt-1'>— {selectedScenario.name} Scenario</p>
      </div>
      
      <div className='p-md flex-grow flex flex-col gap-md'>
        <div>
          <div className='font-label-caps text-label-caps text-on-surface-variant uppercase mb-2'>Proposed Actions</div>
          {selectedScenario.sku_actions && selectedScenario.sku_actions.length > 0 ? (
            <ul className='text-sm space-y-2'>
              {selectedScenario.sku_actions.map((action, idx) => {
                let dotColor = 'bg-gray-400';
                let textColor = 'text-gray-400';
                if (action.action === 'GROW') {
                  dotColor = 'bg-green-400';
                  textColor = 'text-green-400';
                } else if (action.action === 'REDUCE') {
                  dotColor = 'bg-red-400';
                  textColor = 'text-red-400';
                } else if (action.action === 'SWAP') {
                  dotColor = 'bg-amber-400';
                  textColor = 'text-amber-400';
                } else if (action.action === 'MAINTAIN') {
                  dotColor = 'bg-blue-400';
                  textColor = 'text-blue-400';
                }

                return (
                  <li key={idx} className='flex items-center gap-2'>
                    <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                    <span className={`font-bold ${textColor}`}>{action.action}</span>
                    <span className='text-on-surface'>{action.sku}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className='text-xs text-on-surface-variant'>No actions proposed for this scenario.</p>
          )}
        </div>

        <div className='border-t border-[#334155] pt-md'>
          <div className='font-label-caps text-label-caps text-on-surface-variant uppercase mb-2'>Guardrail Checks</div>
          <div className='space-y-2 text-sm font-mono-data'>
            <div className='flex justify-between items-center'>
              <span className='text-on-surface'>PB Target &gt;= 20%</span>
              {pbPassed ? (
                <span className='flex items-center gap-1 text-green-400 text-xs'>
                  <span className='material-symbols-outlined text-[16px]'>check</span> Passed ({selectedScenario.projected_pb_percentage.toFixed(1)}%)
                </span>
              ) : (
                <span className='flex items-center gap-1 text-red-400 text-xs'>
                  <span className='material-symbols-outlined text-[16px]'>warning</span> Failed ({selectedScenario.projected_pb_percentage.toFixed(1)}%)
                </span>
              )}
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-on-surface'>Capacity &lt;= 90%</span>
              {capacityPassed ? (
                <span className='flex items-center gap-1 text-green-400 text-xs'>
                  <span className='material-symbols-outlined text-[16px]'>check</span> Passed ({selectedScenario.projected_shelf_capacity.toFixed(1)}%)
                </span>
              ) : (
                <span className='flex items-center gap-1 text-red-400 text-xs'>
                  <span className='material-symbols-outlined text-[16px]'>warning</span> Failed ({selectedScenario.projected_shelf_capacity.toFixed(1)}%)
                </span>
              )}
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-on-surface'>In-Stock &gt;= 95%</span>
              {instockPassed ? (
                <span className='flex items-center gap-1 text-green-400 text-xs'>
                  <span className='material-symbols-outlined text-[16px]'>check</span> Passed ({selectedScenario.projected_in_stock_rate.toFixed(1)}%)
                </span>
              ) : (
                <span className='flex items-center gap-1 text-red-400 text-xs'>
                  <span className='material-symbols-outlined text-[16px]'>warning</span> Failed ({selectedScenario.projected_in_stock_rate.toFixed(1)}%)
                </span>
              )}
            </div>
          </div>
        </div>

        {!allPassed && (
          <div className='border-t border-[#334155] pt-md mt-auto'>
            <label className='flex items-start gap-2 cursor-pointer select-none'>
              <input
                type='checkbox'
                checked={acknowledge}
                onChange={(e) => setAcknowledge(e.target.checked)}
                className='mt-0.5 rounded bg-[#1E293B] border-[#334155] text-[#FFD100] focus:ring-[#FFD100]'
              />
              <span className='text-xs text-on-surface-variant leading-tight'>
                I acknowledge the guardrail violations and wish to proceed with submission.
              </span>
            </label>
          </div>
        )}
      </div>

      <div className='p-md border-t border-[#334155] mt-auto'>
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className='w-full'
        >
          {submitting ? 'Submitting...' : 'Submit Scenario'}
        </Button>
      </div>
    </div>
  );
}
