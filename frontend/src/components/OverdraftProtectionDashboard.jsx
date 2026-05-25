import React, { useState, useEffect } from 'react';

const OverdraftProtectionDashboard = () => {
  const [accountConfig, setAccountConfig] = useState(null);
  const [overdraftEvents, setOverdraftEvents] = useState([]);
  const [notificationPreferences, setNotificationPreferences] = useState({
    sms: { enabled: false, recipient: '' },
    email: { enabled: false, recipient: '' },
  });
  const [isAutoProtectionEnabled, setIsAutoProtectionEnabled] = useState(true);

  // Mock API calls - replace with actual API integration
  useEffect(() => {
    // Fetch account configuration
    const fetchAccountConfig = async () => {
      // In a real app, you'd fetch this from your backend
      const mockAccountConfig = {
        id: 'acc-123',
        checking_account_id: 'CHK-1109',
        savings_account_id: 'SAV-8824',
        is_enabled: true,
        notification_preferences: {
          email: { enabled: true, recipient: 'premium@vault.com' },
          sms: { enabled: false, recipient: '+1 (555) 012-3456' },
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setAccountConfig(mockAccountConfig);
      setIsAutoProtectionEnabled(mockAccountConfig.is_enabled);
      setNotificationPreferences(mockAccountConfig.notification_preferences);
    };

    // Fetch overdraft events
    const fetchOverdraftEvents = async () => {
      // In a real app, you'd fetch this from your backend
      const mockEvents = [
        {
          id: 'evt-1',
          transaction_id: 'TR-982421',
          timestamp: 'Oct 24, 2023, 02:14 PM',
          amount: 150.00,
          from_account: 'Savings',
          to_account: 'Checking',
          status: 'Completed',
          details: {},
        },
        {
          id: 'evt-2',
          transaction_id: 'TR-982420',
          timestamp: 'Oct 19, 2023, 11:45 AM',
          amount: 1200.00,
          from_account: 'Savings',
          to_account: 'Checking',
          status: 'Completed',
          details: {},
        },
        {
          id: 'evt-3',
          transaction_id: 'TR-982419',
          timestamp: 'Oct 12, 2023, 09:02 AM',
          amount: 45.50,
          from_account: 'Savings',
          to_account: 'Checking',
          status: 'Completed',
          details: {},
        },
        {
          id: 'evt-4',
          transaction_id: 'TR-982418',
          timestamp: 'Sep 28, 2023, 04:30 PM',
          amount: 2500.00,
          from_account: 'Savings',
          to_account: 'Checking',
          status: 'Completed',
          details: {},
        },
      ];
      setOverdraftEvents(mockEvents);
    };

    fetchAccountConfig();
    fetchOverdraftEvents();
  }, []);

  const handleAutoProtectionToggle = async () => {
    const newStatus = !isAutoProtectionEnabled;
    // Call API to update status
    // await api.updateAccountConfig(accountConfig.id, { is_enabled: newStatus });
    setIsAutoProtectionEnabled(newStatus);
    setAccountConfig(prev => ({ ...prev, is_enabled: newStatus }));
  };

  const handleNotificationToggle = (type) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [type]: { ...prev[type], enabled: !prev[type].enabled },
    }));
    // Call API to update notification preferences
  };

  const handleNotificationRecipientChange = (type, value) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [type]: { ...prev[type], recipient: value },
    }));
  };

  const handleUpdateNotification = (type) => {
    // Call API to update notification preferences
    console.log(`Updating ${type} notification to:`, notificationPreferences[type].recipient);
  };

  if (!accountConfig) {
    return <div className='ml-64 pt-20 px-8 pb-12 h-screen overflow-y-auto no-scrollbar'>Loading...</div>;
  }

  return (
    <>
      {/* TopNavBar */}
      <header className='fixed top-0 w-full z-50 bg-slate-50/80 backdrop-blur-md flex justify-between items-center px-6 py-3 shadow-sm shadow-blue-900/5'>
        <div className='flex items-center gap-8'>
          <span className='text-xl font-bold tracking-tighter text-blue-950'>Financial Flow</span>
          <nav className='hidden md:flex gap-6 items-center'>
            <a className='text-slate-500 hover:bg-blue-50 transition-colors px-3 py-1 rounded-lg' href='#'>Accounts</a>
            <a className='text-slate-500 hover:bg-blue-50 transition-colors px-3 py-1 rounded-lg' href='#'>Investment</a>
            <a className='text-blue-900 font-semibold px-3 py-1 rounded-lg' href='#'>Protection</a>
          </nav>
        </div>
        <div className='flex items-center gap-4'>
          <div className='relative hidden lg:block'>
            <input className='bg-surface-container-high border-none rounded-full px-5 py-1.5 text-sm w-64 focus:ring-2 focus:ring-primary/20 transition-all' placeholder='Search portfolio...' type='text' />
          </div>
          <button className='material-symbols-outlined text-slate-500 p-2 hover:bg-blue-50 rounded-full transition-colors active:scale-95'>notifications</button>
          <button className='material-symbols-outlined text-slate-500 p-2 hover:bg-blue-50 rounded-full transition-colors active:scale-95'>settings</button>
          <div className='h-8 w-8 rounded-full bg-primary-container overflow-hidden ring-2 ring-white'>
            <img alt='User profile avatar' src='https://lh3.googleusercontent.com/aida-public/AB6AXuAjhlot3UXIHOL4tNML15riL3uyaEtXv7Rx-n_--g9tPJEZSR_dT1rX84JCl4B8Qw5aXR1kUbezVq4DOKxZaCD7j1ebv30rTV86LJFrgZQAL2Pk8NpZ769TAzyL6Rhry6OfQ4m3SfyAq8pEsVdieWriOgVgq6K4vHzqUlRqWkyLw55HZsUmagcegIVldFFSGAhUfsc0gSosaUddDTHzHWcReWtqF_FVo1mhgeNTctoNkoacSM0qrGRwKKXXtLAQEToNS8SRNdPg64u' />
          </div>
        </div>
      </header>
      {/* SideNavBar */}
      <aside className='h-screen w-64 fixed left-0 top-0 pt-16 flex flex-col border-r border-slate-200/50 bg-slate-50 z-40'>
        <div className='px-6 py-8'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='h-10 w-10 bg-primary rounded-lg flex items-center justify-center'>
              <span className='material-symbols-outlined text-white' style={{ fontVariationSettings: '\'FILL\' 1' }}>account_balance_wallet</span>
            </div>
            <div>
              <h2 className='text-sm font-black text-blue-950 uppercase tracking-widest'>The Private Vault</h2>
              <p className='text-[10px] text-slate-500 font-bold tracking-wider'>PREMIUM TIER</p>
            </div>
          </div>
        </div>
        <nav className='flex-1 px-4 space-y-1'>
          <a className='flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:text-blue-900 hover:bg-blue-50/50 transition-all duration-200' href='#'>
            <span className='material-symbols-outlined'>dashboard</span>
            <span className='font-medium text-sm'>Overview</span>
          </a>
          <a className='flex items-center gap-3 px-4 py-3 rounded-lg bg-white text-blue-950 font-bold shadow-sm transition-all duration-200' href='#'>
            <span className='material-symbols-outlined' style={{ fontVariationSettings: '\'FILL\' 1' }}>swap_horiz</span>
            <span className='font-medium text-sm'>Transfers</span>
          </a>
          <a className='flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:text-blue-900 hover:bg-blue-50/50 transition-all duration-200' href='#'>
            <span className='material-symbols-outlined'>verified_user</span>
            <span className='font-medium text-sm'>Security</span>
          </a>
          <div className='pt-8 px-4'>
            <button className='w-full py-3 bg-gradient-to-br from-primary to-primary-container text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-900/20 active:scale-95 transition-transform'>
              New Transaction
            </button>
          </div>
        </nav>
        <div className='p-4 border-t border-slate-200/50 space-y-1'>
          <a className='flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-blue-50/50 transition-all' href='#'>
            <span className='material-symbols-outlined'>help</span>
            <span className='text-sm'>Support</span>
          </a>
          <a className='flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-blue-50/50 transition-all' href='#'>
            <span className='material-symbols-outlined'>logout</span>
            <span className='text-sm'>Logout</span>
          </a>
        </div>
      </aside>
      {/* Main Content */}
      <main className='ml-64 pt-20 px-8 pb-12 h-screen overflow-y-auto no-scrollbar'>
        {/* Breadcrumb / Header */}
        <header className='mb-10 pt-4'>
          <p className='text-label-sm font-label uppercase tracking-[0.15em] text-on-surface-variant mb-2'>Portfolio Management</p>
          <h1 className='text-4xl font-black tracking-tight text-on-surface'>Automated Overdraft Protection</h1>
          <p className='text-slate-500 mt-2 max-w-2xl text-lg'>Manage your secure liquidity bridge between private accounts to maintain seamless transactional flow.</p>
        </header>
        {/* Bento Layout Dashboard */}
        <div className='grid grid-cols-12 gap-6'>
          {/* Section 1: Configuration Card (Span 8) */}
          <section className='col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10'>
            <div className='flex items-center justify-between mb-8'>
              <div>
                <h2 className='text-xl font-bold text-blue-950'>Account Linking</h2>
                <p className='text-sm text-slate-500'>Define the automated bridge between your liquidity sources.</p>
              </div>
              <div className='flex items-center gap-3 bg-surface-container-low px-4 py-2 rounded-full'>
                <span className='text-xs font-bold text-blue-900 uppercase tracking-wider'>Auto-Protection</span>
                <button
                  onClick={handleAutoProtectionToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    isAutoProtectionEnabled ? 'bg-primary-container' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      isAutoProtectionEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  ></span>
                </button>
              </div>
            </div>
            <div className='grid md:grid-cols-2 gap-8 mb-10'>
              <div className='space-y-2'>
                <label className='text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-1'>Target Account</label>
                <div className='bg-surface-container-highest p-4 rounded-lg flex items-center gap-4 group hover:bg-surface-container-lowest transition-all border border-transparent focus-within:border-primary/20'>
                  <span className='material-symbols-outlined text-blue-900 bg-white p-2 rounded-lg'>account_balance</span>
                  <div className='flex-1'>
                    <p className='text-sm font-bold text-blue-950'>Primary Checking</p>
                    <p className='text-xs text-slate-500'>*{accountConfig.checking_account_id.slice(-4)} • Available: $24,500.00</p>
                  </div>
                </div>
              </div>
              <div className='space-y-2'>
                <label className='text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-1'>Source Account</label>
                <div className='bg-surface-container-highest p-4 rounded-lg flex items-center gap-4 group hover:bg-surface-container-lowest transition-all border border-transparent focus-within:border-primary/20'>
                  <span className='material-symbols-outlined text-blue-900 bg-white p-2 rounded-lg'>savings</span>
                  <div className='flex-1'>
                    <p className='text-sm font-bold text-blue-950'>Linked Savings</p>
                    <p className='text-xs text-slate-500'>*{accountConfig.savings_account_id.slice(-4)} • Available: $142,800.00</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100'>
              <div className='flex items-center gap-2 text-slate-500'>
                <span className='material-symbols-outlined text-sm'>info</span>
                <span className='text-xs'>Transfers are instant and carry zero service fees for premium accounts.</span>
              </div>
              <div className='flex items-center gap-3'>
                <button className='px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors'>Unlink Account</button>
                <button className='px-6 py-2.5 rounded-lg bg-primary-container text-white text-sm font-bold shadow-md hover:shadow-lg transition-all'>Update Link</button>
              </div>
            </div>
          </section>
          {/* Section 3: Notification Sidebar Card (Span 4) */}
          <section className='col-span-12 lg:col-span-4 space-y-6'>
            <div className='bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10'>
              <h2 className='text-lg font-bold text-blue-950 mb-6 flex items-center gap-2'>
                <span className='material-symbols-outlined text-blue-900'>notifications_active</span>
                Notification Preferences
              </h2>
              <div className='space-y-6'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-semibold text-slate-700'>SMS Notifications</span>
                    <button
                      onClick={() => handleNotificationToggle('sms')}
                      className={`relative inline-flex h-5 w-10 items-center rounded-full ${
                        notificationPreferences.sms.enabled ? 'bg-primary-container' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition ${
                          notificationPreferences.sms.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      ></span>
                    </button>
                  </div>
                  <div className='flex gap-2'>
                    <input
                      className='flex-1 bg-surface-container-highest border-none rounded-lg text-sm px-4 py-2 focus:ring-1 focus:ring-primary/20'
                      type='text'
                      value={notificationPreferences.sms.recipient}
                      onChange={(e) => handleNotificationRecipientChange('sms', e.target.value)}
                    />
                    <button onClick={() => handleUpdateNotification('sms')} className='px-3 py-2 text-xs font-bold text-primary hover:bg-blue-50 rounded-lg transition-colors'>Update</button>
                  </div>
                </div>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-semibold text-slate-700'>Email Notifications</span>
                    <button
                      onClick={() => handleNotificationToggle('email')}
                      className={`relative inline-flex h-5 w-10 items-center rounded-full ${
                        notificationPreferences.email.enabled ? 'bg-primary-container' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition ${
                          notificationPreferences.email.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      ></span>
                    </button>
                  </div>
                  <div className='flex gap-2'>
                    <input
                      className='flex-1 bg-surface-container-highest border-none rounded-lg text-sm px-4 py-2 focus:ring-1 focus:ring-primary/20'
                      type='text'
                      value={notificationPreferences.email.recipient}
                      onChange={(e) => handleNotificationRecipientChange('email', e.target.value)}
                    />
                    <button onClick={() => handleUpdateNotification('email')} className='px-3 py-2 text-xs font-bold text-primary hover:bg-blue-50 rounded-lg transition-colors'>Update</button>
                  </div>
                </div>
              </div>
            </div>
            {/* Contextual Tip */}
            <div className='bg-gradient-to-br from-primary to-primary-container rounded-xl p-6 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden group'>
              <div className='absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform'>
                <span className='material-symbols-outlined text-9xl'>lock_open</span>
              </div>
              <div className='relative z-10'>
                <div className='flex items-center gap-2 mb-3'>
                  <span className='material-symbols-outlined text-on-primary-container'>shield</span>
                  <span className='text-[10px] font-black uppercase tracking-[0.2em] text-on-primary-container'>Vault Security Tip</span>
                </div>
                <h3 className='text-lg font-bold mb-2 leading-tight'>Capital Preservation</h3>
                <p className='text-sm text-blue-200/90 leading-relaxed'>
                  Automated bridging ensures your investment positions remain liquid without manual intervention during high-volume trade windows.
                </p>
              </div>
            </div>
          </section>
          {/* Section 2: Recent Overdraft Transfers (Span 12) */}
          <section className='col-span-12 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden'>
            <div className='p-8 border-b border-slate-50 flex items-center justify-between'>
              <div>
                <h2 className='text-xl font-bold text-blue-950'>Recent Overdraft Protection Transfers</h2>
                <p className='text-sm text-slate-500 mt-1'>Audit log of all automated liquidity shifts within the last 90 days.</p>
              </div>
              <button className='flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant/30 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all'>
                <span className='material-symbols-outlined text-lg'>download</span>
                Download CSV
              </button>
            </div>
            <div className='overflow-x-auto'>
              <table className='w-full text-left'>
                <thead className='bg-surface-container-low'>
                  <tr>
                    <th className='px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Transaction ID</th>
                    <th className='px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Date/Time</th>
                    <th className='px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Route</th>
                    <th className='px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right'>Amount</th>
                    <th className='px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center'>Status</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-100'>
                  {overdraftEvents.map((event) => (
                    <tr key={event.id} className='hover:bg-slate-50/50 transition-colors'>
                      <td className='px-8 py-6 font-mono text-xs text-blue-900 font-semibold'>#{event.transaction_id}</td>
                      <td className='px-8 py-6 text-sm text-slate-600'>{event.timestamp}</td>
                      <td className='px-8 py-6'>
                        <div className='flex items-center gap-2'>
                          <span className='text-xs font-bold text-blue-950'>{event.from_account}</span>
                          <span className='material-symbols-outlined text-xs text-slate-400'>arrow_forward</span>
                          <span className='text-xs font-bold text-blue-950'>{event.to_account}</span>
                        </div>
                      </td>
                      <td className='px-8 py-6 text-right font-bold text-blue-950'>${event.amount.toFixed(2)}</td>
                      <td className='px-8 py-6 text-center'>
                        <span className='inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-wider'>{event.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='px-8 py-4 bg-slate-50/50 text-center'>
              <button className='text-xs font-bold text-primary hover:underline underline-offset-4'>View Full Transaction History</button>
            </div>
          </section>
        </div>
      </main>
      {/* Asset Glass Card Overlay (Signature Component) */}
      <div className='fixed bottom-8 right-8 w-80 p-6 bg-surface-tint/10 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl z-[60]'>
        <div className='flex items-center justify-between mb-4'>
          <span className='text-[10px] font-black text-blue-900 uppercase tracking-widest'>Protected Liquidity</span>
          <span className='material-symbols-outlined text-blue-900'>verified</span>
        </div>
        <p className='text-2xl font-black text-blue-950 tracking-tighter mb-1'>$167,300.00</p>
        <p className='text-xs text-slate-600 font-medium mb-4'>Available for Auto-Bridge</p>
        <div className='w-full bg-blue-900/10 h-1.5 rounded-full overflow-hidden'>
          <div className='bg-primary h-full w-[85%] rounded-full'></div>
        </div>
        <div className='flex justify-between mt-2'>
          <span className='text-[9px] font-bold text-slate-500 uppercase'>Coverage Level</span>
          <span className='text-[9px] font-bold text-primary uppercase'>Optimal</span>
        </div>
      </div>
    </>
  );
};

export default OverdraftProtectionDashboard;
