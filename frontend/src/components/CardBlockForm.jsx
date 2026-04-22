
import React, { useState } from 'react';
import { blockCard } from '../services/api';

const CardBlockForm = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [blockingStatus, setBlockingStatus] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [timestamp, setTimestamp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    const identifier = cardNumber ? { card_number: cardNumber } : { account_number: accountNumber };
    const request = { identifier, otp };

    try {
      const response = await blockCard(request);
      setBlockingStatus(response.status);
      setReferenceNumber(response.reference_number);
      setTimestamp(new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }));
      setMessage(`Card successfully blocked. Reference number: ${response.reference_number}`);
    } catch (error) {
      setIsError(true);
      setBlockingStatus('FAILED');
      setMessage(error.response?.data?.detail || 'An error occurred.');
    }
  };

  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-12 lg:col-span-7 space-y-8">
        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_32px_rgba(25,28,30,0.04)]">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-headline text-sm font-bold">01</span>
            <h3 className="text-xl font-headline font-bold text-primary">Identity Validation</h3>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-label text-on-surface-variant font-semibold">CARD NUMBER</label>
              <input 
                className="w-full bg-surface-container-low border-0 focus:ring-1 focus:ring-primary rounded-lg py-3 px-4 font-body text-sm" 
                placeholder="•••• •••• •••• 4492" 
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-label text-on-surface-variant font-semibold">ACCOUNT NUMBER</label>
              <input 
                className="w-full bg-surface-container-low border-0 focus:ring-1 focus:ring-primary rounded-lg py-3 px-4 font-body text-sm" 
                placeholder="8821 9902 0012" 
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_32px_rgba(25,28,30,0.04)] border-l-4 border-primary">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-headline text-sm font-bold">02</span>
            <h3 className="text-xl font-headline font-bold text-primary">Security Layer: OTP</h3>
          </div>
          <div className="flex gap-4">
            <div className="flex-grow">
              <input 
                className="w-full bg-surface-container-low border-0 focus:ring-1 focus:ring-primary rounded-lg py-3 px-4 font-display text-lg tracking-[0.5em] text-center" 
                placeholder="Enter 6-digit OTP" 
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button className="px-8 bg-surface-container-high text-on-primary-fixed-variant font-bold rounded-lg hover:bg-secondary-container transition-colors text-sm">Verify OTP</button>
          </div>
          <p className="mt-4 text-xs text-outline font-body">Sent to registered mobile +1 (***) ***-9210. Valid for 02:45</p>
        </div>

        <div className="bg-surface-container-low p-8 rounded-xl flex flex-col items-center justify-center text-center space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-headline font-bold text-primary uppercase tracking-tighter">Final Execution</h4>
            <p className="text-on-surface-variant text-sm max-w-sm">This action will immediately disable all electronic transactions for the identified account.</p>
          </div>
          <button 
            className="w-full py-4 bg-gradient-to-r from-error to-on-error-container text-white font-headline font-black text-lg rounded-xl shadow-lg hover:scale-[1.01] transition-transform"
            onClick={handleSubmit}
          >
            Block Card
          </button>
        </div>

        {blockingStatus && (
          <div className={`relative overflow-hidden bg-white p-8 rounded-xl border ${isError ? 'border-error-container' : 'border-green-500'}`}>
            <div className="absolute top-0 right-0 p-4">
              <span className={`px-4 py-1 rounded-full text-xs font-bold tracking-widest font-headline ${isError ? 'bg-error-container text-on-error-container' : 'bg-green-100 text-green-700'}`}>SYSTEM ALERT</span>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex items-baseline gap-4">
                <h2 className={`text-6xl font-headline font-black leading-none ${isError ? 'text-error' : 'text-green-500'}`}>{blockingStatus}</h2>
                <div className={`h-px flex-grow ${isError ? 'bg-error-container' : 'bg-green-500'} opacity-30`}></div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-xs font-label text-outline uppercase tracking-widest">Reference Number</p>
                  <p className="text-xl font-headline font-bold text-primary">{referenceNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-label text-outline uppercase tracking-widest">Status Timestamp</p>
                  <p className="text-xl font-headline font-bold text-primary">{timestamp}</p>
                </div>
              </div>
              {!isError && (
                <div className="bg-secondary-container/30 p-4 rounded-lg flex items-start gap-3">
                  <span className="material-symbols-outlined text-on-secondary-container">auto_fix_high</span>
                  <p className="text-sm font-body text-on-secondary-container">
                    Replacement Card Request has been automatically triggered. Logistics tracking will be sent via encrypted channel within 12 hours.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="col-span-12 lg:col-span-5 space-y-8">
        <div className="bg-surface-container-high p-8 rounded-xl space-y-6">
          <h3 className="text-sm font-headline font-bold text-primary uppercase tracking-widest">Linked Cards Ecosystem</h3>
          <div className="space-y-4">
            <div className="bg-surface-container-lowest p-5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-1"></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">Visa Infinite</p>
                  <p className="text-xs text-outline">•••• 4492</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full">ACTIVE</span>
            </div>
            <div className="bg-surface-container-lowest p-5 rounded-xl flex items-center justify-between opacity-60">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/20 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">Corporate Black</p>
                  <p className="text-xs text-outline">•••• 0012</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-error-container text-on-error-container text-[10px] font-bold rounded-full">BLOCKED</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_32px_rgba(25,28,30,0.02)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-headline font-bold text-primary uppercase tracking-widest">Recent Activity</h3>
            <button className="text-primary text-xs font-bold hover:underline">Export Logs</button>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="mt-1">
                <span className="material-symbols-outlined text-primary text-sm">lock_open</span>
              </div>
              <div className="flex-grow">
                <p className="text-sm font-bold text-primary leading-tight">Protocol Verification Initiation</p>
                <p className="text-xs text-outline">Today, 13:45 • Terminal NYC-42</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1">
                <span className="material-symbols-outlined text-primary text-sm">devices</span>
              </div>
              <div className="flex-grow">
                <p className="text-sm font-bold text-primary leading-tight">OTP Token Generated</p>
                <p className="text-xs text-outline">Today, 13:46 • SMS Gateway</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1">
                <span className="material-symbols-outlined text-primary text-sm">location_on</span>
              </div>
              <div className="flex-grow">
                <p className="text-sm font-bold text-primary leading-tight">IP Address Validated</p>
                <p className="text-xs text-outline">Today, 13:40 • 192.168.1.4</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative group cursor-pointer overflow-hidden rounded-xl h-48">
          <img alt="Secure data visualization" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNAjhtoaIQjKqvkDXsd-HYsowa55FvWKQcxUgYfxpm09rzTo9zxPKXSOwXLVZm-zQfpvQdEBOLTYdizToGGBTqtm8-4b7xsXsc2hj6g_nL2nMhXA6j2-UGgDYCzsMpXw7YaKaK64HaB5EGJRmZ5XuFIVa67PsvWQRka4EgwiVlbNUfPXT5uQLYkPWbVnjwT95guVumycJ22d6uq5L6JdMG5dk889U78RSMOT4kJr-yV-lHzszVLxQO6d8B8eIidAmtiZmNxjVDXVs"/>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6">
            <p className="text-[10px] font-black text-on-primary-container tracking-widest uppercase mb-1">Security Pulse</p>
            <p className="text-white font-headline font-bold text-lg">System Integrity 99.9%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardBlockForm;
