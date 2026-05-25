
import React from 'react';
import TopNavBar from './components/TopNavBar';
import SideNavBar from './components/SideNavBar';
import MainContent from './components/MainContent';

function App() {
  return (
    <div className='bg-surface font-body text-on-surface'>
      <TopNavBar />
      <SideNavBar />
      <MainContent />
    </div>
  );
}

export default App;
