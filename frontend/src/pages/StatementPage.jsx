
import React, { useState } from 'react';
import { generateStatement } from '../services/api';
import AccountSelector from '../components/AccountSelector';
import DateRangePicker from '../components/DateRangePicker';
import StatementPreview from '../components/StatementPreview';
import DownloadOptions from '../components/DownloadOptions';
import DownloadSuccess from '../components/DownloadSuccess';

const StatementPage = () => {
  const [step, setStep] = useState(1);
  const [statement, setStatement] = useState(null);
  const [accountNumber, setAccountNumber] = useState('1234567890');
  const [startDate, setStartDate] = useState('2023-10-01');
  const [endDate, setEndDate] = useState('2023-10-31');

  const handleFetchStatement = async () => {
    try {
      const data = await generateStatement(accountNumber, startDate, endDate, 'json');
      setStatement(data);
      setStep(2);
    } catch (error) {
      console.error('Failed to fetch statement:', error);
      // You can add error handling UI here
    }
  };

  const handleDownload = async (format) => {
    try {
      // In a real app, you would get a blob and create a URL to download the file
      // For this example, we'll just simulate the download and move to the success screen
      console.log(`Downloading statement in ${format} format...`);
      setStep(4);
    } catch (error) {
      console.error(`Failed to download statement in ${format} format:`, error);
    }
  };

  const handleDone = () => {
    setStep(1);
    setStatement(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pt-12">
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 flex flex-col gap-6">
            <AccountSelector selectedAccount={accountNumber} setAccountNumber={setAccountNumber} />
          </div>
          <div className="lg:col-span-8 flex flex-col gap-8">
            <DateRangePicker startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />
            <div className="mt-12 flex items-center justify-between">
                <div className="flex items-center gap-2 text-on-tertiary-fixed-variant">
                    <span className="material-symbols-outlined text-lg">security</span>
                    <span className="text-sm font-medium">End-to-end encrypted PDF</span>
                </div>
                <button onClick={handleFetchStatement} className="bg-gradient-to-b from-[#001a48] to-[#002d72] text-white px-8 py-4 rounded-xl font-body font-bold text-sm shadow-xl active:scale-[0.97] transition-all flex items-center gap-3">
                    Generate Statement
                    <span className="material-symbols-outlined text-sm">file_download</span>
                </button>
            </div>
          </div>
        </div>
      )}
      {step === 2 && statement && <StatementPreview statement={statement} onDownload={() => setStep(3)} />}
      {step === 3 && <DownloadOptions onDownload={handleDownload} onCancel={() => setStep(2)} />}
      {step === 4 && <DownloadSuccess onDone={handleDone} />}
    </div>
  );
};

export default StatementPage;
