import React from 'react';
import SideNavBar from './components/SideNavBar';
import TopNavBar from './components/TopNavBar';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className='flex'>
      <SideNavBar />
      <div className='flex-1 flex flex-col'>
        <TopNavBar />
        <main className='ml-64 mt-16 p-8 min-h-screen bg-background'>
          <Dashboard />
        </main>
      </div>
    </div>
  );
}

export default App;
