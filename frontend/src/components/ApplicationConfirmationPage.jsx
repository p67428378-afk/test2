import React from 'react';
import { useLocation } from 'react-router-dom';

const ApplicationConfirmationPage = () => {
    const location = useLocation();
    const application = location.state?.application || { id: 'CCAPP-2024-001' }; // Default for testing

    return (
        <div className='bg-background font-body-md text-on-background flex flex-col min-h-screen'>
            <header className='bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50'>
                {/* ... Header content from HTML ... */}
            </header>
            <main className='flex-grow flex items-center justify-center p-6'>
                <div className='max-w-[1280px] w-full flex justify-center'>
                    <div className='bg-surface w-full max-w-2xl rounded-xl shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden'>
                        <div className='p-xl md:p-16 flex flex-col items-center text-center'>
                            <div className='mb-lg relative'>
                                <div className='absolute inset-0 bg-success-accent opacity-10 rounded-full scale-150'></div>
                                <div className='w-24 h-24 bg-success-accent/10 text-success-accent rounded-full flex items-center justify-center'>
                                    <span className='material-symbols-outlined text-[64px]' style={{fontVariationSettings: '\'FILL\' 1'}}>check_circle</span>
                                </div>
                            </div>
                            <h1 className='font-display-lg text-display-lg text-on-background mb-4'>Application Received!</h1>
                            <p className='font-body-lg text-body-lg text-secondary mb-10 max-w-md'>Your application has been successfully submitted and is now being reviewed by our underwriting team.</p>
                            <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-gutter mb-12'>
                                <div className='bg-gray-50 p-lg rounded-xl border border-gray-200 flex flex-col items-center justify-center gap-2'>
                                    <span className='text-label-sm font-label-sm text-gray-400 uppercase tracking-widest'>Reference ID</span>
                                    <span className='font-headline-sm text-headline-sm text-on-background font-mono tracking-tight'>{application.id}</span>
                                </div>
                                <div className='bg-gray-50 p-lg rounded-xl border border-gray-200 flex flex-col items-center justify-center gap-2'>
                                    <span className='text-label-sm font-label-sm text-gray-400 uppercase tracking-widest'>Estimated Time</span>
                                    <span className='font-headline-sm text-headline-sm text-on-background'>3-5 Business Days</span>
                                </div>
                            </div>
                            <div className='flex flex-col sm:flex-row gap-4 w-full justify-center'>
                                <button className='bg-primary-container text-white font-label-md text-label-md px-10 py-4 rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2'>
                                    Go to Dashboard
                                    <span className='material-symbols-outlined text-[20px]'>arrow_forward</span>
                                </button>
                                <button className='bg-white text-secondary font-label-md text-label-md px-10 py-4 rounded-lg border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2'>
                                    View Submission Details
                                </button>
                            </div>
                        </div>
                        <div className='h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500'></div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ApplicationConfirmationPage;
