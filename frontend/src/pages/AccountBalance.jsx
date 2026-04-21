import React from 'react';

const AccountBalance = () => {
    return (
        <div className='bg-surface text-on-surface min-h-screen'>
            <header className='bg-[#f4faff]/80 backdrop-blur-xl fixed top-0 w-full z-50 flex items-center justify-between px-6 h-16'>
                <div className='flex items-center gap-4'>
                    <span className='material-symbols-outlined text-[#004A99]'>menu</span>
                    <h1 className='font-['Manrope'] font-bold tracking-tight text-blue-900'>Reserve Balance</h1>
                </div>
                <div className='w-8 h-8 rounded-full overflow-hidden bg-surface-container-high border border-outline-variant/20'>
                    <img alt='User avatar' className='w-full h-full object-cover' src='https://lh3.googleusercontent.com/aida-public/AB6AXuDBkKOlzVEEMWLkn70z5bl7jf5aZq_RhUaQQkLXLwAtMw-PhdvxzqTMqu6SZAxiaBzLh39NYT7xCE8p8hzOOW93pjFIEEf4FywciwU4B-xZDDWZn3yQUe4uembPojVvE0Kmbxq6M3YaWmGXeHiUumYNEpyhHqKyBiFBHN7ToW7_k3iKuhhwlZFkrdpiizDwb7iit4ajFI-V7xCqQd853eMifawAq333q0g4Xs6lgJZjwabXQ1Rn9XvIlR-IXAU-slDRxzSX_NaE76I' />
                </div>
            </header>
            <main className='pt-24 pb-32 px-6'>
                <section className='mb-10'>
                    <p className='font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-1'>Total Net Worth</p>
                    <div className='flex items-baseline gap-2'>
                        <span className='text-4xl font-headline font-extrabold tracking-tight text-primary'>$1,248,650.00</span>
                        <span className='text-sm font-semibold text-primary/60'>+2.4%</span>
                    </div>
                </section>
                <section className='mb-10 -mx-6'>
                    <h2 className='px-6 font-headline font-bold text-lg mb-4 text-primary'>Linked Accounts</h2>
                    <div className='flex overflow-x-auto gap-4 px-6 no-scrollbar snap-x'>
                        <div className='min-w-[280px] snap-center bg-surface-container-lowest p-6 rounded-xl shadow-[0_20px_40px_rgba(17,29,35,0.06)] border-b-4 border-primary'>
                            <div className='flex justify-between items-start mb-8'>
                                <span className='material-symbols-outlined text-primary-container'>account_balance_wallet</span>
                                <span className='font-label text-[10px] bg-secondary-container text-on-secondary-container px-2 py-1 rounded-sm'>PRIMARY</span>
                            </div>
                            <h3 className='font-headline font-bold text-on-surface mb-1'>Premier Checking</h3>
                            <p className='text-xs text-on-surface-variant font-mono mb-4'>**** 8842</p>
                            <p className='font-headline font-bold text-xl text-primary'>$42,350.12</p>
                        </div>
                        <div className='min-w-[280px] snap-center bg-surface-container-low p-6 rounded-xl transition-all opacity-70 hover:opacity-100'>
                            <div className='flex justify-between items-start mb-8'>
                                <span className='material-symbols-outlined text-on-surface-variant'>savings</span>
                            </div>
                            <h3 className='font-headline font-bold text-on-surface mb-1'>Reserve Savings</h3>
                            <p className='text-xs text-on-surface-variant font-mono mb-4'>**** 0019</p>
                            <p className='font-headline font-bold text-xl text-on-surface-variant'>$206,300.00</p>
                        </div>
                        <div className='min-w-[280px] snap-center bg-error-container/30 p-6 rounded-xl border border-error/10'>
                            <div className='flex justify-between items-start mb-8'>
                                <span className='material-symbols-outlined text-error' style={{ fontVariationSettings: 'FILL 1' }}>error</span>
                            </div>
                            <h3 className='font-headline font-bold text-on-surface mb-1'>International Portfolio</h3>
                            <p className='text-xs text-on-surface-variant font-mono mb-4'>**** 4556</p>
                            <div className='flex items-center gap-2'>
                                <p className='text-sm font-medium text-error'>Sync failed</p>
                                <button className='text-[10px] font-bold uppercase tracking-wider text-primary bg-white px-3 py-1 rounded shadow-sm'>Retry</button>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='bg-surface-container-low rounded-xl p-8 mb-10 relative overflow-hidden'>
                    <div className='absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none'></div>
                    <div className='relative z-10'>
                        <div className='flex justify-between items-center mb-6'>
                            <div>
                                <h2 className='font-headline font-bold text-primary'>Premier Checking</h2>
                                <p className='font-label text-xs text-on-surface-variant'>Last synced: Today, 10:42 AM</p>
                            </div>
                            <span className='material-symbols-outlined text-primary-container/40 text-4xl'>analytics</span>
                        </div>
                        <div className='mb-8'>
                            <p className='text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2'>Available Balance</p>
                            <h4 className='text-5xl font-headline font-extrabold text-blue-950 tracking-tight'>$42,350.12</h4>
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='bg-surface-container-lowest p-4 rounded-lg'>
                                <p className='text-[10px] font-bold text-on-surface-variant uppercase mb-1'>Interest Rate</p>
                                <p className='font-headline font-bold text-primary'>0.45% APY</p>
                            </div>
                            <div className='bg-surface-container-lowest p-4 rounded-lg'>
                                <p className='text-[10px] font-bold text-on-surface-variant uppercase mb-1'>Status</p>
                                <p className='font-headline font-bold text-green-700 flex items-center gap-1'>
                                    <span className='w-2 h-2 rounded-full bg-green-600'></span> Active
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <div className='flex justify-between items-center mb-6'>
                        <h2 className='font-headline font-bold text-lg text-primary'>Recent Activity</h2>
                        <button className='text-xs font-bold text-primary-container'>View All</button>
                    </div>
                    <div className='space-y-6'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-4'>
                                <div className='w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center'>
                                    <span className='material-symbols-outlined text-primary'>shopping_bag</span>
                                </div>
                                <div>
                                    <p className='font-headline font-bold text-on-surface text-sm'>Apple Store Ginza</p>
                                    <p className='text-xs text-on-surface-variant'>Electronic & Gadgets</p>
                                </div>
                            </div>
                            <p className='font-headline font-bold text-on-surface'>-$1,299.00</p>
                        </div>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-4'>
                                <div className='w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center'>
                                    <span className='material-symbols-outlined text-primary'>flight_takeoff</span>
                                </div>
                                <div>
                                    <p className='font-headline font-bold text-on-surface text-sm'>Delta Air Lines</p>
                                    <p className='text-xs text-on-surface-variant'>Travel & Business</p>
                                </div>
                            </div>
                            <p className='font-headline font-bold text-on-surface'>-$2,450.20</p>
                        </div>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-4'>
                                <div className='w-12 h-12 rounded-xl bg-secondary-container/50 flex items-center justify-center'>
                                    <span className='material-symbols-outlined text-primary-container'>south_west</span>
                                </div>
                                <div>
                                    <p className='font-headline font-bold text-on-surface text-sm'>Dividend Deposit</p>
                                    <p className='text-xs text-on-surface-variant'>Investment Income</p>
                                </div>
                            </div>
                            <p className='font-headline font-bold text-green-700'>+$412.55</p>
                        </div>
                    </div>
                </section>
            </main>
            <nav className='bg-white/80 backdrop-blur-2xl fixed bottom-0 w-full z-50 pb-safe shadow-[0_-20px_40px_rgba(17,29,35,0.06)]'>
                <div className='flex justify-around items-center w-full h-20 px-2'>
                    <div className='flex flex-col items-center justify-center text-slate-400'>
                        <span className='material-symbols-outlined text-2xl mb-1'>dashboard</span>
                        <span className='font-['Inter'] font-semibold text-[10px] uppercase tracking-widest'>Overview</span>
                    </div>
                    <div className='flex flex-col items-center justify-center text-blue-900 bg-[#ddeaf2] rounded-xl px-5 py-2'>
                        <span className='material-symbols-outlined text-2xl mb-1' style={{ fontVariationSettings: 'FILL 1' }}>account_balance_wallet</span>
                        <span className='font-['Inter'] font-semibold text-[10px] uppercase tracking-widest'>Accounts</span>
                    </div>
                    <div className='flex flex-col items-center justify-center text-slate-400'>
                        <span className='material-symbols-outlined text-2xl mb-1'>lock</span>
                        <span className='font-['Inter'] font-semibold text-[10px] uppercase tracking-widest'>Vault</span>
                    </div>
                    <div className='flex flex-col items-center justify-center text-slate-400'>
                        <span className='material-symbols-outlined text-2xl mb-1'>more_horiz</span>
                        <span className='font-['Inter'] font-semibold text-[10px] uppercase tracking-widest'>More</span>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default AccountBalance;
