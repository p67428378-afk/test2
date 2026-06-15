import React from 'react';
import CalculatorCard from '../components/calculator/CalculatorCard';

const CalculatorPage = () => {
  return (
    <main className='flex-grow flex items-center justify-center p-container-padding relative overflow-hidden'>
      {/* Ambient Glow */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-container rounded-full blur-[120px] opacity-10 pointer-events-none'></div>
      <CalculatorCard />
    </main>
  );
};

export default CalculatorPage;
