
import React from 'react';
import Header from './components/Header';
import SideNav from './components/SideNav';
import MainContent from './components/MainContent';

function App() {
  return (
    <div className='bg-surface font-body text-on-surface'>
      <Header />
      <div className='flex min-h-[calc(100vh-72px)]'>
        <SideNav />
        <MainContent />
      </div>
    </div>
  );
}

export default App;
