import React from 'react';

export default function ShelfLifeAlertCard({ inventory = [] }) {
  // Filter items that are approaching expiration (e.g., shelf_life <= 3 days or approaching_expiration is true)
  const alertItems = inventory.filter(item => item.approaching_expiration || item.shelf_life <= 3);

  return (
    <div className='card-level-1 rounded-xl flex flex-col micro-shadow h-full'>
      <div className='p-5 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low/50'>
        <div className='flex items-center gap-3'>
          <span className='material-symbols-outlined text-[#F59E0B]'>inventory</span>
          <h3 className='font-label-lg text-on-surface'>Shelf Life Alerts</h3>
        </div>
        <button className='p-1 rounded hover:bg-surface-container-high transition-colors text-on-surface-variant'>
          <span className='material-symbols-outlined text-[20px]'>more_vert</span>
        </button>
      </div>
      <div className='p-5 flex flex-col gap-5 flex-1 justify-center'>
        {alertItems.length === 0 ? (
          <div className='text-center text-on-surface-variant py-4'>
            No shelf life alerts at this time.
          </div>
        ) : (
          alertItems.map((item) => {
            const daysLeft = item.shelf_life;
            const progressWidth = Math.max(5, Math.min(100, (daysLeft / 10) * 100));
            const isCritical = daysLeft <= 2;

            return (
              <div key={item.inventory_id}>
                <div className='flex justify-between items-end mb-2'>
                  <div>
                    <p className='font-label-lg text-on-surface'>{item.flower_type || 'Unknown'}</p>
                    <p className='font-label-sm text-on-surface-variant font-data-mono'>
                      #{item.inventory_id.substring(0, 8).toUpperCase()} • {item.quantity} stems
                    </p>
                  </div>
                  <span className={`font-label-sm font-bold ${isCritical ? 'text-[#F43F5E]' : 'text-[#F59E0B]'}`}>
                    {daysLeft} days left
                  </span>
                </div>
                <div className='w-full h-1 progress-bg rounded-full overflow-hidden'>
                  <div
                    className={`h-full ${isCritical ? 'progress-fill-warning' : 'progress-fill-amber'}`}
                    style={{ width: `${progressWidth}%` }}
                  ></div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}