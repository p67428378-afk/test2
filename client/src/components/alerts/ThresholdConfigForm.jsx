import React, { useState } from 'react';

export default function ThresholdConfigForm() {
  const [minPressure, setMinPressure] = useState(10.0);
  const [maxPressure, setMaxPressure] = useState(22.0);
  const [successMessage, setSaveSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <section className='bento-card p-md rounded-lg flex flex-col gap-md'>
      <h3 className='font-title-sm text-title-sm text-on-surface'>Alert Threshold Configuration</h3>
      <p className='font-body-sm text-body-sm text-on-surface-variant'>
        Configure the pressure thresholds to minimize false positives. Deviations outside these ranges will trigger critical alerts.
      </p>
      <form onSubmit={handleSubmit} className='space-y-md'>
        <div>
          <label className='block font-label-mono text-label-mono text-on-surface-variant mb-xs'>MIN PRESSURE (PSI)</label>
          <input
            type='number'
            step='0.1'
            value={minPressure}
            onChange={(e) => setMinPressure(parseFloat(e.target.value))}
            className='w-full bg-surface-container-low border border-outline-variant rounded p-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none'
          />
        </div>
        <div>
          <label className='block font-label-mono text-label-mono text-on-surface-variant mb-xs'>MAX PRESSURE (PSI)</label>
          <input
            type='number'
            step='0.1'
            value={maxPressure}
            onChange={(e) => setMaxPressure(parseFloat(e.target.value))}
            className='w-full bg-surface-container-low border border-outline-variant rounded p-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none'
          />
        </div>
        <button
          type='submit'
          className='w-full bg-primary text-on-primary py-sm rounded font-bold hover:opacity-90 transition-all active:scale-95'
        >
          Save Configuration
        </button>
        {successMessage && (
          <p className='text-green-500 text-body-sm text-center font-semibold'>Configuration saved successfully!</p>
        )}
      </form>
    </section>
  );
}
