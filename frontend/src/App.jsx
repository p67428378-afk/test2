import React, { useState } from 'react';
import TopNavBar from './components/TopNavBar';
import SideNavBar from './components/SideNavBar';
import AadhaarInput from './components/AadhaarInput';
import PanInput from './components/PanInput';
import StatusIndicator from './components/StatusIndicator';
import AuditTrail from './components/AuditTrail';
import { kycRequest } from './services/api';

function App() {
  const [aadhaarNumber, setAadhaarNumber] = useState('5421 8890 2231');
  const [panNumber, setPanNumber] = useState('');
  const [kycStatus, setKycStatus] = useState(null);
  const [auditTrail, setAuditTrail] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const response = await kycRequest({ 
      full_name: 'John Doe', // This should be captured from a form
      aadhaar_number: aadhaarNumber.replace(/ /g, ''),
      pan_number: panNumber
    });
    setKycStatus(response.status);
    // The audit trail should be fetched from a separate endpoint in a real app
    setAuditTrail([
      { timestamp: new Date().toISOString(), activity: `KYC process finished with status: ${response.status}` },
      { timestamp: new Date().toISOString(), activity: 'PAN validation submitted' },
      { timestamp: new Date().toISOString(), activity: 'Aadhaar validation submitted' },
      { timestamp: new Date().toISOString(), activity: 'KYC process started' },
    ]);
    setLoading(false);
  };

  return (
    <div className='bg-surface font-body text-on-surface'>
      <TopNavBar />
      <SideNavBar />
      <main className='ml-72 pt-24 px-12 pb-12 min-h-screen'>
        <header className='mb-12'>
          <h1 className='font-headline text-4xl font-extrabold text-on-surface tracking-tight mb-2'>Verification Pipeline</h1>
          <p className='text-on-surface-variant font-body max-w-2xl'>Complete the institutional onboarding process by providing the required cryptographic credentials and identification documents for architectural compliance.</p>
        </header>
        <div className='grid grid-cols-12 gap-8'>
          <div className='col-span-8 grid grid-cols-2 gap-8'>
            <AadhaarInput value={aadhaarNumber} onChange={setAadhaarNumber} />
            <PanInput value={panNumber} onChange={setPanNumber} />
            <AuditTrail auditTrail={auditTrail} />
          </div>
          <div className='col-span-4 space-y-8'>
            <StatusIndicator status={kycStatus} />
            <div className="relative h-[415px] rounded-xl overflow-hidden shadow-2xl group">
              <img alt="Abstract visual" className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPHCd4nTfgCgrslVjwyArnQi7r-O6Ju-sqdlzN5eRVPQp-oJFpnZrMpw9xqzjI-LngXzoFzBOXzxpOD8UMLo4M0kQkm8iACvZ_wEuD5PNN_yDYAjJZJjtyWPFysSCdXhmhNNz-2l0SaZJf0mwfoHRlafg45Ak3cTyfv6NX0vV3Q-p5Nj0GaIrKoG36f5pM_73nM0gza-WdvcbOmKX4yrBjuIcmVJ6KxoLLQKLUX2rkDxuZPOSrgxuD7hmt7SpLcVkxaHFsqbnb5vM"/>
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-transparent to-transparent opacity-90"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="glass-panel p-6 rounded-xl border border-white/20">
                  <h4 className="font-headline font-bold text-lg text-blue-950 mb-2">Architectural Security</h4>
                  <p className="text-xs text-blue-900/80 leading-relaxed">The Architectural Sentinel employs multi-layer AES-256 encryption for all PII data. Documents are shredded in memory immediately after OCR processing is confirmed by the blockchain ledger.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="fixed bottom-8 right-8">
          <button 
            onClick={handleSubmit} 
            disabled={loading} 
            className='bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 px-8 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 disabled:opacity-50'>
            {loading ? 'Processing...' : 'Submit KYC'}
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
