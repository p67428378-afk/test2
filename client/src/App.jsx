import React, { useState } from 'react';
import AppLayout from './components/layout/AppLayout';
import CalculatorCard from './components/calculator/CalculatorCard';
import HistorySidebar from './components/calculator/HistorySidebar';

export default function App() {
  const [history, setHistory] = useState([
    { operand1: 45, operand2: 55, operator: '+', result: 100, time: '2 mins ago' },
    { operand1: 1000, operand2: 5, operator: '/', result: 200, time: '5 mins ago' }
  ]);

  const handleCalculationSuccess = (newCalc) => {
    setHistory([newCalc, ...history]);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleLoadHistoryItem = (item) => {
    // Optional: load history item back into calculator
    // For now, we can just log it or let the user see it
  };

  return (
    <AppLayout>
      <CalculatorCard onCalculationSuccess={handleCalculationSuccess} />
      <HistorySidebar
        history={history}
        onClearHistory={handleClearHistory}
        onLoadHistoryItem={handleLoadHistoryItem}
      />
    </AppLayout>
  );
}