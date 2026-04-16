import React from 'react';
import TopNavBar from './components/TopNavBar';
import SideNavBar from './components/SideNavBar';
import PolicyOverview from './pages/PolicyOverview';

function App() {
  return (
    <div className='bg-background text-on-surface'>
      <TopNavBar />
      <div className='flex min-h-screen'>
        <SideNavBar />
        <main className='ml-64 flex-1 p-10 max-w-[1400px]'>
          <PolicyOverview />
        </main>
      </div>
    </div>
  );
}

export default App;
