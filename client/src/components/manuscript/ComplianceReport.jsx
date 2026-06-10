import React, { useState, useEffect } from 'react';
import { getStylesheets, runComplianceCheck } from '../../services/api';

export default function ComplianceReport({ manuscriptId }) {
  const [stylesheets, setStylesheets] = useState([]);
  const [selectedStylesheet, setSelectedStylesheet] = useState('');
  const [checking, setChecking] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStylesheets = async () => {
      try {
        const data = await getStylesheets();
        setStylesheets(data);
        if (data.length > 0) {
          setSelectedStylesheet(data[0].stylesheet_id);
        }
      } catch (err) {
        console.error('Failed to fetch stylesheets:', err);
      }
    };
    fetchStylesheets();
  }, []);

  const handleCheck = async () => {
    if (!selectedStylesheet) return;

    setChecking(true);
    setError(null);
    setReport(null);

    try {
      const result = await runComplianceCheck(manuscriptId, selectedStylesheet);
      setReport(result);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to run compliance check.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className='bg-[#1E293B] border border-[#334155] rounded-xl p-6 shadow-sm'>
      <h3 className='font-headline-md text-headline-md text-on-surface mb-4'>Pre-Flight Compliance Check</h3>
      
      <div className='flex flex-col md:flex-row gap-4 items-end mb-6'>
        <div className='flex-1'>
          <label className='block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2'>
            Select Style Sheet
          </label>
          <select
            value={selectedStylesheet}
            onChange={(e) => setSelectedStylesheet(e.target.value)}
            className='w-full bg-[#0F172A] border-[#334155] border text-on-surface rounded-lg py-2 px-3 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]'
          >
            {stylesheets.map((sheet) => (
              <option key={sheet.stylesheet_id} value={sheet.stylesheet_id}>
                {sheet.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleCheck}
          disabled={checking || !selectedStylesheet}
          className='bg-[#6366F1] hover:bg-opacity-90 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 h-[42px]'
        >
          {checking ? (
            <>
              <span className='material-symbols-outlined animate-spin'>sync</span>
              <span>Checking...</span>
            </>
          ) : (
            <>
              <span className='material-symbols-outlined'>fact_check</span>
              <span>Run Check</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className='p-3 bg-error-container/20 border border-error/30 rounded-lg text-error flex items-center gap-2 text-sm mb-4'>
          <span className='material-symbols-outlined'>error</span>
          <span>{error}</span>
        </div>
      )}

      {report && (
        <div className='space-y-4'>
          <div className='flex items-center gap-3 p-4 rounded-xl bg-[#0F172A]/50 border border-[#334155]'>
            <span className={`material-symbols-outlined text-3xl ${
              report.status === 'passed' ? 'text-[#34d399]' : 'text-error'
            }`}>
              {report.status === 'passed' ? 'check_circle' : 'cancel'}
            </span>
            <div>
              <h4 className='font-bold text-on-surface capitalize'>
                Compliance Status: {report.status}
              </h4>
              <p className='text-xs text-on-surface-variant'>
                {report.status === 'passed' 
                  ? 'Your manuscript meets all required style sheet rules.' 
                  : 'Your manuscript has style sheet violations that need attention.'}
              </p>
            </div>
          </div>

          {report.errors.length > 0 && (
            <div>
              <h4 className='text-xs font-semibold text-error uppercase tracking-wider mb-2 flex items-center gap-1'>
                <span className='material-symbols-outlined text-sm'>error</span>
                Errors ({report.errors.length})
              </h4>
              <ul className='list-disc list-inside space-y-1 text-sm text-on-surface-variant bg-error-container/5 p-3 rounded-lg border border-error/10'>
                {report.errors.map((err, idx) => (
                  <li key={idx} className='text-error'>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {report.warnings.length > 0 && (
            <div>
              <h4 className='text-xs font-semibold text-tertiary uppercase tracking-wider mb-2 flex items-center gap-1'>
                <span className='material-symbols-outlined text-sm'>warning</span>
                Warnings ({report.warnings.length})
              </h4>
              <ul className='list-disc list-inside space-y-1 text-sm text-on-surface-variant bg-tertiary-container/5 p-3 rounded-lg border border-tertiary/10'>
                {report.warnings.map((warn, idx) => (
                  <li key={idx} className='text-tertiary'>{warn}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
