import React, { useState, useEffect } from 'react';
import { getPolicyDetails, updateCoverageOptions, cancelPolicy } from '../services/policyService';

const PolicyDashboard = () => {
    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);

    // Dummy policy ID for now, replace with actual policy ID from auth context or route params
    const policyId = "test-policy-id"; 

    useEffect(() => {
        const fetchPolicy = async () => {
            try {
                const data = await getPolicyDetails(policyId);
                setPolicy(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPolicy();
    }, [policyId]);

    const handleUpdateCoverage = async (coverageType, details, startDate, endDate) => {
        try {
            const updatedPolicy = await updateCoverageOptions(policyId, {
                coverage_type: coverageType,
                details: details,
                start_date: startDate,
                end_date: endDate,
            });
            setPolicy(updatedPolicy);
            alert("Coverage updated successfully!");
        } catch (err) {
            alert(`Error updating coverage: ${err.message}`);
        }
    };

    const handleCancelPolicy = async () => {
        try {
            const cancelledPolicy = await cancelPolicy(policyId);
            setPolicy(cancelledPolicy);
            setShowCancelModal(false);
            alert("Policy cancelled successfully!");
        } catch (err) {
            alert(`Error cancelling policy: ${err.message}`);
        }
    };

    if (loading) return <div className='text-center py-10'>Loading policy details...</div>;
    if (error) return <div className='text-center py-10 text-red-500'>Error: {error}</div>;
    if (!policy) return <div className='text-center py-10'>No policy found.</div>;

    return (
        <div className='bg-surface font-body text-on-surface min-h-[1080px] w-[1920px] flex flex-col overflow-x-hidden'>
            {/* TopNavBar */}
            <nav className='fixed top-0 w-full z-50 bg-[#f7f9fb]/80 backdrop-blur-xl shadow-[0px_20px_40px_rgba(25,28,30,0.06)]'>
                <div className='flex justify-between items-center px-8 py-4 max-w-[1440px] mx-auto'>
                    <div className='flex items-center gap-8'>
                        <span className='text-xl font-bold text-[#00346f] tracking-tight font-headline'>Architectural Sanctuary</span>
                        <div className='hidden md:flex gap-6 items-center'>
                            <a className='font-headline font-semibold tracking-tight text-[#004A99] border-b-2 border-[#004A99] pb-1 transition-colors' href='#'>Dashboard</a>
                            <a className='font-headline font-semibold tracking-tight text-slate-500 hover:bg-[#f2f4f6] transition-colors px-2 py-1 rounded' href='#'>Claims</a>
                            <a className='font-headline font-semibold tracking-tight text-slate-500 hover:bg-[#f2f4f6] transition-colors px-2 py-1 rounded' href='#'>Coverage</a>
                            <a className='font-headline font-semibold tracking-tight text-slate-500 hover:bg-[#f2f4f6] transition-colors px-2 py-1 rounded' href='#'>Find Care</a>
                        </div>
                    </div>
                    <div className='flex items-center gap-4'>
                        <button className='p-2 text-slate-500 hover:bg-[#f2f4f6] rounded-full transition-colors'>
                            <span className='material-symbols-outlined'>notifications</span>
                        </button>
                        <button className='p-2 text-slate-500 hover:bg-[#f2f4f6] rounded-full transition-colors'>
                            <span className='material-symbols-outlined'>help_outline</span>
                        </button>
                        <div className='w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border-2 border-primary-container'>
                            <img alt='User profile' data-alt='professional headshot of a woman with a friendly smile in a modern office environment with soft lighting' src='https://lh3.googleusercontent.com/aida-public/AB6AXuCF92ttNusXb0p2GIGRDobsZzAKg_nq1gsUTpCLkgkBBhUqgQwmwDU8wS-LdYNZeK8pSAjIg7u7YbLALQtAJFVY2LMQG3gaZsszcpv8TdRosbr_EMuXRmAE2CEDqJ_quvSqLA95JIAklH0Q1UMkFbVdVyY97oE3iBqwzK5xcrZKGuz9AUAJT6l6pSRDeGprI5B8fugbWRCm11uwt7qEZHk93Iyj-RJUZ-_LnKrti5reOMafTZM3qt04UCEyB2ROiWwRwesu5NqHFvc'/>
                        </div>
                    </div>
                </div>
            </nav>
            {/* Main Content Canvas */}
            <main className='flex-grow pt-24 px-12 pb-12 max-w-[1920px] mx-auto w-full grid grid-cols-12 gap-8 items-start'>
                {/* Section 1: Policy Overview (Left Column) */}
                <aside className='col-span-3 space-y-6'>
                    <div className='bg-surface-container-low rounded-xl p-8 space-y-6'>
                        <header>
                            <span className='font-label text-xs font-semibold text-primary uppercase tracking-widest'>Policy Overview</span>
                            <h1 className='font-headline text-3xl font-extrabold text-primary mt-2'>{policy.policy_type}</h1>
                        </header>
                        <div className='space-y-4'>
                            <div className='p-4 bg-surface-container-lowest rounded-xl shadow-sm'>
                                <p className='font-label text-xs text-slate-500'>Policy Number</p>
                                <p className='font-headline font-bold text-on-surface'>{policy.policy_number}</p>
                            </div>
                            <div className='p-4 bg-surface-container-lowest rounded-xl shadow-sm flex justify-between items-center'>
                                <div>
                                    <p className='font-label text-xs text-slate-500'>Status</p>
                                    <p className='font-headline font-bold text-emerald-600 flex items-center gap-1'>
                                        <span className='w-2 h-2 rounded-full bg-emerald-500'></span>
                                        {policy.status}
                                    </p>
                                </div>
                                <div className='text-right'>
                                    <p className='font-label text-xs text-slate-500'>Effective Date</p>
                                    <p className='font-headline font-bold text-on-surface'>{policy.effective_date}</p>
                                </div>
                            </div>
                        </div>
                        <div className='pt-4 border-t border-outline-variant/15'>
                            <h3 className='font-headline font-bold text-on-surface mb-4'>Personal Details</h3>
                            <div className='space-y-3'>
                                <div className='flex justify-between'>
                                    <span className='text-sm text-slate-500'>Name</span>
                                    <span className='text-sm font-medium'>Sarah J. Montgomery</span> {/* Placeholder */}
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-sm text-slate-500'>DOB</span>
                                    <span className='text-sm font-medium'>May 14, 1988</span> {/* Placeholder */}
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-sm text-slate-500'>Address</span>
                                    <span className='text-sm font-medium text-right'>122 Sanctuary Dr.<br/>Aspen, CO 81611</span> {/* Placeholder */}
                                </div>
                            </div>
                        </div>
                        <div className='bg-primary p-6 rounded-xl text-on-primary shadow-lg bg-gradient-to-br from-primary to-primary-container'>
                            <p className='font-label text-xs opacity-80 uppercase tracking-wider'>Monthly Premium</p>
                            <div className='flex items-baseline gap-1 mt-1'>
                                <span className='text-3xl font-extrabold font-headline'>${policy.premium_amount.toFixed(2)}</span>
                                <span className='text-sm opacity-70'>/mo</span>
                            </div>
                            <div className='mt-4 pt-4 border-t border-white/10 flex justify-between items-center'>
                                <span className='text-xs opacity-80 font-medium'>Next Payment</span>
                                <span className='text-sm font-bold'>{policy.billing_date}</span>
                            </div>
                        </div>
                    </div>
                </aside>
                {/* Section 2: Coverage Options & Management (Middle/Main Column) */}
                <section className='col-span-6 space-y-8'>
                    <div className='bg-surface-container-low rounded-xl p-8'>
                        <div className='flex justify-between items-end mb-8'>
                            <div>
                                <h2 className='font-headline text-2xl font-bold text-primary'>Coverage &amp; Benefits</h2>
                                <p className='text-slate-500 mt-1'>Manage your active protection and optional riders.</p>
                            </div>
                            <div className='bg-tertiary-fixed text-on-tertiary-fixed px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2'>
                                <span className='material-symbols-outlined text-sm'>info</span>
                                Changes take effect after {policy.billing_date}
                            </div>
                        </div>
                        <div className='grid grid-cols-1 gap-4'>
                            {/* Medical Card */}
                            <div className='bg-surface-container-lowest p-6 rounded-xl flex items-center justify-between group hover:shadow-md transition-shadow'>
                                <div className='flex items-center gap-6'>
                                    <div className='w-14 h-14 bg-secondary-container rounded-xl flex items-center justify-center text-primary'>
                                        <span className='material-symbols-outlined text-3xl'>medical_services</span>
                                    </div>
                                    <div>
                                        <h4 className='font-headline font-bold text-lg'>Medical Coverage</h4>
                                        <p className='text-sm text-slate-500'>Full hospital and outpatient care</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-4'>
                                    <span className='text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full'>ACTIVE</span>
                                    <button className='text-primary font-bold text-sm hover:underline' onClick={() => handleUpdateCoverage("Medical", "Full hospital and outpatient care", new Date().toISOString().split('T')[0], new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0])}>Change</button>
                                </div>
                            </div>
                            {/* Dental Card */}
                            <div className='bg-surface-container-lowest p-6 rounded-xl flex items-center justify-between group hover:shadow-md transition-shadow'>
                                <div className='flex items-center gap-6'>
                                    <div className='w-14 h-14 bg-secondary-container rounded-xl flex items-center justify-center text-primary'>
                                        <span className='material-symbols-outlined text-3xl'>dentistry</span>
                                    </div>
                                    <div>
                                        <h4 className='font-headline font-bold text-lg'>Dental Care</h4>
                                        <p className='text-sm text-slate-500'>Diagnostic and Major Restorative</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-4'>
                                    <div className='relative inline-block w-12 h-6 transition duration-200 ease-in-out'>
                                        <input checked={true} className='peer absolute w-6 h-6 opacity-0 z-10 cursor-pointer' type='checkbox' onChange={() => handleUpdateCoverage("Dental", "Diagnostic and Major Restorative", new Date().toISOString().split('T')[0], new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0])}/>
                                        <span className='block w-full h-full bg-slate-300 peer-checked:bg-primary rounded-full transition-colors'></span>
                                        <span className='absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6'></span>
                                    </div>
                                </div>
                            </div>
                            {/* Vision Card */}
                            <div className='bg-surface-container-lowest p-6 rounded-xl flex items-center justify-between group hover:shadow-md transition-shadow'>
                                <div className='flex items-center gap-6'>
                                    <div className='w-14 h-14 bg-secondary-container rounded-xl flex items-center justify-center text-primary'>
                                        <span className='material-symbols-outlined text-3xl'>visibility</span>
                                    </div>
                                    <div>
                                        <h4 className='font-headline font-bold text-lg'>Vision Protection</h4>
                                        <p className='text-sm text-slate-500'>Annual exams and lens allowance</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-4'>
                                    <div className='relative inline-block w-12 h-6 transition duration-200 ease-in-out'>
                                        <input checked={true} className='peer absolute w-6 h-6 opacity-0 z-10 cursor-pointer' type='checkbox' onChange={() => handleUpdateCoverage("Vision", "Annual exams and lens allowance", new Date().toISOString().split('T')[0], new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0])}/>
                                        <span className='block w-full h-full bg-slate-300 peer-checked:bg-primary rounded-full transition-colors'></span>
                                        <span className='absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6'></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mt-8 space-y-6'>
                            <h3 className='font-headline font-bold text-lg text-on-surface'>Available Upgrades</h3>
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='border-2 border-dashed border-outline-variant rounded-xl p-6 text-center hover:bg-surface-container-highest transition-colors cursor-pointer group'>
                                    <span className='material-symbols-outlined text-3xl text-slate-400 group-hover:text-primary mb-2'>add_circle</span>
                                    <p className='font-headline font-bold'>Mental Health Plus</p>
                                    <p className='text-xs text-slate-500 mt-1'>+$12.50/mo</p>
                                </div>
                                <div className='border-2 border-dashed border-outline-variant rounded-xl p-6 text-center hover:bg-surface-container-highest transition-colors cursor-pointer group'>
                                    <span className='material-symbols-outlined text-3xl text-slate-400 group-hover:text-primary mb-2'>add_circle</span>
                                    <p className='font-headline font-bold'>International Travel</p>
                                    <p className='text-xs text-slate-500 mt-1'>+$18.00/mo</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='bg-surface-container-low rounded-xl p-8'>
                        <h3 className='font-headline font-bold text-lg mb-6'>Benefit Pulse (Annual Usage)</h3>
                        <div className='space-y-6'>
                            <div>
                                <div className='flex justify-between text-sm mb-2'>
                                    <span className='font-medium'>Deductible ($1,240 of $3,000)</span>
                                    <span className='text-primary font-bold'>41%</span>
                                </div>
                                <div className='benefit-pulse-track'>
                                    <div className='benefit-pulse-fill' style={{ width: '41%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className='flex justify-between text-sm mb-2'>
                                    <span className='font-medium'>Out-of-Pocket Max ($2,800 of $8,000)</span>
                                    <span className='text-primary font-bold'>35%</span>
                                </div>
                                <div className='benefit-pulse-track'>
                                    <div className='benefit-pulse-fill' style={{ width: '35%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Section 3: Policy Actions (Right Sidebar) */}
                <aside className='col-span-3 space-y-8'>
                    <div className='bg-surface-container-lowest rounded-xl shadow-[0px_20px_40px_rgba(25,28,30,0.06)] p-8'>
                        <h3 className='font-headline font-bold text-xl mb-6'>Quick Actions</h3>
                        <div className='space-y-3'>
                            <button className='w-full py-4 px-6 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-xl font-bold flex items-center justify-between hover:scale-[1.02] transition-transform'>
                                Download ID Card
                                <span className='material-symbols-outlined'>download</span>
                            </button>
                            <button className='w-full py-4 px-6 bg-secondary-container text-on-secondary-container rounded-xl font-bold flex items-center justify-between hover:scale-[1.02] transition-transform'>
                                Update Payment
                                <span className='material-symbols-outlined'>credit_card</span>
                            </button>
                            <button className='w-full py-4 px-6 bg-surface-container-high text-primary rounded-xl font-bold flex items-center justify-between hover:bg-surface-container-highest transition-colors'>
                                Tax Documents
                                <span className='material-symbols-outlined'>description</span>
                            </button>
                        </div>
                    </div>
                    <div className='bg-error-container/20 rounded-xl p-8 border border-error/10'>
                        <h3 className='font-headline font-bold text-xl text-error mb-2'>Account Management</h3>
                        <p className='text-sm text-slate-600 mb-6 leading-relaxed'>
                            Once initiated, cancellation requests are processed within 3-5 business days.
                        </p>
                        <button className='w-full py-4 border-2 border-error text-error font-bold rounded-xl hover:bg-error hover:text-white transition-all' onClick={() => setShowCancelModal(true)}>
                            Initiate Policy Cancellation
                        </button>
                    </div>
                    {/* Ad/Promotion Spot (Visual Interest) */}
                    <div className='rounded-xl overflow-hidden relative h-48 group cursor-pointer shadow-xl'>
                        <img alt='Health support' className='absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110' data-alt='close up of a professional doctor holding a tablet in a clean sunlit medical facility with soft bokeh' src='https://lh3.googleusercontent.com/aida-public/AB6AXuCCww7CS1Lp7JbElsQxSzFDESilHGJr2GHCP01gWZylLfm5RC_WY5pHCDdVCUdsIAZEgKhhwJqACTb1KJsku5yazrvcunBcQ22sOh8fuSaOg9iqgf-DF7MJ6JRP1scNm6B31nD9mJuyENOGrSojaN6nOUwaR6bC3iQxrRijItPgmPKJI_YlAL5ENQkRx8N9vt-dDRYWjJz7IzkBtFSk9b9mo358a_pzxY7_HQOQX3CyO-TwErHjguK7BwDjPz9lvt56aL53va1YOG4'/>
                        <div className='absolute inset-0 bg-primary/40 flex flex-col justify-end p-6'>
                            <p className='text-white text-xs font-bold uppercase tracking-widest mb-1'>24/7 Virtual Care</p>
                            <p className='text-white font-headline font-bold text-lg leading-tight'>Access on-demand therapy from home.</p>
                        </div>
                    </div>
                </aside>
            </main>
            {/* Footer */}
            <footer className='w-full mt-auto py-12 bg-[#f2f4f6]'>
                <div className='flex flex-col md:flex-row justify-between items-center px-12 max-w-[1440px] mx-auto gap-4 font-body text-sm text-slate-600'>
                    <p>© 2024 Architectural Sanctuary Health. All rights reserved.</p>
                    <div className='flex gap-8'>
                        <a className='text-slate-500 hover:text-[#004A99] underline transition-all' href='#'>Support Center</a>
                        <a className='text-slate-500 hover:text-[#004A99] underline transition-all' href='#'>Privacy Policy</a>
                        <a className='text-slate-500 hover:text-[#004A99] underline transition-all' href='#'>Terms of Service</a>
                        <a className='text-slate-500 hover:text-[#004A99] underline transition-all' href='#'>Contact Us</a>
                    </div>
                </div>
            </footer>
            {/* Cancellation Confirmation Modal (Overlay) */}
            {showCancelModal && (
                <div className='fixed inset-0 z-[100]'>
                    <div className='absolute inset-0 bg-on-surface/40 backdrop-blur-md'></div>
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl p-10 shadow-[0px_20px_40px_rgba(25,28,30,0.15)]'>
                        <div className='w-16 h-16 bg-error-container rounded-full flex items-center justify-center text-error mx-auto mb-6'>
                            <span className='material-symbols-outlined text-4xl' style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                        </div>
                        <h2 className='text-2xl font-headline font-extrabold text-center text-primary mb-2'>Cancel Policy?</h2>
                        <p className='text-slate-500 text-center mb-8'>
                            This will terminate your <b>{policy.policy_type}</b> effective immediately. You will lose access to all benefits on the next billing cycle.
                        </p>
                        <div className='space-y-3'>
                            <button className='w-full py-4 bg-error text-white font-bold rounded-xl hover:bg-red-700 transition-colors' onClick={handleCancelPolicy}>
                                Confirm Cancellation
                            </button>
                            <button className='w-full py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors' onClick={() => setShowCancelModal(false)}>
                                Nevermind, Keep My Plan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PolicyDashboard;
