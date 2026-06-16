import React from 'react';

export default function Header() {
  return (
    <header className='hidden md:flex h-[64px] fixed top-0 right-0 left-[260px] bg-surface justify-between items-center px-8 border-b border-outline-variant z-40 bg-[#f8f9ff] border-[#d1c6ab]'>
      <div className='flex items-center gap-4'>
        <h2 className='text-headline-md font-headline-md font-semibold text-on-surface truncate max-w-2xl text-lg font-bold text-[#0b1c30]'>
          DG Snacks Assortment Advisor — Small Town Value Cluster
        </h2>
      </div>
      <div className='flex items-center gap-6'>
        <button className='relative p-2 text-on-surface-variant hover:bg-surface-container transition-colors duration-200 rounded-full cursor-pointer active:opacity-80 text-[#4d4632] hover:bg-[#e5eeff]'>
          <span className='material-symbols-outlined' data-icon='notifications'>notifications</span>
          <span className='absolute top-1 right-1 w-4 h-4 bg-error text-on-error rounded-full text-[10px] flex items-center justify-center font-bold bg-[#ba1a1a] text-white'>2</span>
        </button>
        <div className='w-9 h-9 rounded-full bg-surface-variant border border-outline-variant overflow-hidden cursor-pointer active:opacity-80 hover:bg-surface-container transition-colors duration-200 bg-[#d3e4fe] border-[#d1c6ab]'>
          <img alt='User Profile Avatar' className='w-full h-full object-cover' src='https://lh3.googleusercontent.com/aida-public/AB6AXuD7w5sbYCvUN7eMS2iGfshoIIkpFn6iEq2O7WKHKYBs9LKSYlYQ-3AfFXUOUhaei7juY3AjSiuQ9tGX89vjcDCIbqSiAKqaf-Sd3aSiLalvL_MpOTDDAPDFcCShGTcgB4AsD2S-pmOHdb9-dSJQJk35sp8iMCS5Tn8GjXoKR_azukv76tsTeq0PllV1pqkF8wLrnhXlEqp-apokw3F7_d-yfMoEqmk_Sodnk8yqUQuMATtkFKPBHX5pvGlyLyUshpmiQstYQ8PZ45c' />
        </div>
      </div>
    </header>
  );
}
