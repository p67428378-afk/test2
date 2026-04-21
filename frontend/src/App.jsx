import React, { useState } from 'react';

function App() {
  const [customerId, setCustomerId] = useState('VAULT-8829-001');
  const [newMobileNumber, setNewMobileNumber] = useState('');
  const [oldOtp, setOldOtp] = useState(Array(6).fill(''));
  const [newOtp, setNewOtp] = useState(Array(6).fill(''));
  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleOldOtpChange = (e, index) => {
    const newOtp = [...oldOtp];
    newOtp[index] = e.target.value;
    setOldOtp(newOtp);
  };

  const handleNewOtpChange = (e, index) => {
    const newOtp = [...newOtp];
    newOtp[index] = e.target.value;
    setNewOtp(newOtp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col overflow-hidden">
      <header className="bg-[#f9f9fd] dark:bg-[#001e40] docked full-width top-0 z-50 h-20 flex justify-between items-center px-8 w-full border-b border-[#c3c6d1]/15">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold tracking-tighter text-[#001e40] dark:text-[#ffffff]">VAULT RETAIL</span>
          <nav className="hidden md:flex gap-6 items-center">
            <a className="text-[#43474f] dark:text-[#c3c6d1] hover:bg-[#e7e8eb] dark:hover:bg-[#003366] transition-colors px-3 py-1 rounded" href="#">Markets</a>
            <a className="text-[#43474f] dark:text-[#c3c6d1] hover:bg-[#e7e8eb] dark:hover:bg-[#003366] transition-colors px-3 py-1 rounded" href="#">Wealth</a>
            <a className="text-[#001e40] dark:text-[#ffffff] font-bold border-b-2 border-[#001e40] px-3 py-1" href="#">Services</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-[#e7e8eb] dark:bg-[#003366] flex items-center px-4 py-2 rounded-lg w-64">
            <span className="material-symbols-outlined text-outline text-sm mr-2">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none" placeholder="Search accounts..." type="text"/>
          </div>
          <button className="material-symbols-outlined p-2 rounded-full hover:bg-[#e7e8eb] transition-colors">notifications</button>
          <button className="material-symbols-outlined p-2 rounded-full hover:bg-[#e7e8eb] transition-colors">help_outline</button>
          <div className="h-10 w-10 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant/20">
            <img alt="User profile photo" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUgegzQfMUhSywZmPX31szJk_wlaRGdJeWkvyIh0056DLyWHMUmqepBxIKnehTnNIC8v3_iBFEHYrqg6meXWlZy-NnfpExCvhvStkqYgptjqxlgJv9uSGYuBgUQliCJqQ5pidICkspJG3U0X0A3_b7CNGH-qKZsNV121Sg0WktPs08NrmT33bC9SkMg1IZlPXCNd74qsI08O2EjcsKO54U7OhlDdM_FP_XSY0EwL6UN3M31wgGIoeBGfPCmemp_5MUm0Xv4vtzdXA"/>
          </div>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="bg-[#f3f3f7] dark:bg-[#001e40] h-screen w-72 flex flex-col h-full py-6 px-4 space-y-2 border-r border-[#c3c6d1]/15">
        <div className="px-4 mb-8">
        <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-white">
        <span className="material-symbols-outlined" style={{fontVariationSettings: '\'FILL\' 1'}}>shield_person</span>
        </div>
        <div>
        <p className="text-xs font-bold text-primary tracking-widest uppercase opacity-60">Premier Vault</p>
        <h3 className="text-sm font-extrabold text-[#001e40] dark:text-[#ffffff] leading-tight">Welcome Back</h3>
        </div>
        </div>
        <p className="text-xs text-[#43474f] font-medium">Premier Account Holder</p>
        </div>
        <nav className="flex-1 space-y-1">
        <a className="flex items-center gap-3 text-[#43474f] dark:text-[#c3c6d1] p-3 hover:bg-[#e7e8eb] transition-colors rounded-md group" href="#">
        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">dashboard</span>
        <span className="font-medium tracking-wide">Dashboard</span>
        </a>
        <a className="flex items-center gap-3 text-[#43474f] dark:text-[#c3c6d1] p-3 hover:bg-[#e7e8eb] transition-colors rounded-md group" href="#">
        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">account_balance</span>
        <span className="font-medium tracking-wide">Accounts</span>
        </a>
        <a className="flex items-center gap-3 bg-[#ffffff] dark:bg-[#003366] text-[#001e40] dark:text-[#ffffff] rounded-md font-semibold p-3 translate-x-1 transition-transform shadow-sm" href="#">
        <span className="material-symbols-outlined" style={{fontVariationSettings: '\'FILL\' 1'}}>security</span>
        <span className="font-medium tracking-wide">Security</span>
        </a>
        <a className="flex items-center gap-3 text-[#43474f] dark:text-[#c3c6d1] p-3 hover:bg-[#e7e8eb] transition-colors rounded-md group" href="#">
        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">payments</span>
        <span className="font-medium tracking-wide">Payments</span>
        </a>
        <a className="flex items-center gap-3 text-[#43474f] dark:text-[#c3c6d1] p-3 hover:bg-[#e7e8eb] transition-colors rounded-md group" href="#">
        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">mail</span>
        <span className="font-medium tracking-wide">Messages</span>
        </a>
        </nav>
        <div className="mt-auto border-t border-outline-variant/10 pt-4 space-y-1">
        <button className="w-full text-left flex items-center gap-3 text-[#43474f] dark:text-[#c3c6d1] p-3 hover:bg-[#e7e8eb] transition-colors rounded-md">
        <span className="material-symbols-outlined">settings</span>
        <span className="font-medium">Settings</span>
        </button>
        <button className="w-full text-left flex items-center gap-3 text-error p-3 hover:bg-error-container/20 transition-colors rounded-md">
        <span className="material-symbols-outlined">logout</span>
        <span className="font-medium">Logout</span>
        </button>
        </div>
        </aside>
        <main className="flex-1 overflow-y-auto p-12 bg-surface">
          <header className="mb-12">
            <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">Update Security Contact</h1>
            <p className="text-on-surface-variant text-lg max-w-2xl">Modify your primary mobile number associated with VAULT RETAIL. For your protection, multi-step verification is required.</p>
          </header>
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-8 space-y-8">
              <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/15 relative overflow-hidden security-gradient">
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</span>
                  <h2 className="text-xl font-bold text-primary uppercase tracking-wider">Initiate Update</h2>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-outline uppercase tracking-widest ml-1">Customer ID</label>
                    <div className="relative group">
                      <input className="w-full bg-surface-container-high border-none rounded-xl px-4 py-4 text-primary font-mono focus:ring-2 focus:ring-primary/20 transition-all cursor-not-allowed" readOnly type="text" value={customerId} />
                      <span className="material-symbols-outlined absolute right-4 top-4 text-outline-variant">lock</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-outline uppercase tracking-widest ml-1">New Mobile Number</label>
                    <div className="relative group">
                      <input className="w-full bg-surface-container-high border-2 border-transparent rounded-xl px-4 py-4 text-primary font-semibold focus:bg-white focus:border-primary transition-all outline-none" placeholder="+1 (555) 000-0000" type="tel" value={newMobileNumber} onChange={(e) => setNewMobileNumber(e.target.value)} />
                      <span className="material-symbols-outlined absolute right-4 top-4 text-primary opacity-40 group-focus-within:opacity-100">phone_iphone</span>
                    </div>
                  </div>
                </div>
              </section>
              <div className="grid grid-cols-2 gap-8">
                <section className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/15 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">2</span>
                      <h2 className="text-lg font-bold text-on-surface">Old Number OTP</h2>
                    </div>
                    <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">Enter the 6-digit code sent to your registered number ending in <span className="font-bold text-primary">**42</span>.</p>
                    <div className="flex gap-2 justify-between mb-4">
                      {oldOtp.map((digit, index) => (
                        <input key={index} className="w-12 h-14 text-center text-2xl font-bold rounded-xl bg-surface-container-lowest border-none shadow-sm focus:ring-2 focus:ring-primary outline-none" maxLength="1" type="text" value={digit} onChange={(e) => handleOldOtpChange(e, index)} />
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-outline-variant/10">
                    <button className="text-primary font-bold text-sm hover:underline flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">refresh</span> Resend OTP
                    </button>
                    <p className="text-[10px] text-outline mt-2 italic uppercase tracking-tighter">Code expires in 02:44. Account lock after 3 attempts.</p>
                  </div>
                </section>
                <section className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/15 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">3</span>
                      <h2 className="text-lg font-bold text-on-surface">New Number OTP</h2>
                    </div>
                    <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">Enter the 6-digit verification code sent to your <span className="font-bold text-primary">new number</span>.</p>
                    <div className="flex gap-2 justify-between mb-4">
                      {newOtp.map((digit, index) => (
                        <input key={index} className="w-12 h-14 text-center text-2xl font-bold rounded-xl bg-surface-container-lowest border-none shadow-sm focus:ring-2 focus:ring-primary outline-none" maxLength="1" type="text" value={digit} onChange={(e) => handleNewOtpChange(e, index)} />
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-outline-variant/10">
                    <button className="text-primary font-bold text-sm hover:underline flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">refresh</span> Resend OTP
                    </button>
                    <p className="text-[10px] text-outline mt-2 italic uppercase tracking-tighter">Code expires in 05:00. Required to bind device.</p>
                  </div>
                </section>
              </div>
              <div className="flex justify-end pt-4">
                <button className="bg-primary text-white px-12 py-5 rounded-xl font-bold text-lg flex items-center gap-3 shadow-xl hover:scale-95 duration-200 transition-transform" onClick={handleSubmit}>
                  Update Contact Information
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
            <div className="col-span-4 space-y-8">
              <section className="bg-surface-container-lowest rounded-xl p-8 shadow-md border-l-4 border-primary">
                <h3 className="text-xs font-black text-outline uppercase tracking-widest mb-6">Status Center</h3>
                {status === 'UPDATED' && (
                  <div className="p-6 bg-[#f3f3f7] rounded-xl mb-4 border border-outline-variant/10">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center">
                        <span className="material-symbols-outlined">check_circle</span>
                      </div>
                      <div>
                        <p className="font-bold text-primary leading-none">UPDATED</p>
                        <p className="text-[10px] text-outline-variant uppercase font-semibold">Transaction ID: TXN-99210</p>
                      </div>
                    </div>
                    <p className="text-sm text-on-surface-variant">Your mobile number was successfully updated. A confirmation email has been sent to your primary address.</p>
                  </div>
                )}
                {status === 'FAILED' && (
                  <div className="p-6 bg-error-container/10 rounded-xl border border-error/5">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-10 h-10 rounded-full bg-error text-white flex items-center justify-center">
                        <span className="material-symbols-outlined">error</span>
                      </div>
                      <div>
                        <p className="font-bold text-error leading-none">FAILED</p>
                        <p className="text-[10px] text-error/60 uppercase font-semibold">Error Code: {errorMessage?.code || 'N/A'}</p>
                      </div>
                    </div>
                    <p className="text-sm text-on-surface-variant">{errorMessage?.message || 'An unknown error occurred.'}</p>
                  </div>
                )}
              </section>
              <section className="bg-primary text-white rounded-xl p-8 relative overflow-hidden">
                <div className="absolute -right-8 -bottom-8 opacity-10">
                  <span className="material-symbols-outlined text-[160px]">shield</span>
                </div>
                <h3 className="text-lg font-bold mb-4">Security Policy</h3>
                <ul className="space-y-4 relative z-10">
                  <li className="flex gap-3">
                    <span className="material-symbols-outlined text-inverse-primary">verified</span>
                    <p className="text-sm text-primary-fixed">Your new number will be used for all 2FA requests immediately.</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="material-symbols-outlined text-inverse-primary">timer</span>
                    <p className="text-sm text-primary-fixed">You cannot change your number again for the next 48 hours.</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="material-symbols-outlined text-inverse-primary">support_agent</span>
                    <p className="text-sm text-primary-fixed">Contact support if you did not initiate this request.</p>
                  </li>
                </ul>
              </section>
              <div className="bg-surface-container-high rounded-xl p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-outline uppercase mb-1">Need help?</p>
                  <p className="text-primary font-bold">Priority Support Line</p>
                </div>
                <button className="bg-white p-3 rounded-full shadow-sm text-primary hover:bg-primary hover:text-white transition-colors">
                  <span className="material-symbols-outlined">call</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
