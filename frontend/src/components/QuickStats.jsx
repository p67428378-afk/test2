
import React from 'react';

const QuickStats = () => {
    return (
        <section className='mt-12 grid grid-cols-1 md:grid-cols-4 gap-8'>
            <div className='bg-surface-container-lowest p-6 rounded-xl flex items-center space-x-4'>
                <div className='w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center'>
                    <span className='material-symbols-outlined text-primary'>receipt_long</span>
                </div>
                <div>
                    <p className='text-xs font-bold text-on-surface-variant'>Recent Claims</p>
                    <p className='text-xl font-black'>2 Pending</p>
                </div>
            </div>
            <div className='bg-surface-container-lowest p-6 rounded-xl flex items-center space-x-4'>
                <div className='w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center'>
                    <span className='material-symbols-outlined text-primary'>stethoscope</span>
                </div>
                <div>
                    <p className='text-xs font-bold text-on-surface-variant'>Network Doctors</p>
                    <p className='text-xl font-black'>12,400+</p>
                </div>
            </div>
            <div className='bg-surface-container-lowest p-6 rounded-xl flex items-center space-x-4'>
                <div className='w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center'>
                    <span className='material-symbols-outlined text-primary'>savings</span>
                </div>
                <div>
                    <p className='text-xs font-bold text-on-surface-variant'>Total Savings</p>
                    <p className='text-xl font-black'>$4,200/yr</p>
                </div>
            </div>
            <div className='bg-primary-container p-6 rounded-xl flex items-center justify-between group cursor-pointer overflow-hidden relative'>
                <div className='relative z-10'>
                    <p className='text-xs font-bold text-on-primary-container opacity-80 uppercase tracking-tighter'>New Update</p>
                    <p className='text-xl font-black text-white'>Find a Doctor</p>
                </div>
                <span className='material-symbols-outlined text-white text-3xl group-hover:translate-x-2 transition-transform relative z-10'>arrow_forward</span>
                <div className='absolute inset-0 bg-gradient-to-br from-primary to-primary-container opacity-0 group-hover:opacity-100 transition-opacity'></div>
            </div>
        </section>
    );
};

export default QuickStats;
