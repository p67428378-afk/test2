import React from 'react';

export default function PipelineMap({ pipelines = [], selectedPipeline = null, onSelectPipeline, onAcknowledgeAlert }) {
  // Find if there is an active critical alert on Sector 4B or any pipeline
  const sector4B = pipelines.find(p => p.name.includes('Sector 4B') || p.location.includes('Sector 4B'));
  
  return (
    <section className='col-span-7 bento-card rounded-lg overflow-hidden relative flex flex-col min-h-[400px]'>
      <div className='p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50'>
        <h3 className='font-title-sm text-title-sm text-on-surface'>Geographical Pipeline Network Map</h3>
        <div className='flex gap-sm'>
          <span className='flex items-center gap-xs text-[10px] font-semibold text-green-500'>
            <span className='w-2 h-2 rounded-full bg-green-500'></span> NORMAL
          </span>
          <span className='flex items-center gap-xs text-[10px] font-semibold text-yellow-500'>
            <span className='w-2 h-2 rounded-full bg-yellow-500'></span> WARNING
          </span>
          <span className='flex items-center gap-xs text-[10px] font-semibold text-red-500'>
            <span className='w-2 h-2 rounded-full bg-red-500'></span> CRITICAL
          </span>
        </div>
      </div>
      <div className='flex-1 relative bg-slate-900 overflow-hidden min-h-[300px]'>
        {/* Stylized SVG Map */}
        <svg className='w-full h-full opacity-60' viewBox='0 0 800 400'>
          <path d='M50 350 Q 200 300 400 350 T 750 300' fill='none' stroke='#334155' strokeLinecap='round' strokeWidth='40'></path>
          
          {/* Segment A: Green */}
          <path
            d='M50 350 Q 150 316 250 325'
            fill='none'
            stroke='#10B981'
            strokeLinecap='round'
            strokeWidth={selectedPipeline?.name?.includes('Sector 1') ? '10' : '6'}
            className='cursor-pointer hover:stroke-green-400 transition-all'
            onClick={() => {
              const p = pipelines.find(pl => pl.name.includes('Sector 1') || pl.location.includes('Sector 1'));
              if (p) onSelectPipeline(p);
            }}
          ></path>
          <circle cx='250' cy='325' fill='#10B981' r='4'></circle>

          {/* Segment B: Yellow */}
          <path
            d='M250 325 Q 350 335 450 345'
            fill='none'
            stroke='#FBBF24'
            strokeLinecap='round'
            strokeWidth={selectedPipeline?.name?.includes('Sector 2') ? '10' : '6'}
            className='cursor-pointer hover:stroke-yellow-400 transition-all'
            onClick={() => {
              const p = pipelines.find(pl => pl.name.includes('Sector 2') || pl.location.includes('Sector 2'));
              if (p) onSelectPipeline(p);
            }}
          ></path>
          <circle cx='450' cy='345' fill='#FBBF24' r='4'></circle>

          {/* Segment C: Red */}
          <path
            className='animate-pulse cursor-pointer hover:stroke-red-400 transition-all'
            d='M450 345 Q 600 355 750 300'
            fill='none'
            stroke='#EF4444'
            strokeLinecap='round'
            strokeWidth={selectedPipeline?.name?.includes('Sector 4B') ? '10' : '6'}
            onClick={() => {
              if (sector4B) onSelectPipeline(sector4B);
            }}
          ></path>
          <circle cx='750' cy='300' fill='#EF4444' r='4'></circle>
        </svg>

        {/* Interactive Popup Over Segment C */}
        {sector4B && (
          <div className='absolute top-1/2 left-2/3 transform -translate-x-1/2 -translate-y-1/2 bg-surface-container-highest border border-error rounded-xl p-md shadow-2xl z-20 w-64 backdrop-blur-md'>
            <div className='flex items-start gap-sm'>
              <span className='material-symbols-outlined text-error'>emergency_home</span>
              <div>
                <p className='font-body-sm text-body-sm font-bold text-on-surface'>Sector 4B Critical Leak</p>
                <p className='text-[11px] text-error mt-xs'>Pressure: 24.1 PSI (MAX)</p>
                <p className='text-[10px] text-on-surface-variant italic mt-1'>Status: Unacknowledged</p>
                <div className='mt-md flex gap-sm'>
                  <button
                    onClick={() => onAcknowledgeAlert && onAcknowledgeAlert()}
                    className='text-[10px] bg-error text-on-error px-sm py-1 rounded font-bold uppercase hover:opacity-90 transition-all'
                  >
                    Acknowledge
                  </button>
                  <button
                    onClick={() => onSelectPipeline(sector4B)}
                    className='text-[10px] border border-outline-variant px-sm py-1 rounded font-bold uppercase hover:bg-surface-container transition-all text-on-surface'
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
            {/* Pointer triangle */}
            <div className='absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-error/80'></div>
          </div>
        )}

        <div className='absolute bottom-md left-md flex flex-col gap-xs'>
          <span className='font-label-mono text-[10px] text-on-surface-variant'>REGION: GULF SECTOR ALPHA</span>
          <span className='font-label-mono text-[10px] text-on-surface-variant'>COORDS: 29.57° N, 95.10° W</span>
        </div>
      </div>
    </section>
  );
}
