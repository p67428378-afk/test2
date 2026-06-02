
import React from 'react';

const RecentAlertsList = () => {
  return (
    <div className='lg:col-span-4 flex flex-col gap-gutter'>
      <div className='bg-surface-container-lowest p-lg rounded-xl card-shadow border border-outline-variant h-full'>
        <div className='flex justify-between items-center mb-lg'>
          <h2 className='font-headline-md text-headline-md text-primary'>Recent Alerts</h2>
          <span className='material-symbols-outlined text-on-surface-variant cursor-pointer hover:bg-surface-container-low p-xs rounded-full' data-icon='more_vert'>more_vert</span>
        </div>
        <div className='flex flex-col gap-md'>
          {/* Alert Item: Leak */}
          <div className='p-md rounded-lg bg-error-container/20 border-l-4 border-error flex gap-md items-start group hover:bg-error-container/30 transition-colors'>
            <div className='w-8 h-8 rounded-full bg-error flex items-center justify-center shrink-0'>
              <span className='material-symbols-outlined text-on-error text-[18px]' data-icon='leak_add'>leak_add</span>
            </div>
            <div className='flex flex-col gap-xs'>
              <div className='flex justify-between items-center'>
                <span className='font-label-bold text-label-bold text-error uppercase'>Leak Detected</span>
                <span className='font-mono-data text-body-sm text-on-surface-variant'>14:22</span>
              </div>
              <p className='font-body-sm text-body-sm text-on-surface'>Sector 4-B pressure drop detected. Sustained flow of 0.8L/m recorded.</p>
              <button className='text-error font-label-bold text-label-bold mt-xs hover:underline text-left'>DISPATCH TECH</button>
            </div>
          </div>

          {/* Alert Item: Spike */}
          <div className='p-md rounded-lg bg-surface-container-low border-l-4 border-primary-container flex gap-md items-start group'>
            <div className='w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0'>
              <span className='material-symbols-outlined text-on-primary-container text-[18px]' data-icon='warning'>warning</span>
            </div>
            <div className='flex flex-col gap-xs'>
              <div className='flex justify-between items-center'>
                <span className='font-label-bold text-label-bold text-primary-container uppercase'>Usage Spike</span>
                <span className='font-mono-data text-body-sm text-on-surface-variant'>11:05</span>
              </div>
              <p className='font-body-sm text-body-sm text-on-surface'>Residential Node 122 exceeded daily quota by 15%.</p>
            </div>
          </div>

          {/* Alert Item: Maintenance */}
          <div className='p-md rounded-lg bg-surface-container-low border-l-4 border-outline flex gap-md items-start opacity-75'>
            <div className='w-8 h-8 rounded-full bg-outline flex items-center justify-center shrink-0'>
              <span className='material-symbols-outlined text-on-primary text-[18px]' data-icon='build'>build</span>
            </div>
            <div className='flex flex-col gap-xs'>
              <div className='flex justify-between items-center'>
                <span className='font-label-bold text-label-bold text-on-surface-variant uppercase'>Maintenance</span>
                <span className='font-mono-data text-body-sm text-on-surface-variant'>08:00</span>
              </div>
              <p className='font-body-sm text-body-sm text-on-surface'>Scheduled filter replacement completed for Main Intake.</p>
            </div>
          </div>
          <button className='w-full py-sm text-primary font-label-bold text-label-bold border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors mt-auto'>
            VIEW ALL LOGS
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentAlertsList;
