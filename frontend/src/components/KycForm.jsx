
import React, { useState } from 'react';

const KycForm = () => {
  const [aadhaar, setAadhaar] = useState('');
  const [pan, setPan] = useState('');
  const [validationStatus, setValidationStatus] = useState({
    aadhaarState: 'PENDING',
    panIntegrity: 'PENDING',
  });
  const [auditTrail, setAuditTrail] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newAudit = [
      {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: 'Submission Received',
        description: 'Initial payload received via microservice endpoint. Initiating document parsing.',
        status: 'completed'
      },
      ...auditTrail
    ];
    setAuditTrail(newAudit);

    // Mock Aadhaar validation
    await new Promise(resolve => setTimeout(resolve, 1000));
    const isAadhaarValid = Math.random() > 0.2; // 80% chance of success
    setValidationStatus(prev => ({ ...prev, aadhaarState: isAadhaarValid ? 'APPROVED' : 'FLAGGED' }));
    const aadhaarAudit = {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: 'Aadhaar Verified',
      description: isAadhaarValid ? 'UIDAI biometric response 200 OK. Identity linkage confirmed.' : 'Aadhaar validation failed.',
      status: 'completed'
    };
    setAuditTrail(prev => [aadhaarAudit, ...prev]);


    // Mock PAN validation
    await new Promise(resolve => setTimeout(resolve, 1000));
    const isPanValid = Math.random() > 0.5; // 50% chance of success
    setValidationStatus(prev => ({ ...prev, panIntegrity: isPanValid ? 'APPROVED' : 'FLAGGED' }));
    const panAudit = {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: 'PAN Check Completed',
      description: isPanValid ? 'PAN details match database records.' : 'System automated validation failed on PAN string checksum match.',
      status: 'completed'
    };
    setAuditTrail(prev => [panAudit, ...prev]);


    setLoading(false);
  };


  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'teal-500';
      case 'FLAGGED':
        return 'amber-500';
      default:
        return 'gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'check_circle';
      case 'FLAGGED':
        return 'warning';
      default:
        return 'hourglass_empty';
    }
  };


  return (
    <div className='bg-surface text-on-surface min-h-screen flex flex-col items-center'>
      <nav className='fixed top-0 w-full z-50 bg-slate-50/70 backdrop-blur-xl shadow-sm max-w-md mx-auto h-16 flex items-center justify-between px-6'>
        <div className='flex items-center gap-4'>
          <button className='p-2 -ml-2 hover:bg-slate-200/50 transition-colors active:scale-95 duration-150 rounded-full'>
            <span className='material-symbols-outlined text-blue-700'>arrow_back</span>
          </button>
          <h1 className='text-blue-700 font-manrope font-bold text-lg tracking-tight'>Identity Verification</h1>
        </div>
        <button className='p-2 -mr-2 hover:bg-slate-200/50 transition-colors active:scale-95 duration-150 rounded-full'>
          <span className='material-symbols-outlined text-blue-700'>help_outline</span>
        </button>
      </nav>
      <main className='w-full max-w-md px-6 pt-24 pb-32 flex flex-col gap-8'>
        <section className='bg-surface-container-low p-6 rounded-3xl flex flex-col gap-6'>
          <div className='flex flex-col gap-1'>
            <h2 className='text-headline-sm font-bold text-on-surface'>Document Details</h2>
            <p className='text-body-sm text-on-surface-variant opacity-70'>Enter your government identification details</p>
          </div>
          <form className='space-y-4' onSubmit={handleSubmit}>
            <div className='group'>
              <label className='block text-[11px] font-bold tracking-widest text-primary uppercase mb-2 ml-1'>Aadhaar Number</label>
              <div className='bg-surface-container-lowest border-b-2 border-outline-variant focus-within:border-primary transition-all duration-300'>
                <input
                  className='w-full bg-transparent border-none focus:ring-0 px-4 py-3 text-on-surface font-mono tracking-[0.2em] placeholder:text-outline-variant'
                  placeholder='XXXX XXXX XXXX'
                  type='text'
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value)}
                />
              </div>
            </div>
            <div className='group'>
              <label className='block text-[11px] font-bold tracking-widest text-primary uppercase mb-2 ml-1'>PAN Card Number</label>
              <div className='bg-surface-container-lowest border-b-2 border-outline-variant focus-within:border-primary transition-all duration-300'>
                <input
                  className='w-full bg-transparent border-none focus:ring-0 px-4 py-3 text-on-surface font-mono tracking-widest placeholder:text-outline-variant'
                  placeholder='ABCDE1234F'
                  type='text'
                  value={pan}
                  onChange={(e) => setPan(e.target.value)}
                />
              </div>
            </div>
            <button
              className='w-full bg-gradient-to-br from-primary to-primary-container text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50'
              type='submit'
              disabled={loading || !aadhaar || !pan}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span className='material-symbols-outlined'>shield</span>
                  <span>Initiate Validation</span>
                </>
              )}
            </button>
          </form>
        </section>
        <section className='grid grid-cols-2 gap-4'>
          <div className='col-span-2'>
            <h2 className='text-headline-sm font-bold text-on-surface mb-4'>Verification Status</h2>
          </div>
          <div className={`bg-surface-container-lowest p-5 rounded-3xl flex flex-col justify-between h-32 border border-outline-variant/10`}>
            <div className='flex justify-between items-start'>
              <span className={`material-symbols-outlined text-primary text-xl`}>account_balance_wallet</span>
              <span className={`bg-${getStatusColor(validationStatus.aadhaarState).replace('-500', '-100')} text-${getStatusColor(validationStatus.aadhaarState)} text-[10px] font-bold px-2 py-0.5 rounded-full`}>{validationStatus.aadhaarState}</span>
            </div>
            <div className='mt-auto'>
              <p className='text-[11px] text-on-surface-variant font-medium'>Aadhaar</p>
              <p className='text-on-surface font-bold'>{validationStatus.aadhaarState === 'APPROVED' ? 'Identity Confirmed' : 'Manual Review'}</p>
            </div>
          </div>
          <div className={`bg-surface-container-lowest p-5 rounded-3xl flex flex-col justify-between h-32 border border-outline-variant/10`}>
            <div className='flex justify-between items-start'>
              <span className={`material-symbols-outlined text-tertiary text-xl`}>credit_card</span>
              <span className={`bg-${getStatusColor(validationStatus.panIntegrity).replace('-500', '-100')} text-${getStatusColor(validationStatus.panIntegrity)} text-[10px] font-bold px-2 py-0.5 rounded-full`}>{validationStatus.panIntegrity}</span>
            </div>
            <div className='mt-auto'>
              <p className='text-[11px] text-on-surface-variant font-medium'>PAN Card</p>
              <p className='text-on-surface font-bold'>{validationStatus.panIntegrity === 'APPROVED' ? 'Integrity Confirmed' : 'Manual Review'}</p>
            </div>
          </div>
          <div className='col-span-2 bg-gradient-to-r from-surface-container-low to-surface-container-lowest p-6 rounded-3xl flex items-center justify-between border border-outline-variant/10'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm'>
                <span className='material-symbols-outlined text-primary'>verified_user</span>
              </div>
              <div>
                <p className='text-sm font-bold text-on-surface'>RBI Sanctions Check</p>
                <p className='text-xs text-on-surface-variant'>Global Watchlist Registry</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 rounded-full bg-[#1e7e34]'></div>
              <span className='text-[#1e7e34] font-black text-sm tracking-widest'>CLEAR</span>
            </div>
          </div>
        </section>
        <section className='flex flex-col gap-6'>
          <h2 className='text-headline-sm font-bold text-on-surface'>Audit Trail</h2>
          <div className='relative pl-8 space-y-8'>
            <div className='absolute left-3 top-2 bottom-2 w-0.5 bg-outline-variant/20'></div>
            {auditTrail.map((item, index) => (
              <div key={index} className='relative'>
                <div className={`absolute -left-[25px] top-1 w-3 h-3 rounded-full ${item.status === 'completed' ? 'bg-primary' : 'bg-outline-variant'} border-4 border-surface ring-2 ring-primary/10`}></div>
                <div>
                  <p className='text-sm font-bold text-on-surface'>{item.title}</p>
                  <p className='text-xs text-on-surface-variant mt-1'>{item.description}</p>
                  <p className='text-[10px] text-primary/60 font-medium mt-2'>{item.time}</p>
                </div>
              </div>
            ))}
            <div className='relative'>
              <div className='absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-outline-variant/40 border-4 border-surface'></div>
              <div>
                <p className='text-sm font-bold text-on-surface'>Identity Finalized (Pending)</p>
                <p className='text-xs text-on-surface-variant mt-1'>Final decision awaiting manual PAN reconciliation.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <nav className='fixed bottom-0 left-0 w-full bg-white max-w-md mx-auto z-50 rounded-t-3xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)] border-t border-slate-100 flex justify-around items-center px-4 pt-3 pb-6'>
        <a className='flex flex-col items-center justify-center bg-blue-50 text-blue-800 rounded-2xl px-3 py-1.5 transition-all duration-200 active:scale-90 ease-out' href='#'>
          <span className='material-symbols-outlined mb-1'>verified_user</span>
          <span className='font-inter text-[11px] font-medium tracking-wide'>Verification</span>
        </a>
        <a className='flex flex-col items-center justify-center text-slate-400 px-3 py-1.5 hover:text-blue-600 transition-all active:scale-90 duration-200 ease-out' href='#'>
          <span className='material-symbols-outlined mb-1'>description</span>
          <span className='font-inter text-[11px] font-medium tracking-wide'>Documents</span>
        </a>
        <a className='flex flex-col items-center justify-center text-slate-400 px-3 py-1.5 hover:text-blue-600 transition-all active:scale-90 duration-200 ease-out' href='#'>
          <span className='material-symbols-outlined mb-1'>timeline</span>
          <span className='font-inter text-[11px] font-medium tracking-wide'>History</span>
        </a>
        <a className='flex flex-col items-center justify-center text-slate-400 px-3 py-1.5 hover:text-blue-600 transition-all active:scale-90 duration-200 ease-out' href='#'>
          <span className='material-symbols-outlined mb-1'>contact_support</span>
          <span className='font-inter text-[11px] font-medium tracking-wide'>Support</span>
        </a>
      </nav>
    </div>
  );
};

export default KycForm;
