import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ApplicationForm from './pages/ApplicationForm';

function App() {
  return (
    <div className='bg-surface text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed'>
      <Sidebar />
      <Header />
      <main className='ml-64 pt-20 min-h-screen bg-surface'>
        <div className='max-w-[1600px] mx-auto p-12 space-y-16'>
          <ApplicationForm />
        </div>
      </main>
    </div>
  );
}

export default App;
