import React from 'react';

const Dashboard = () => {
  return (
    <div className='bg-surface text-on-surface'>
      <style>
        {`
          .column-primary-reason {
            min-width: 200px;
            white-space: normal;
            word-break: break-word;
          }
          .transaction-history-chart-container {
            min-height: 200px;
            height: auto;
          }
        `}
      </style>
      {/* Shared SideNavBar */}
      <aside className='h-screen w-72 flex flex-col fixed left-0 top-0 bg-slate-50 border-r border-slate-100 p-6 gap-2 z-50'>
        <div className='mb-10'>
          <span className='text-lg font-black tracking-tighter text-[#00346c] uppercase'>UPI Oversight</span>
          <p className='text-xs text-slate-500 font-medium tracking-widest uppercase'>Institutional Ledger</p>
        </div>
        <nav className='flex flex-col gap-1 flex-grow'>
          <a className='flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/50 rounded-md transition-all' href='#'>
            <span className='material-symbols-outlined'>monitoring</span>
            <span className='text-sm font-medium'>Live Monitoring</span>
          </a>
          <a className='flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/50 rounded-md transition-all' href='#'>
            <span className='material-symbols-outlined'>gpp_maybe</span>
            <span className='text-sm font-medium'>Fraud Alerts</span>
          </a>
          <a className='flex items-center gap-3 px-4 py-3 text-[#004a96] font-bold bg-white rounded-md shadow-sm translate-x-1 transition-all' href='#'>
            <span className='material-symbols-outlined' style={{ fontVariationSettings: "'FILL' 1" }}>rate_review</span>
            <span className='text-sm font-medium'>Manual Review</span>
          </a>
        </nav>
        <button className='mt-auto mb-6 bg-error text-white py-3 px-4 rounded-md font-bold text-xs uppercase tracking-widest hover:bg-red-700 transition-colors'>
          Emergency Lock
        </button>
        <div className='flex flex-col gap-1 border-t border-slate-200 pt-6'>
          <a className='flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-900 transition-colors' href='#'>
            <span className='material-symbols-outlined text-xl'>settings</span>
            <span className='text-xs font-semibold'>System Settings</span>
          </a>
          <a className='flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-900 transition-colors' href='#'>
            <span className='material-symbols-outlined text-xl'>logout</span>
            <span className='text-xs font-semibold'>Log Out</span>
          </a>
        </div>
      </aside>
      {/* Main Content Shell */}
      <main className='ml-72 flex flex-col min-h-screen'>
        {/* Shared TopAppBar */}
        <header className='sticky top-0 w-full z-40 bg-white/80 backdrop-blur-md flex justify-between items-center px-10 py-4'>
          <div className='flex items-center gap-6 flex-1'>
            <h1 className='text-xl font-bold text-[#00346c]'>Transaction Control Center</h1>
            <div className='relative w-96'>
              <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm'>search</span>
              <input className='w-full bg-surface-container-high border-none rounded-md pl-10 text-sm py-2 focus:ring-2 focus:ring-primary/20' placeholder='Search UPI ID or Transaction...' type='text' />
            </div>
          </div>
          <div className='flex items-center gap-6'>
            <div className='flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100'>
              <span className='w-2 h-2 bg-green-500 rounded-full'></span>
              <span className='text-xs font-bold text-green-700 uppercase tracking-tight'>System Operational</span>
            </div>
            <div className='flex items-center gap-4 text-slate-400'>
              <span className='material-symbols-outlined cursor-pointer hover:text-primary transition-colors'>notifications_active</span>
              <span className='material-symbols-outlined cursor-pointer hover:text-primary transition-colors'>account_balance_wallet</span>
              <div className='w-8 h-8 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm'>
                <img alt='Architect Avatar' src='https://lh3.googleusercontent.com/aida-public/AB6AXuDuzJylFaiJgra6XJOB0RH9eqySX9h_QtlZPpdrsCKiNmZPIxjq0KQSEIR2ndsvegluAkwbQqF4WgzOYJCTGGz9HZZTyqPvZ0UvKIuWyoMiksnEU3KylSeecJstQRBHLLQ5R1PQR-em52y5tPuJD2Wz8kWIvgKHZ1VAj1LQWmE15RvAJoqKIIwpAY3DyLPMPhNjFjNAMSffQcMuZHlPFhV37BWoK2UzsRXLQvJj3haTvAvzZYh3JNMdQG1SKuTrSWmJuh9stWraYy8' />
              </div>
            </div>
          </div>
        </header>
        {/* Main Dashboard Canvas */}
        <div className='p-10 flex flex-col gap-8'>
          {/* Summary Stats */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-2'>
              <p className='text-xs font-bold text-slate-400 uppercase tracking-widest'>Total Held</p>
              <div className='flex items-end gap-3'>
                <h2 className='text-4xl font-black text-primary tracking-tighter'>42</h2>
                <span className='text-xs font-bold text-error mb-1'>+12% vs last hour</span>
              </div>
              <div className='w-full h-1 bg-slate-100 rounded-full mt-4'>
                <div className='w-2/3 h-full bg-primary-container rounded-full'></div>
              </div>
            </div>
            <div className='bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-2'>
              <p className='text-xs font-bold text-slate-400 uppercase tracking-widest'>Avg Review Time</p>
              <div className='flex items-end gap-3'>
                <h2 className='text-4xl font-black text-primary tracking-tighter'>4.5m</h2>
                <span className='text-xs font-bold text-green-600 mb-1'>-0.8m optimization</span>
              </div>
              <div className='w-full h-1 bg-slate-100 rounded-full mt-4'>
                <div className='w-1/2 h-full bg-secondary rounded-full'></div>
              </div>
            </div>
            <div className='bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-2'>
              <p className='text-xs font-bold text-slate-400 uppercase tracking-widest'>Override Rate</p>
              <div className='flex items-end gap-3'>
                <h2 className='text-4xl font-black text-primary tracking-tighter'>12%</h2>
                <span className='text-xs font-bold text-slate-400 mb-1'>Standard benchmark</span>
              </div>
              <div className='w-full h-1 bg-slate-100 rounded-full mt-4'>
                <div className='w-1/4 h-full bg-primary rounded-full'></div>
              </div>
            </div>
          </div>
          {/* Dashboard Split View */}
          <div className='flex gap-8 items-start'>
            {/* Pending Review Queue (Left) */}
            <div className='flex-[3] bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden'>
              <div className='p-6 border-b border-slate-50 flex justify-between items-center'>
                <h3 className='font-bold text-primary flex items-center gap-2'>
                  <span className='material-symbols-outlined'>pending</span>
                  Pending Review Queue
                </h3>
                <span className='text-xs font-bold bg-primary-fixed text-on-primary-fixed-variant px-2 py-1 rounded'>PRIORITY HIGH</span>
              </div>
              <table className='w-full text-left border-collapse'>
                <thead>
                  <tr className='bg-slate-50/50'>
                    <th className='px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest'>Timestamp</th>
                    <th className='px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest'>UPI ID</th>
                    <th className='px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest'>Amount</th>
                    <th className='px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest'>Risk Score</th>
                    <th className='px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest column-primary-reason'>Primary Reason</th>
                    <th className='px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-50'>
                  {/* Row 1: Active Focus */}
                  <tr className='bg-primary/5 border-l-4 border-primary'>
                    <td className='px-6 py-5 text-sm text-slate-600 font-medium'>14:22:01</td>
                    <td className='px-6 py-5 text-sm font-bold text-primary'>rajesh.v@icici</td>
                    <td className='px-6 py-5 text-sm font-black'>₹45,000.00</td>
                    <td className='px-6 py-5'>
                      <span className='text-xs font-bold px-2 py-1 bg-orange-100 text-orange-800 rounded-full'>88/100</span>
                    </td>
                    <td className='px-6 py-5 text-xs font-semibold text-slate-500 column-primary-reason'>New Device + High Velocity</td>
                    <td className='px-6 py-5 text-right flex justify-end gap-2'>
                      <button className='px-3 py-1.5 border border-green-600 text-green-700 rounded-md text-[10px] font-black uppercase tracking-tighter hover:bg-green-50 transition-colors'>Allow</button>
                      <button className='px-3 py-1.5 bg-error text-white rounded-md text-[10px] font-black uppercase tracking-tighter hover:opacity-90 transition-opacity'>Block</button>
                    </td>
                  </tr>
                  {/* Row 2 */}
                  <tr className='hover:bg-slate-50 transition-colors'>
                    <td className='px-6 py-5 text-sm text-slate-600 font-medium'>14:21:45</td>
                    <td className='px-6 py-5 text-sm font-bold text-primary'>megha_pay@ybl</td>
                    <td className='px-6 py-5 text-sm font-black'>₹1,200.00</td>
                    <td className='px-6 py-5'>
                      <span className='text-xs font-bold px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full'>42/100</span>
                    </td>
                    <td className='px-6 py-5 text-xs font-semibold text-slate-500 column-primary-reason'>Geo-Divergence</td>
                    <td className='px-6 py-5 text-right flex justify-end gap-2'>
                      <button className='px-3 py-1.5 border border-green-600 text-green-700 rounded-md text-[10px] font-black uppercase tracking-tighter hover:bg-green-50'>Allow</button>
                      <button className='px-3 py-1.5 bg-error text-white rounded-md text-[10px] font-black uppercase tracking-tighter hover:opacity-90'>Block</button>
                    </td>
                  </tr>
                  {/* Row 3 */}
                  <tr className='hover:bg-slate-50 transition-colors'>
                    <td className='px-6 py-5 text-sm text-slate-600 font-medium'>14:21:12</td>
                    <td className='px-6 py-5 text-sm font-bold text-primary'>shubham.k@hdfc</td>
                    <td className='px-6 py-5 text-sm font-black'>₹9,999.00</td>
                    <td className='px-6 py-5'>
                      <span className='text-xs font-bold px-2 py-1 bg-red-100 text-red-800 rounded-full'>94/100</span>
                    </td>
                    <td className='px-6 py-5 text-xs font-semibold text-slate-500 column-primary-reason'>Known Fraud Pattern</td>
                    <td className='px-6 py-5 text-right flex justify-end gap-2'>
                      <button className='px-3 py-1.5 border border-green-600 text-green-700 rounded-md text-[10px] font-black uppercase tracking-tighter hover:bg-green-50'>Allow</button>
                      <button className='px-3 py-1.5 bg-error text-white rounded-md text-[10px] font-black uppercase tracking-tighter hover:opacity-90'>Block</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Detail Panel (Right) */}
            <div className='flex-[1.5] flex flex-col gap-6 sticky top-24'>
              {/* Anomaly Vector: Geo-Divergence */}
              <div className='bg-surface-container-lowest rounded-xl shadow-sm p-6 overflow-hidden'>
                <div className='flex justify-between items-center mb-4'>
                  <h4 className='text-[10px] font-black uppercase tracking-widest text-slate-400'>Geo-Divergence</h4>
                  <span className='text-[10px] font-bold text-error bg-error-container px-2 py-0.5 rounded-full'>CRITICAL</span>
                </div>
                <div className='relative h-48 w-full bg-slate-100 rounded-lg overflow-hidden border border-slate-200'>
                  <img className='w-full h-full object-cover opacity-50 grayscale' alt='abstract monochromatic wireframe map of India showing network connections and glowing data nodes in blue' src='https://lh3.googleusercontent.com/aida-public/AB6AXuAIcleGs6tN3fQaio7N35UBfSegcbjmiufN-D4U1ykLwTWqwVc0vLsSym8J9BRB9swHvO5Z9_DtWurGMEPkF3D5-8w_MhYDQdXDu6UwaOBP24MqsVEAkwYlV7zTBZLjugX_ovriHBDESyK4d5Sid3B5DmO0GY_nDyltABdm7m7Lwbh_eAYMGA62yfKExdzHW6XyDZikURpX4j3YjYw-LyxxIjA02LLB1DvkDu_2AYU09mMtaUgDY0FgBvZh573kqR9mdOjqMO3nvHc' />
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='relative'>
                      <div className='absolute -inset-4 bg-primary/20 rounded-full animate-pulse'></div>
                      <span className='material-symbols-outlined text-primary text-4xl' style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                    </div>
                  </div>
                  <div className='absolute bottom-2 left-2 bg-white/90 p-2 rounded text-[10px] font-bold shadow-sm'>
                    Device: Bangalore | Profile: Mumbai
                  </div>
                </div>
              </div>
              {/* Device Fingerprint */}
              <div className='bg-surface-container-lowest rounded-xl shadow-sm p-6'>
                <h4 className='text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4'>Device Fingerprint</h4>
                <div className='flex items-center gap-6'>
                  <div className='relative w-20 h-20'>
                    <svg className='w-full h-full transform -rotate-90'>
                      <circle className='text-slate-100' cx='40' cy='40' fill='transparent' r='34' stroke='currentColor' strokeWidth='8'></circle>
                      <circle className='text-primary' cx='40' cy='40' fill='transparent' r='34' stroke='currentColor' strokeDasharray='213' strokeDashoffset='140' strokeWidth='8'></circle>
                    </svg>
                    <span className='absolute inset-0 flex items-center justify-center text-sm font-black text-primary'>34%</span>
                  </div>
                  <div className='flex flex-col gap-1'>
                    <p className='text-xs font-bold text-slate-700'>OnePlus 9 Pro (v12.4)</p>
                    <p className='text-[10px] text-slate-400'>Trust Score: LOW</p>
                    <div className='flex gap-1 mt-1'>
                      <span className='w-2 h-2 rounded-full bg-red-400'></span>
                      <span className='w-2 h-2 rounded-full bg-red-400'></span>
                      <span className='w-2 h-2 rounded-full bg-slate-200'></span>
                    </div>
                  </div>
                </div>
              </div>
              {/* User History Chart */}
              <div className='bg-surface-container-lowest rounded-xl shadow-sm p-6 transaction-history-chart-container'>
                <h4 className='text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4'>Transaction History</h4>
                <div className='flex flex-col gap-4'>
                  <div className='flex items-end gap-1 h-24'>
                    <div className='flex-1 bg-primary/20 rounded-t-sm h-[30%]'></div>
                    <div className='flex-1 bg-primary/20 rounded-t-sm h-[45%]'></div>
                    <div className='flex-1 bg-primary/20 rounded-t-sm h-[20%]'></div>
                    <div className='flex-1 bg-primary/20 rounded-t-sm h-[15%]'></div>
                    <div className='flex-1 bg-primary/20 rounded-t-sm h-[40%]'></div>
                    <div className='flex-1 bg-primary/20 rounded-t-sm h-[90%]'></div>
                    <div className='flex-1 bg-primary-container rounded-t-sm h-[100%] shadow-[0_-4px_12px_rgba(0,74,150,0.2)]'></div>
                  </div>
                  <div className='flex justify-between items-center pt-2 border-t border-slate-50'>
                    <div className='flex flex-col'>
                      <p className='text-[10px] font-black text-slate-400 uppercase'>Avg Ticket Size</p>
                      <p className='text-sm font-bold text-primary'>₹2,400</p>
                    </div>
                    <div className='text-right'>
                      <p className='text-[10px] font-black text-slate-400 uppercase'>Deviation</p>
                      <p className='text-sm font-bold text-error'>+1875%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
