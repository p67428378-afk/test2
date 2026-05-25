import React from 'react';
import SideNav from '../components/SideNav';
import PolicyDetails from '../components/PolicyDetails';
import PolicyActions from '../components/PolicyActions';
import Notifications from '../components/Notifications';
import CoverageQuickView from '../components/CoverageQuickView';

const Dashboard = () => {
  return (
    <div className='flex h-screen overflow-hidden'>
      <SideNav />
      <main className='flex-1 overflow-y-auto p-10 bg-surface'>
        <div className='max-w-[1600px] mx-auto'>
          <header className='mb-10 flex justify-between items-end'>
            <div>
              <h1 className='text-4xl font-extrabold text-primary tracking-tight mb-2'>Policy Overview</h1>
              <p className='text-on-surface-variant max-w-lg'>Manage your coverage, track active claims, and update your benefits in a single, clinical workspace.</p>
            </div>
            <div className='flex gap-4'>
              <div className='bg-surface-container px-6 py-4 rounded-xl flex flex-col'>
                <span className='text-xs font-bold text-slate-500 uppercase tracking-widest'>Next Billing Date</span>
                <span className='text-lg font-semibold text-primary'>Oct 15, 2023</span>
              </div>
            </div>
          </header>
          <div className='grid grid-cols-12 gap-6 mb-10'>
            <PolicyDetails />
            <PolicyActions />
          </div>
          <div className='grid grid-cols-12 gap-6'>
            <Notifications />
            <CoverageQuickView />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
