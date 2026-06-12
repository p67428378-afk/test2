import React from 'react';

export default function AlertPanel({ batches = [] }) {
  // Find batches with low soil moisture (< 30%)
  const lowMoistureBatches = batches.filter(
    (b) => b.latest_sensor_data && b.latest_sensor_data.soil_moisture < 30
  );

  return (
    <div className='card-level-1 rounded-xl p-5 micro-shadow border-[#F43F5E]/30 relative overflow-hidden'>
      <div className='flex items-center gap-3 mb-4'>
        <span className='material-symbols-outlined text-[#F43F5E]'>warning</span>
        <h3 className='font-label-lg text-on-surface font-bold'>Active Environmental Alerts</h3>
      </div>
      <div className='space-y-3'>
        {lowMoistureBatches.length === 0 ? (
          <div className='text-on-surface-variant text-sm py-2'>
            All environmental conditions are within normal parameters.
          </div>
        ) : (
          lowMoistureBatches.map((batch) => (
            <div
              key={batch.batch_id}
              className='bg-[#F43F5E]/10 border border-[#F43F5E]/30 rounded-lg p-4 flex items-start gap-3'
            >
              <span className='material-symbols-outlined text-[#F43F5E] mt-0.5'>sms_failed</span>
              <div className='flex-1'>
                <h4 className='font-label-lg text-on-surface font-bold'>Low Soil Moisture Alert</h4>
                <p className='text-sm text-on-surface-variant mt-1'>
                  Soil moisture in <span className='text-primary font-semibold'>{batch.flower_type || 'Unknown'}</span> (Batch {batch.batch_id.substring(0, 8).toUpperCase()}) is currently at <span className='text-[#F43F5E] font-bold'>{batch.latest_sensor_data.soil_moisture}%</span>.
                </p>
                <p className='text-xs text-[#F43F5E] mt-2 font-medium flex items-center gap-1'>
                  <span className='material-symbols-outlined text-[14px]'>phone_iphone</span>
                  SMS alert sent to Farmer John's phone.
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}