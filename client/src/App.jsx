import React from 'react';
import TopNavBar from './components/layout/TopNavBar.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

export default function App() {
  return (
    <div className='min-h-screen flex flex-col bg-[#0F172A] text-[#dae2fd] antialiased'>
      <TopNavBar />
      <DashboardPage />
    </div>
  );
}