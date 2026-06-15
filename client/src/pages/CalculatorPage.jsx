import React from 'react';
import CalculatorCard from '../components/calculator/CalculatorCard';
import ApiLogPanel from '../components/calculator/ApiLogPanel';

export default function CalculatorPage({ logs, onLogRequest, onClearLogs }) {
  return (
    <>
      {/* Left Pane: Calculator Engine (60%) */}
      <section className='w-full md:w-[60%] flex flex-col items-center justify-center h-full'>
        <CalculatorCard onLogRequest={onLogRequest} />
      </section>

      {/* Right Pane: Terminal Log (40%) */}
      <ApiLogPanel logs={logs} onClearLogs={onClearLogs} />
    </>
  );
}
