import React from 'react';

export default function Sidebar() {
  return (
    <nav className='bg-surface dark:bg-surface-dim font-body-md text-body-md fixed left-0 top-0 bottom-0 flex flex-col justify-between py-lg w-[260px] border-r border-outline-variant dark:border-surface-container-highest z-50'>
      <div>
        <div className='px-lg pb-xl'>
          <div className='flex items-center gap-sm'>
            <div className='w-10 h-10 bg-primary-container rounded flex items-center justify-center text-on-primary-container font-bold text-xl'>
              DG
            </div>
            <div>
              <h1 className='font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed leading-tight'>
                DG Assortment<br />Advisor
              </h1>
              <p className='text-xs text-on-surface-variant uppercase tracking-wider mt-1'>
                Logistics Management
              </p>
            </div>
          </div>
        </div>
        <ul className='flex flex-col gap-sm'>
          <li>
            <a
              className='flex items-center gap-md px-lg py-sm border-l-4 border-primary bg-primary/10 text-primary font-bold hover:bg-surface-container-highest dark:hover:bg-surface-container transition-colors duration-200'
              href='#dashboard'
            >
              <span className='material-symbols-outlined'>dashboard</span>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a
              className='flex items-center gap-md px-lg py-sm border-l-4 border-transparent text-on-surface-variant dark:text-on-surface hover:text-primary hover:bg-surface-container-highest dark:hover:bg-surface-container transition-colors duration-200'
              href='#sku-performance'
            >
              <span className='material-symbols-outlined'>analytics</span>
              <span>SKU Performance</span>
            </a>
          </li>
          <li>
            <a
              className='flex items-center gap-md px-lg py-sm border-l-4 border-transparent text-on-surface-variant dark:text-on-surface hover:text-primary hover:bg-surface-container-highest dark:hover:bg-surface-container transition-colors duration-200'
              href='#scenario-modeling'
            >
              <span className='material-symbols-outlined'>model_training</span>
              <span>Scenario Modeling</span>
            </a>
          </li>
          <li>
            <a
              className='flex items-center gap-md px-lg py-sm border-l-4 border-transparent text-on-surface-variant dark:text-on-surface hover:text-primary hover:bg-surface-container-highest dark:hover:bg-surface-container transition-colors duration-200'
              href='#approvals'
            >
              <span className='material-symbols-outlined'>fact_check</span>
              <span>Approvals</span>
            </a>
          </li>
          <li>
            <a
              className='flex items-center gap-md px-lg py-sm border-l-4 border-transparent text-on-surface-variant dark:text-on-surface hover:text-primary hover:bg-surface-container-highest dark:hover:bg-surface-container transition-colors duration-200'
              href='#settings'
            >
              <span className='material-symbols-outlined'>settings</span>
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </div>
      <div className='px-lg'>
        <div className='flex items-center gap-md py-sm text-on-surface-variant dark:text-on-surface border-t border-surface-container-highest pt-md'>
          <span className='material-symbols-outlined text-2xl'>account_circle</span>
          <div className='flex flex-col'>
            <span className='font-bold text-sm'>Marcus Vance</span>
            <span className='text-xs opacity-70'>Category Manager</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
