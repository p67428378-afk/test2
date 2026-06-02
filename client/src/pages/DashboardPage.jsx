
import React from 'react';
import TopNavBar from '../components/TopNavBar';
import SideNavBar from '../components/SideNavBar';
import KeyMetricsCards from '../components/KeyMetricsCards';
import RecentAlertsList from '../components/RecentAlertsList';
import UsageCharts from '../components/UsageCharts';
import SummaryTable from '../components/SummaryTable';

const DashboardPage = () => {
  return (
    <div className='flex pt-16'>
      <TopNavBar />
      <SideNavBar />
      <main className='flex-1 md:ml-64 p-lg md:p-xl max-w-7xl mx-auto'>
        <header className='mb-xl'>
          <h1 className='font-headline-lg text-headline-lg text-primary mb-xs'>System Overview</h1>
          <p className='font-body-md text-body-md text-on-surface-variant'>Real-time water network performance and infrastructure health.</p>
        </header>
        <KeyMetricsCards />
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-gutter'>
          <UsageCharts />
          <RecentAlertsList />
        </div>
        <SummaryTable />
      </main>
    </div>
  );
};

export default DashboardPage;
