import React, { useState } from 'react';
import Dropdown from '../components/common/Dropdown';
import Button from '../components/common/Button';

const reportOptions = [
    { value: 'bestsellers', label: 'Best-Selling Items' },
    { value: 'slowmovers', label: 'Slow-Moving Items' },
    { value: 'profitability', label: 'Profitability Report' },
];

const ReportsPage = () => {
    const [selectedReport, setSelectedReport] = useState('');
    const [reportData, setReportData] = useState(null);

    const handleGenerateReport = () => {
        if (!selectedReport) return;
        // Placeholder for fetching report data
        setReportData(`Report data for ${selectedReport}`);
        console.log('Generating report:', selectedReport);
    };

  return (
    <div>
        <h2 className='text-2xl font-semibold mb-6'>Reports</h2>
        <div className='flex items-center space-x-4 mb-6'>
            <Dropdown 
                options={reportOptions} 
                onSelect={setSelectedReport} 
                selectedOption={selectedReport} 
                placeholder="Select a report"
            />
            <Button onClick={handleGenerateReport}>Generate Report</Button>
        </div>

        {reportData && (
            <div className='bg-white p-6 rounded-lg shadow-md'>
                <h3 className='text-lg font-semibold mb-4'>Report Results</h3>
                <pre>{JSON.stringify(reportData, null, 2)}</pre>
            </div>
        )}
    </div>
  );
};

export default ReportsPage;
