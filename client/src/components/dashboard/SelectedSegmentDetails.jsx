import React from 'react';

export default function SelectedSegmentDetails({ selectedPipeline = null, sensors = [] }) {
  if (!selectedPipeline) {
    return (
      <section className='col-span-5 bento-card rounded-lg flex flex-col p-md justify-center items-center text-on-surface-variant min-h-[300px]'>
        <span className='material-symbols-outlined text-4xl mb-sm'>info</span>
        <p className='font-body-md text-body-md'>Select a pipeline segment on the map to view real-time sensor readings and pressure history.</p>
      </section>
    );
  }

  // Find if there is any malfunctioning sensor
  const malfunctioningSensor = sensors.find(s => s.status === 'no_data' || s.status === 'critical');

  return (
    <section className='col-span-5 bento-card rounded-lg flex flex-col min-h-[300px]'>
      <div className='p-md border-b border-outline-variant'>
        <h3 className='font-title-sm text-title-sm text-on-surface'>Selected Segment Details: {selectedPipeline.name}</h3>
      </div>
      <div className='flex-1 p-md flex flex-col gap-lg justify-between'>
        {/* Pressure Chart Simulation */}
        <div className='relative flex-1 min-h-[160px] flex items-end gap-1 border-b border-outline-variant/30 pb-2'>
          {sensors.length > 0 && sensors[0].readings_24h && sensors[0].readings_24h.length > 0 ? (
            sensors[0].readings_24h.map((reading, idx) => {
              // Calculate height percentage based on value (assuming max value is around 30 PSI)
              const heightPercent = Math.min(Math.max((reading.value / 30) * 100, 10), 100);
              let barColor = 'bg-primary/20';
              if (reading.value > 22) {
                barColor = 'bg-error';
              } else if (reading.value > 18) {
                barColor = 'bg-tertiary/40';
              }

              return (
                <div
                  key={idx}
                  className={`flex-1 rounded-t transition-all duration-300 ${barColor}`}
                  style={{ height: `${heightPercent}%` }}
                  title={`${reading.value} PSI`}
                ></div>
              );
            })
          ) : (
            <div className='w-full h-full flex flex-col items-center justify-center text-on-surface-variant italic'>
              <span className='material-symbols-outlined text-3xl mb-xs'>report_off</span>
              <span>No 24h Pressure Data Available</span>
            </div>
          )}
          <div className='w-full absolute flex justify-between bottom-0 left-0 px-2 font-label-mono text-[9px] text-on-surface-variant mb-[-18px]'>
            <span>08:00</span><span>12:00</span><span>16:00</span><span>NOW</span>
          </div>
        </div>

        <div className='space-y-md mt-4'>
          <div className='flex justify-between items-center'>
            <span className='font-body-sm text-on-surface-variant'>Operational Pressure</span>
            <span className={`font-label-mono font-bold ${selectedPipeline.status === 'critical' ? 'text-error' : selectedPipeline.status === 'warning' ? 'text-tertiary' : 'text-green-500'}`}>
              {sensors.length > 0 && sensors[0].current_reading !== null ? `${sensors[0].current_reading} PSI` : 'N/A'} / 15.0 (NOMINAL)
            </span>
          </div>
          <div className='h-1 bg-surface-container rounded-full overflow-hidden'>
            <div
              className={`h-full ${selectedPipeline.status === 'critical' ? 'bg-error' : selectedPipeline.status === 'warning' ? 'bg-tertiary' : 'bg-green-500'}`}
              style={{ width: `${Math.min(((sensors[0]?.current_reading || 15) / 30) * 100, 100)}%` }}
            ></div>
          </div>

          {/* Malfunction state */}
          {malfunctioningSensor ? (
            <div className='p-sm bg-surface-container-lowest/50 border border-error/30 rounded-lg flex items-center gap-md'>
              <div className='w-8 h-8 rounded bg-error-container/20 flex items-center justify-center text-error'>
                <span className='material-symbols-outlined'>report_off</span>
              </div>
              <div className='flex-1'>
                <p className='font-body-sm text-on-surface-variant'>Sensor {malfunctioningSensor.id.substring(0, 8)}</p>
                <p className='font-label-mono text-[10px] text-error'>No Data - Malfunction logged</p>
              </div>
              <span className='w-2 h-2 rounded-full bg-error animate-pulse'></span>
            </div>
          ) : (
            <div className='p-sm bg-surface-container-lowest/50 border border-outline-variant/30 rounded-lg flex items-center gap-md'>
              <div className='w-8 h-8 rounded bg-surface-container flex items-center justify-center text-outline'>
                <span className='material-symbols-outlined'>check_circle</span>
              </div>
              <div className='flex-1'>
                <p className='font-body-sm text-on-surface-variant'>All Sensors Operational</p>
                <p className='font-label-mono text-[10px] text-green-500'>Status: Normal</p>
              </div>
              <span className='w-2 h-2 rounded-full bg-green-500'></span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
