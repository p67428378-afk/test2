import React from 'react';

const AccountSelector = ({ accounts, selectedAccountId, onChange, status }) => {
  const getStatusBadge = () => {
    if (status === 'ACTIVE') {
      return (
        <div className='px-3 py-1 rounded-full bg-[#dcfce7] border border-[#86efac] text-[#166534] flex items-center gap-1 font-label-md text-label-md shadow-sm'>
          <span className='material-symbols-outlined text-[14px]'>check_circle</span>
          ACTIVE
        </div>
      );
    }
    if (status === 'FROZEN') {
      return (
        <div className='px-3 py-1 rounded-full bg-error-container border border-[#fecaca] text-error flex items-center gap-1 font-label-md text-label-md shadow-sm'>
          <span className='material-symbols-outlined text-[14px]'>block</span>
          FROZEN
        </div>
      );
    }
    if (status === 'DORMANT') {
      return (
        <div className='px-3 py-1 rounded-full bg-[#fef9c3] border border-[#fef08a] text-[#854d0e] flex items-center gap-1 font-label-md text-label-md shadow-sm'>
          <span className='material-symbols-outlined text-[14px]'>warning</span>
          DORMANT
        </div>
      );
    }
    return null;
  };

  return (
    <div className='flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6'>
      <div>
        <h2 className='font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-2'>Balance Inquiry</h2>
        <p className='font-body-md text-body-md text-on-surface-variant'>Last Updated: {new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC</p>
      </div>
      <div className='flex items-center gap-3'>
        <div className='relative'>
          <select
            value={selectedAccountId}
            onChange={(e) => onChange(e.target.value)}
            className='appearance-none bg-surface-container-lowest border border-outline-variant text-on-background font-body-md text-body-md py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm cursor-pointer min-w-[280px]'
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.accountNumber.startsWith('**') ? acc.accountNumber : `Account - ${acc.accountNumber}`} ({acc.status})
              </option>
            ))}
          </select>
          <span className='material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none'>expand_more</span>
        </div>
        {getStatusBadge()}
      </div>
    </div>
  );
};

export default AccountSelector;
