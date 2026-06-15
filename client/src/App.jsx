import React, { useState } from 'react';
import AppLayout from './components/layout/AppLayout';
import CalculatorPage from './pages/CalculatorPage';
import ApiReferencePage from './pages/ApiReferencePage';

export default function App() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [logs, setLogs] = useState([]);

  const handleLogRequest = (log) => {
    setLogs((prevLogs) => [log, ...prevLogs]);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'calculator' ? (
        <CalculatorPage
          logs={logs}
          onLogRequest={handleLogRequest}
          onClearLogs={handleClearLogs}
        />
      ) : (
        <ApiReferencePage />
      )}
    </AppLayout>
  );
}
