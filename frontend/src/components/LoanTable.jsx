import React, { useState } from 'react';

const LoanTable = () => {
  const [activeTab, setActiveTab] = useState('schedules');

  const renderTableContent = () => {
    switch (activeTab) {
      case 'schedules':
        return (
          <table className='w-full text-left border-collapse'>
            <thead className='text-[10px] uppercase tracking-widest text-slate-400 font-bold border-b border-slate-100'>
              <tr>
                <th className='pb-3 px-2'>Loan ID</th>
                <th className='pb-3 px-2'>Borrower</th>
                <th className='pb-3 px-2'>Due Date</th>
                <th className='pb-3 px-2 text-right'>Amount</th>
                <th className='pb-3 px-2 text-center'>Status</th>
                <th className='pb-3 px-2'></th>
              </tr>
            </thead>
            <tbody className='text-sm font-medium'>
              <tr className='hover:bg-surface-container-high transition-colors group'>
                <td className='py-4 px-2 font-mono text-slate-500'>L-89422</td>
                <td className='py-4 px-2 text-primary font-bold'>Arjun Sharma</td>
                <td className='py-4 px-2 text-slate-600'>22 Oct 2023</td>
                <td className='py-4 px-2 text-right font-bold text-primary'>₹12,450.00</td>
                <td className='py-4 px-2 text-center'>
                  <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold border-l-2 border-green-700'>ON_TIME</span>
                </td>
                <td className='py-4 px-2 text-right'>
                  <span className='material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary'>more_vert</span>
                </td>
              </tr>
              <tr className='hover:bg-surface-container-high transition-colors group'>
                <td className='py-4 px-2 font-mono text-slate-500'>L-89423</td>
                <td className='py-4 px-2 text-primary font-bold'>Priya Verma</td>
                <td className='py-4 px-2 text-slate-600'>19 Oct 2023</td>
                <td className='py-4 px-2 text-right font-bold text-primary'>₹45,000.00</td>
                <td className='py-4 px-2 text-center'>
                  <span className='px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold border-l-2 border-amber-700'>DELAYED</span>
                </td>
                <td className='py-4 px-2 text-right'>
                  <span className='material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary'>more_vert</span>
                </td>
              </tr>
              <tr className='hover:bg-surface-container-high transition-colors group'>
                <td className='py-4 px-2 font-mono text-slate-500'>L-89424</td>
                <td className='py-4 px-2 text-primary font-bold'>Global Tech Inc.</td>
                <td className='py-4 px-2 text-slate-600'>12 Oct 2023</td>
                <td className='py-4 px-2 text-right font-bold text-primary'>₹2,40,000.00</td>
                <td className='py-4 px-2 text-center'>
                  <span className='px-3 py-1 bg-red-100 text-error rounded-full text-[10px] font-bold border-l-2 border-error'>DEFAULT</span>
                </td>
                <td className='py-4 px-2 text-right'>
                  <span className='material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary'>more_vert</span>
                </td>
              </tr>
              <tr className='hover:bg-surface-container-high transition-colors group'>
                <td className='py-4 px-2 font-mono text-slate-500'>L-89425</td>
                <td className='py-4 px-2 text-primary font-bold'>Sarah Jenkins</td>
                <td className='py-4 px-2 text-slate-600'>25 Oct 2023</td>
                <td className='py-4 px-2 text-right font-bold text-primary'>₹8,900.00</td>
                <td className='py-4 px-2 text-center'>
                  <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold border-l-2 border-green-700'>ON_TIME</span>
                </td>
                <td className='py-4 px-2 text-right'>
                  <span className='material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary'>more_vert</span>
                </td>
              </tr>
            </tbody>
          </table>
        );
      case 'transactions':
        return (
          <div className='text-center py-10 text-slate-500'>Transaction History content goes here.</div>
        );
      case 'audit':
        return (
          <div className='text-center py-10 text-slate-500'>Tamper-Evident Audit Trail content goes here.</div>
        );
      default:
        return null;
    }
  };

  return (
    <div className='col-span-2 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden'>
      <div className='flex border-b border-slate-100 px-6'>
        <button
          className={`px-6 py-4 text-sm font-bold ${activeTab === 'schedules' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-slate-500 hover:text-slate-900'}`}
          onClick={() => setActiveTab('schedules')}
        >
          Loan Repayment Schedules
        </button>
        <button
          className={`px-6 py-4 text-sm font-bold ${activeTab === 'transactions' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-slate-500 hover:text-slate-900'}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transaction History
        </button>
        <button
          className={`px-6 py-4 text-sm font-bold ${activeTab === 'audit' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-slate-500 hover:text-slate-900'}`}
          onClick={() => setActiveTab('audit')}
        >
          Tamper-Evident Audit Trail
        </button>
      </div>
      <div className='p-6'>
        {renderTableContent()}
      </div>
    </div>
  );
};

export default LoanTable;
