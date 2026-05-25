import React from 'react';

const Notifications = () => {
  return (
    <section className='col-span-5 bg-surface-container-lowest rounded-xl p-6 shadow-sm shadow-primary/5'>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-xl font-bold text-primary'>Recent Activity</h3>
        <button className='text-sm font-semibold text-secondary'>View History</button>
      </div>
      <div className='space-y-4'>
        {/* Alert Item */}
        <div className='flex gap-4 p-4 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors group'>
          <div className='w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center flex-shrink-0'>
            <span className='material-symbols-outlined text-on-tertiary-fixed-variant' style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <div className='flex-1'>
            <div className='flex justify-between'>
              <p className='font-semibold text-slate-900 text-sm'>Premium payment successful</p>
              <span className='text-xs text-slate-400'>2h ago</span>
            </div>
            <p className='text-xs text-slate-500 mt-1'>Receipt #PAY-00342 has been generated for your records.</p>
          </div>
        </div>
        {/* Alert Item */}
        <div className='flex gap-4 p-4 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors group'>
          <div className='w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center flex-shrink-0'>
            <span className='material-symbols-outlined text-on-secondary-fixed-variant' style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
          </div>
          <div className='flex-1'>
            <div className='flex justify-between'>
              <p className='font-semibold text-slate-900 text-sm'>New document available</p>
              <span className='text-xs text-slate-400'>Yesterday</span>
            </div>
            <p className='text-xs text-slate-500 mt-1'>Your '2023 Summary of Benefits' is now ready for download.</p>
          </div>
        </div>
        {/* Alert Item */}
        <div className='flex gap-4 p-4 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors group'>
          <div className='w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center flex-shrink-0'>
            <span className='material-symbols-outlined text-on-primary-fixed-variant'>person</span>
          </div>
          <div className='flex-1'>
            <div className='flex justify-between'>
              <p className='font-semibold text-slate-900 text-sm'>Provider Network Update</p>
              <span className='text-xs text-slate-400'>Sep 24</span>
            </div>
            <p className='text-xs text-slate-500 mt-1'>3 new specialist clinics added to your local Gold Network.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Notifications;
