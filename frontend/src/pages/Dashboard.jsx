import React from 'react';
import MetricCard from '../components/MetricCard';
import PaymentStatusSummary from '../components/PaymentStatusSummary';
import RepaymentTrendsChart from '../components/RepaymentTrendsChart';
import ComplianceRadar from '../components/ComplianceRadar';
import LoanTable from '../components/LoanTable';
import KFSPanel from '../components/KFSPanel';
import DRPanel from '../components/DRPanel';

const Dashboard = () => {
  return (
    <>
      {/* Top Row: Metrics */}
      <div className='grid grid-cols-4 gap-6 mb-8'>
        <MetricCard
          title='Total Active Loans'
          value='2,842'
          change='+12.4% from last month'
          changeType='positive'
          icon='account_balance_wallet'
          iconColor='text-secondary'
        />
        <PaymentStatusSummary />
        <MetricCard
          title='Total Penalties Accrued'
          value='₹4.28M'
          change='94% collected from arrears'
          changeType='info'
          icon='warning'
          iconColor='text-tertiary-fixed-dim'
        />
        <MetricCard
          title='Compliance Health %'
          value='99.2%'
          change=''
          changeType='positive'
          icon='verified'
          iconColor='text-green-600'
          progressBarValue={99.2}
        />
      </div>

      {/* Middle Row: Visualization */}
      <div className='grid grid-cols-3 gap-6 mb-8'>
        <RepaymentTrendsChart />
        <ComplianceRadar />
      </div>

      {/* Bottom Section: Tabbed Tables */}
      <div className='grid grid-cols-3 gap-6'>
        <LoanTable />
        <div className='space-y-6'>
          <KFSPanel />
          <DRPanel />
        </div>
      </div>

      {/* Float Info Footer (Subtle) */}
      <div className='mt-8 flex justify-between items-center px-4'>
        <div className='flex items-center gap-6 text-[10px] font-mono text-slate-400 uppercase tracking-widest'>
          <div className='flex items-center gap-2'>
            <span className='material-symbols-outlined text-[14px]' style={{ fontVariationSettings: '\'FILL\' 1' }}>verified</span>
            Ledger Hex: 0x9a4f...221b
          </div>
          <div className='flex items-center gap-2'>
            <span className='material-symbols-outlined text-[14px]'>schedule</span>
            Refresh Rate: 2.4s
          </div>
        </div>
        <div className='flex gap-4'>
          <button className='text-[10px] font-bold text-slate-400 hover:text-primary transition-colors'>Privacy Policy</button>
          <button className='text-[10px] font-bold text-slate-400 hover:text-primary transition-colors'>System Logs</button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
