import React from 'react';
import Header from './Header';

export default function AppLayout({ children }) {
  return (
    <div className='bg-background text-on-background min-h-screen flex flex-col font-sans'>
      <Header />
      <main className='flex-grow flex flex-col md:flex-row p-margin-page gap-margin-page max-w-7xl mx-auto w-full'>
        {children}
      </main>
    </div>
  );
}