import React, { useState } from 'react';
import { generateStatement } from '../services/api';
import DateRangePicker from '../components/DateRangePicker';
import StatementPreview from '../components/StatementPreview';
import DownloadOptions from '../components/DownloadOptions';
import DownloadSuccess from '../components/DownloadSuccess';

const StatementPage = () => {
  const [step, setStep] = useState(1);
  const [statement, setStatement] = useState(null);
  const [accountNumber, setAccountNumber] = useState('1234567890');
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2023-01-31');

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
      const data = await generateStatement(accountNumber, startDate, endDate, format);
      // The backend should respond with a file download
      // For now, we'll just move to the success screen
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
    <div className="max-w-4xl mx-auto p-4">
      {step === 1 && <AccountSelectionAndDate accountNumber={accountNumber} setAccountNumber={setAccountNumber} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} onFetchStatement={handleFetchStatement} />}
      {step === 2 && statement && <StatementPreview statement={statement} onDownload={() => setStep(3)} />}
      {step === 3 && <DownloadOptions onDownload={handleDownload} onCancel={() => setStep(2)} />}
      {step === 4 && <DownloadSuccess onDone={handleDone} />}
    </div>
  );
};

const AccountSelectionAndDate = ({ accountNumber, setAccountNumber, startDate, setStartDate, endDate, setEndDate, onFetchStatement }) => {
    return (
        <div className="bg-surface text-on-surface min-h-screen pb-24">
            <header className="flex justify-between items-center w-full px-6 h-16 sticky top-0 z-50 bg-[#f7f9fb]/90 backdrop-blur-md no-border shadow-[0_1px_0_0_rgba(196,206,210,0.1)]">
                <div className="flex items-center gap-4">
                    <button className="transition-all duration-300 ease-in-out active:scale-95 text-[#002D72]">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="font-['Manrope'] font-bold text-lg tracking-tight text-[#002D72]">Statements</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button className="transition-all duration-300 ease-in-out active:scale-95 text-[#002D72]">
                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>lock</span>
                    </button>
                </div>
            </header>
            <main className="max-w-xl mx-auto px-6 py-8">
                <section className="mb-10">
                    <h2 className="text-3xl font-extrabold tracking-tight text-primary mb-2">Download Statements</h2>
                    <p className="text-on-surface-variant font-medium">Select an account and date range to generate your statement.</p>
                </section>
                <div className="space-y-6">
                    <div className="bg-surface-container-low rounded-xl p-6 transition-all">
                        <label className="block font-label text-sm font-semibold uppercase tracking-widest text-on-surface-variant mb-4">Account Number</label>
                        <input
                            type="text"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            className="w-full bg-surface-container-highest rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary transition-all"
                        />
                    </div>
                    <DateRangePicker startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />
                    <button onClick={onFetchStatement} className="w-full py-5 px-6 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-bold text-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>description</span>
                        Fetch Statement
                    </button>
                </div>
            </main>
        </div>
    );
};

export default StatementPage;
