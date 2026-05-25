import React from 'react';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';
import RiskScore from '../components/RiskScore';
import ValueAtRisk from '../components/ValueAtRisk';
import ComplianceMonitoring from '../components/ComplianceMonitoring';
import StressTestScenarios from '../components/StressTestScenarios';
import CoreHoldings from '../components/CoreHoldings';
import OptimizationEngine from '../components/OptimizationEngine';

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900">
      <SideNavBar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavBar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white p-12 w-[calc(100%-16rem)] min-h-screen space-y-12 ml-64">
          <section className="grid grid-cols-12 gap-8">
            <RiskScore />
            <ValueAtRisk />
          </section>
          <section className="grid grid-cols-12 gap-8">
            <ComplianceMonitoring />
            <StressTestScenarios />
          </section>
          <section className="grid grid-cols-12 gap-8">
            <CoreHoldings />
            <OptimizationEngine />
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;