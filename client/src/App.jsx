import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header.jsx';
import CalculatorCard from './components/calculator/CalculatorCard.jsx';
import HistoryCard from './components/history/HistoryCard.jsx';
import { getCalculations, clearCalculations } from './services/api.js';

export default function App() {
  const [calculations, setCalculations] = useState([]);

  const fetchHistory = async () => {
    try {
      const data = await getCalculations();
      if (Array.isArray(data)) {
        setCalculations(data);
      }
    } catch (error) {
      console.error('Failed to fetch calculation history:', error);
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearCalculations();
      setCalculations([]);
    } catch (error) {
      console.error('Failed to clear calculation history:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className='bg-background text-on-background min-h-screen flex flex-col font-body-sm text-body-sm'>
      <Header />
      <main className='flex-grow flex items-center justify-center p-4 md:p-8 overflow-y-auto'>
        <div className='flex flex-col xl:flex-row gap-8 w-full max-w-[900px] justify-center items-start'>
          <CalculatorCard onCalculationSuccess={fetchHistory} />
          <HistoryCard calculations={calculations} onClear={handleClearHistory} />
        </div>
      </main>
      <footer className='bg-surface-container-lowest full-width bottom-0 flex flex-col md:flex-row justify-between items-center py-8 px-padding-container w-full border-t border-outline-variant z-50'>
        <div className='font-label-md text-label-md font-semibold text-on-surface-variant mb-4 md:mb-0'>
          © 2024 Simple Calculator. All rights reserved.
        </div>
        <div className='flex gap-6'>
          <a className='text-on-surface-variant hover:text-primary transition-all text-sm font-body-sm' href='#'>Privacy Policy</a>
          <a className='text-on-surface-variant hover:text-primary transition-all text-sm font-body-sm' href='#'>Terms of Service</a>
          <a className='text-on-surface-variant hover:text-primary transition-all text-sm font-body-sm' href='#'>Help Center</a>
        </div>
      </footer>
    </div>
  );
}