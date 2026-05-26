import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function App() {
  return (
    <div className='bg-background text-on-background antialiased flex min-h-screen'>
      <Sidebar />
      <main className='ml-[240px] w-[calc(100%-240px)] flex flex-col'>
        <Header />
        <div className='mt-16 p-xl space-y-xl overflow-y-auto max-w-[1440px] mx-auto w-full'>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default App;
