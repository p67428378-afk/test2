
import React from 'react';
import TopNavBar from '../components/TopNavBar';
import SideNavBar from '../components/SideNavBar';

const ReportingPage = () => {
  return (
    <div className='flex pt-16'>
      <TopNavBar />
      <SideNavBar />
      <main className='flex-1 md:ml-64 p-lg md:p-xl max-w-7xl mx-auto'>
        <header className='mb-xl'>
          <h1 className='font-headline-lg text-headline-lg text-primary mb-xs'>Reporting</h1>
          <p className='font-body-md text-body-md text-on-surface-variant'>View historical water usage data.</p>
        </header>
        {/* Reporting components will go here */}
      </main>
    </div>
  );
};

export default ReportingPage;
