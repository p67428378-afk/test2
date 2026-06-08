import React from 'react';

export default function KPISection({ pipelinesCount = 0, sensorsCount = 0, activeAlertsCount = 0, maintenanceCount = 0 }) {
  return (
    <div className='grid grid-cols-12 gap-gutter mb-lg'>
      {/* Total Pipelines */}
      <section className='col-span-3 bento-card p-md rounded-lg flex flex-col justify-between min-h-[120px]'>
        <div>
          <span className='font-label-mono text-label-mono text-on-surface-variant'>Total Pipelines</span>
          <h2 className='font-data-metric text-data-metric mt-xs text-on-surface'>{pipelinesCount} Active Segments</h2>
        </div>
        <div className='h-1 w-full bg-outline-variant rounded-full mt-md overflow-hidden'>
          <div className='h-full bg-primary w-full'></div>
        </div>
      </section>

      {/* Active Sensors */}
      <section className='col-span-3 bento-card p-md rounded-lg flex flex-col justify-between min-h-[120px]'>
        <div>
          <span className='font-label-mono text-label-mono text-on-surface-variant'>Active Sensors</span>
          <h2 className='font-data-metric text-data-metric mt-xs text-on-surface'>{sensorsCount} Online</h2>
        </div>
        <p className='font-body-sm text-body-sm text-error mt-sm flex items-center gap-xs'>
          <span className='material-symbols-outlined text-[14px]'>error</span>
          1 Malfunctioning - No Data
        </p>
      </section>

      {/* Active Alerts */}
      <section className='col-span-3 bento-card p-md rounded-lg flex flex-col justify-between border-error/30 bg-error-container/5 min-h-[120px]'>
        <div>
          <span className='font-label-mono text-label-mono text-on-surface-variant'>Active Alerts</span>
          <div className='flex items-center gap-md mt-xs'>
            <h2 className='font-data-metric text-data-metric text-error'>{activeAlertsCount} Critical</h2>
            {activeAlertsCount > 0 && (
              <span className='bg-error text-on-error px-sm py-[2px] rounded-full text-[10px] font-bold'>HIGH RISK</span>
            )}
          </div>
        </div>
        <div className='mt-md flex -space-x-2'>
          <div className='w-6 h-6 rounded-full bg-error border-2 border-surface-container'></div>
          <div className='w-6 h-6 rounded-full bg-error border-2 border-surface-container opacity-50'></div>
        </div>
      </section>

      {/* Maintenance */}
      <section className='col-span-3 bento-card p-md rounded-lg flex flex-col justify-between border-tertiary/30 bg-tertiary-container/5 min-h-[120px]'>
        <div>
          <span className='font-label-mono text-label-mono text-on-surface-variant'>Maintenance</span>
          <div className='flex items-center gap-md mt-xs'>
            <h2 className='font-data-metric text-data-metric text-tertiary'>{maintenanceCount} Overdue</h2>
          </div>
        </div>
        <div className='mt-md'>
          <div className='text-[10px] font-bold text-tertiary-fixed-dim uppercase tracking-widest'>Scheduled: Sector 1A</div>
        </div>
      </section>
    </div>
  );
}
