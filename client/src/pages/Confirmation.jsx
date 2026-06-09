import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function Confirmation() {
  const location = useLocation();
  const approvalData = location.state || {
    approvalId: 'f1cb9b89-bc8f-4dc0-ac2d-5fac0d960c6a',
    approverName: 'Administrator',
    scenarioName: 'Balanced',
    scenarioId: 'balanced',
    timestamp: new Date().toISOString(),
    guardrailStatus: {
      new_sku_limit_check: 'PASS',
      private_brand_check: 'PASS',
      shelf_space_check: 'PASS',
    },
    itemsToAdd: [
      {
        sku: 'CV-PST-08',
        name: 'Clover Valley Pistachios 8oz',
        is_private_brand: true,
        shelf_space: 2.0,
      },
    ],
    itemsToRemove: [
      {
        sku: 'CV-TOR-05',
        name: 'Clover Valley Tortilla Chips 13oz',
      },
    ],
  };

  const handleDownload = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(approvalData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `assortment_approval_${approvalData.approvalId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className='max-w-2xl mx-auto space-y-6 py-4'>
      {/* Success Banner */}
      <div className='glass-card rounded-xl p-8 bg-white text-center space-y-4 border-t-4 border-t-emerald-500'>
        <div className='w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600'>
          <span className='material-symbols-outlined text-[40px]'>check_circle</span>
        </div>
        <div className='space-y-2'>
          <h3 className='text-2xl font-bold text-slate-900'>Assortment Approved</h3>
          <p className='text-sm text-slate-500'>
            The Snacks category assortment changes have been successfully submitted and logged.
          </p>
        </div>
      </div>

      {/* Audit Trail Summary */}
      <div className='glass-card rounded-xl p-6 bg-white space-y-4'>
        <h4 className='text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3'>
          Audit Trail Summary
        </h4>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
          <div>
            <p className='text-xs text-slate-400 font-medium'>Approval ID</p>
            <p className='font-mono text-slate-900 mt-0.5 break-all'>{approvalData.approvalId}</p>
          </div>
          <div>
            <p className='text-xs text-slate-400 font-medium'>Timestamp</p>
            <p className='text-slate-900 mt-0.5'>{new Date(approvalData.timestamp).toLocaleString()}</p>
          </div>
          <div>
            <p className='text-xs text-slate-400 font-medium'>Approver Name</p>
            <p className='text-slate-900 mt-0.5 font-semibold'>{approvalData.approverName}</p>
          </div>
          <div>
            <p className='text-xs text-slate-400 font-medium'>Selected Scenario</p>
            <p className='text-slate-900 mt-0.5 font-semibold'>{approvalData.scenarioName}</p>
          </div>
        </div>
      </div>

      {/* Guardrail Verification */}
      <div className='glass-card rounded-xl p-6 bg-white space-y-4'>
        <h4 className='text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3'>
          Guardrail Verification
        </h4>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm'>
          <div className='flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-lg p-3'>
            <span className='material-symbols-outlined text-emerald-600 text-[20px]'>check_circle</span>
            <div>
              <p className='text-xs text-slate-500 font-medium'>SKU Limit</p>
              <p className='text-xs font-bold text-emerald-800 mt-0.5'>PASSED</p>
            </div>
          </div>
          <div className='flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-lg p-3'>
            <span className='material-symbols-outlined text-emerald-600 text-[20px]'>check_circle</span>
            <div>
              <p className='text-xs text-slate-500 font-medium'>Private Brand</p>
              <p className='text-xs font-bold text-emerald-800 mt-0.5'>PASSED</p>
            </div>
          </div>
          <div className='flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-lg p-3'>
            <span className='material-symbols-outlined text-emerald-600 text-[20px]'>check_circle</span>
            <div>
              <p className='text-xs text-slate-500 font-medium'>Shelf Space</p>
              <p className='text-xs font-bold text-emerald-800 mt-0.5'>PASSED</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <button
          onClick={handleDownload}
          className='flex-1 bg-slate-900 text-white hover:bg-slate-800 py-3 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2'
        >
          <span className='material-symbols-outlined text-[18px]'>download</span>
          Download Changes (.json)
        </button>
        <Link
          to='/'
          className='flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-lg text-sm font-bold transition-all text-center flex items-center justify-center gap-2'
        >
          <span className='material-symbols-outlined text-[18px]'>home</span>
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
