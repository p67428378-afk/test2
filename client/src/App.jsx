import React from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <div className='min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex'>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className='flex-1 flex flex-col md:pl-[260px]'>
        {/* Header */}
        <Header />

        {/* Main Content Canvas */}
        <main className='pt-[96px] px-8 pb-8 w-full min-h-screen flex flex-col'>
          <DashboardPage />
        </main>
      </div>
    </div>
  );
}
