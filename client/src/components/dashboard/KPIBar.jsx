import React from 'react';

export default function KPIBar({
  activeBatchesCount = 12,
  inventoryStemsCount = 1450,
  criticalAlertsCount = 1,
  criticalAlertText = "Low Soil Moisture in Tulip Batch B",
  pendingTasksCount = 3
}) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter'>
      {/* KPI 1 */}
      <div className='card-level-1 rounded-xl p-5 micro-shadow flex flex-col justify-between h-[120px]'>
        <div className='flex items-center justify-between'>
          <h3 className='font-label-lg text-on-surface-variant'>Active Growth Batches</h3>
          <span className='material-symbols-outlined text-primary/70'>potted_plant</span>
        </div>
        <div>
          <p className='font-headline-md text-on-surface'>{activeBatchesCount} Batches</p>
          <p className='font-label-sm text-on-surface-variant mt-1'>8 Sprouting, 4 Flowering</p>
        </div>
      </div>

      {/* KPI 2 */}
      <div className='card-level-1 rounded-xl p-5 micro-shadow flex flex-col justify-between h-[120px]'>
        <div className='flex items-center justify-between'>
          <h3 className='font-label-lg text-on-surface-variant'>Harvested Inventory</h3>
          <span className='material-symbols-outlined text-primary/70'>inventory_2</span>
        </div>
        <div>
          <p className='font-headline-md text-on-surface'>{inventoryStemsCount.toLocaleString()} Stems</p>
          <p className='font-label-sm text-on-surface-variant mt-1'>Across 4 Flower Types</p>
        </div>
      </div>

      {/* KPI 3 */}
      <div className='card-level-1 rounded-xl p-5 micro-shadow flex flex-col justify-between h-[120px] border-[#F43F5E]/30 relative overflow-hidden'>
        <div className='absolute top-0 right-0 w-16 h-16 bg-[#F43F5E]/5 rounded-bl-full'></div>
        <div className='flex items-center justify-between'>
          <h3 className='font-label-lg text-on-surface-variant'>Critical Alerts</h3>
          <span className='material-symbols-outlined text-[#F43F5E]'>warning</span>
        </div>
        <div>
          <p className='font-headline-md text-on-surface'>{criticalAlertsCount} Active</p>
          <p className='font-label-sm text-[#F43F5E] mt-1 font-medium truncate'>{criticalAlertText}</p>
        </div>
      </div>

      {/* KPI 4 */}
      <div className='card-level-1 rounded-xl p-5 micro-shadow flex flex-col justify-between h-[120px]'>
        <div className='flex items-center justify-between'>
          <h3 className='font-label-lg text-on-surface-variant'>Today's Tasks</h3>
          <span className='material-symbols-outlined text-primary/70'>task_alt</span>
        </div>
        <div>
          <p className='font-headline-md text-on-surface'>{pendingTasksCount} Pending</p>
          <p className='font-label-sm text-on-surface-variant mt-1'>2 Planting, 1 Harvesting</p>
        </div>
      </div>
    </div>
  );
}