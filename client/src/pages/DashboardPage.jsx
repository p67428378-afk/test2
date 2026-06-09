import React from 'react';
import Header from '../components/layout/Header';
import KPICardGrid from '../components/dashboard/KPICardGrid';
import SKUPerformanceTable from '../components/dashboard/SKUPerformanceTable';

const DashboardPage = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Header />
      <main>
        <KPICardGrid />
        <div className="mt-8">
          <SKUPerformanceTable />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
