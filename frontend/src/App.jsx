
import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Portfolio from './components/Portfolio';

function App() {
  return (
    <div className='bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container'>
      <Sidebar />
      <Header />
      <main className='ml-64 pt-32 px-12 pb-12 min-h-screen'>
        <Portfolio />
      </main>
    </div>
  );
}

export default App;
