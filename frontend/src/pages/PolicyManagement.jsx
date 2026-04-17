
import React from 'react';
import PolicyDetails from '../components/PolicyDetails';
import UpdatePolicy from '../components/UpdatePolicy';
import CancelPolicy from '../components/CancelPolicy';
import QuickStats from '../components/QuickStats';
import Header from '../components/Header';

const PolicyManagement = () => {
    return (
        <div className='bg-surface text-on-surface min-h-screen'>
            <Header />
            <main className='pt-24 pb-12 px-8 max-w-[1920px] mx-auto'>
                <section className='mb-12'>
                    <h1 className='text-display-lg text-5xl font-extrabold text-on-surface tracking-tight mb-2'>My Policy.</h1>
                    <p className='text-on-surface-variant text-lg max-w-2xl'>Manage your coverage details, update beneficiaries, or adjust your healthcare journey settings from your clinical sanctuary.</p>
                </section>
                <div className='flex overflow-x-auto gap-8 pb-8 hide-scrollbar scroll-smooth'>
                    <PolicyDetails />
                    <UpdatePolicy />
                    <CancelPolicy />
                </div>
                <QuickStats />
            </main>
            <div className="fixed bottom-8 right-8">
                <button className="flex items-center gap-3 bg-white shadow-xl shadow-primary/20 px-6 py-4 rounded-full border border-surface-container hover:scale-105 active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-primary" data-weight="fill">chat_bubble</span>
                    <span className="text-sm font-bold text-primary">Support Hub</span>
                </button>
            </div>
        </div>
    );
};

export default PolicyManagement;
