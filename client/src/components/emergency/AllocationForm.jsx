import React, { useState } from 'react';

export default function AllocationForm({ onSubmit }) {
  const [projectName, setProjectName] = useState('');
  const [department, setDepartment] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!projectName.trim()) {
      setError('Project name is required');
      return;
    }
    if (!department.trim()) {
      setError('Department is required');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid positive amount');
      return;
    }

    onSubmit({
      project_name: projectName,
      department,
      amount: parseFloat(amount),
    });
  };

  return (
    <div className='bg-surface-container border border-outline-variant rounded-lg p-md max-w-xl mx-auto'>
      <div className='flex items-center gap-sm mb-lg border-b border-outline-variant pb-sm'>
        <span className='material-symbols-outlined text-tertiary text-[24px]'>emergency</span>
        <h3 className='text-headline-md font-headline-md text-on-surface'>Emergency Fund Allocation</h3>
      </div>

      <form onSubmit={handleSubmit} className='space-y-md'>
        {error && (
          <div className='bg-error-container/20 border border-error/30 text-error p-sm rounded text-body-md'>
            {error}
          </div>
        )}

        <div>
          <label className='block text-label-md font-label-md text-on-surface-variant uppercase mb-1'>Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className='w-full bg-surface-variant border border-outline-variant rounded py-2 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors'
            placeholder="e.g., Flood Relief Infrastructure"
          />
        </div>

        <div>
          <label className='block text-label-md font-label-md text-on-surface-variant uppercase mb-1'>Department</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className='w-full bg-surface-variant border border-outline-variant rounded py-2 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors'
            placeholder="e.g., Ministry of Infrastructure"
          />
        </div>

        <div>
          <label className='block text-label-md font-label-md text-on-surface-variant uppercase mb-1'>Allocation Amount ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className='w-full bg-surface-variant border border-outline-variant rounded py-2 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors'
            placeholder="e.g., 10000000"
          />
        </div>

        <button
          type="submit"
          className='w-full flex items-center justify-center gap-sm bg-inverse-primary text-white py-2 rounded hover:bg-opacity-90 transition-opacity text-label-md font-label-md uppercase font-bold'
        >
          <span className='material-symbols-outlined text-[18px]'>lock</span>
          Authorize Allocation (Requires MFA)
        </button>
      </form>
    </div>
  );
}
