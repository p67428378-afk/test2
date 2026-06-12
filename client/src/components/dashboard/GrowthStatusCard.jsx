import React from 'react';

export default function GrowthStatusCard({ batches = [] }) {
  return (
    <div className='card-level-1 rounded-xl flex flex-col micro-shadow overflow-hidden h-full'>
      <div className='p-5 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low/50'>
        <div className='flex items-center gap-3'>
          <span className='material-symbols-outlined text-primary'>monitoring</span>
          <h3 className='font-label-lg text-on-surface'>Real-Time Growth Status</h3>
        </div>
        <button className='p-1 rounded hover:bg-surface-container-high transition-colors text-on-surface-variant'>
          <span className='material-symbols-outlined text-[20px]'>more_vert</span>
        </button>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr class='border-b border-outline-variant/50 bg-[#0F172A]/50'>
              <th className='py-3 px-5 font-label-sm text-on-surface-variant font-semibold'>Batch ID</th>
              <th className='py-3 px-5 font-label-sm text-on-surface-variant font-semibold'>Flower Type</th>
              <th className='py-3 px-5 font-label-sm text-on-surface-variant font-semibold'>Stage</th>
              <th className='py-3 px-5 font-label-sm text-on-surface-variant font-semibold'>Temp</th>
              <th className='py-3 px-5 font-label-sm text-on-surface-variant font-semibold'>Humidity</th>
              <th className='py-3 px-5 font-label-sm text-on-surface-variant font-semibold'>Soil Moisture</th>
              <th className='py-3 px-5 font-label-sm text-on-surface-variant font-semibold'>Light</th>
            </tr>
          </thead>
          <tbody className='font-data-mono text-data-mono'>
            {batches.length === 0 ? (
              <tr>
                <td colSpan='7' className='py-8 text-center text-on-surface-variant'>
                  No active growth batches found.
                </td>
              </tr>
            ) : (
              batches.map((batch) => {
                const sensor = batch.latest_sensor_data || {};
                const isLowMoisture = sensor.soil_moisture !== undefined && sensor.soil_moisture < 30;
                return (
                  <tr
                    key={batch.batch_id}
                    className={`border-b border-outline-variant/30 hover:bg-surface-container-low/50 transition-colors ${
                      isLowMoisture ? 'bg-[#F43F5E]/5' : ''
                    }`}
                  >
                    <td className='py-3 px-5 text-on-surface'>{batch.batch_id.substring(0, 8).toUpperCase()}</td>
                    <td className='py-3 px-5 text-on-surface-variant'>{batch.flower_type || 'Unknown'}</td>
                    <td className='py-3 px-5'>
                      <span className={`px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${
                        batch.growth_stage === 'Flowering'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}>
                        {batch.growth_stage}
                      </span>
                    </td>
                    <td className='py-3 px-5 text-on-surface-variant'>
                      {sensor.temperature !== undefined ? `${sensor.temperature}°C` : '--'}
                    </td>
                    <td className='py-3 px-5 text-on-surface-variant'>
                      {sensor.humidity !== undefined ? `${sensor.humidity}%` : '--'}
                    </td>
                    <td className='py-3 px-5'>
                      {sensor.soil_moisture !== undefined ? (
                        <div className='flex items-center gap-2'>
                          <span className={isLowMoisture ? 'text-[#F43F5E] font-bold' : 'text-on-surface-variant'}>
                            {sensor.soil_moisture}%
                          </span>
                          {isLowMoisture ? (
                            <span className='status-warning px-1.5 py-0.5 rounded text-[10px] font-bold uppercase'>Low</span>
                          ) : (
                            <span className='text-xs text-primary ml-1'>Normal</span>
                          )}
                        </div>
                      ) : (
                        '--'
                      )}
                    </td>
                    <td className='py-3 px-5 text-on-surface-variant'>
                      {sensor.light_intensity !== undefined ? `${sensor.light_intensity} lx` : '--'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}