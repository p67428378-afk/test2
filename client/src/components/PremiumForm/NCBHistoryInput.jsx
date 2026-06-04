import React from 'react';

const NCBHistoryInput = ({ formData, handleChange }) => {
  return (
    <section className="flex flex-col gap-md">
      <div className="flex items-center gap-sm border-b border-outline-variant pb-sm">
        <span className="material-symbols-outlined text-primary">verified_user</span>
        <h2 className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">No Claims Bonus (NCB)</h2>
      </div>
      <div className="flex flex-col gap-xs">
        <label className="font-label-md text-label-md text-on-surface">Claim-Free Years</label>
        <input 
          className="w-full rounded-lg border-outline-variant bg-surface px-md py-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
          placeholder="3" 
          type="number" 
          name="ncbYears"
          value={formData.ncbYears}
          onChange={handleChange}
        />
      </div>
    </section>
  );
};

export default NCBHistoryInput;
