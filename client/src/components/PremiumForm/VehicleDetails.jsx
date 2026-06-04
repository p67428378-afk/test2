import React from 'react';

const VehicleDetails = ({ formData, handleChange, handleCheckboxChange }) => {
  return (
    <section className="flex flex-col gap-md">
      <div className="flex items-center gap-sm border-b border-outline-variant pb-sm">
        <span className="material-symbols-outlined text-primary">directions_car</span>
        <h2 className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">Vehicle Details</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface">Make</label>
          <input 
            className="w-full rounded-lg border-outline-variant bg-surface px-md py-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
            placeholder="Toyota" 
            type="text" 
            name="make"
            value={formData.make}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface">Model</label>
          <input 
            className="w-full rounded-lg border-outline-variant bg-surface px-md py-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
            placeholder="Camry" 
            type="text" 
            name="model"
            value={formData.model}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface">Year</label>
          <input 
            className="w-full rounded-lg border-outline-variant bg-surface px-md py-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
            placeholder="2020" 
            type="number" 
            name="year"
            value={formData.year}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface">Engine Size (CC)</label>
          <input 
            className="w-full rounded-lg border-outline-variant bg-surface px-md py-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
            placeholder="2500" 
            type="number" 
            name="engineSize"
            value={formData.engineSize}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-xs md:col-span-2">
          <label className="font-label-md text-label-md text-on-surface">Safety Features</label>
          <div className="flex flex-wrap gap-sm mt-xs">
            <label className={`flex items-center gap-xs px-md py-sm rounded-full cursor-pointer transition-all border ${formData.safetyFeatures.includes('ABS') ? 'bg-primary-container text-on-primary-container border-primary' : 'bg-surface-container-high text-on-surface-variant border-outline-variant'}`}>
              <input 
                className="hidden" 
                type="checkbox" 
                name="safetyFeatures" 
                value="ABS"
                checked={formData.safetyFeatures.includes('ABS')}
                onChange={handleCheckboxChange}
              />
              {formData.safetyFeatures.includes('ABS') && <span className="material-symbols-outlined text-[18px]">check_circle</span>}
              <span className="font-label-sm text-label-sm">ABS</span>
            </label>
            <label className={`flex items-center gap-xs px-md py-sm rounded-full cursor-pointer transition-all border ${formData.safetyFeatures.includes('Airbags') ? 'bg-primary-container text-on-primary-container border-primary' : 'bg-surface-container-high text-on-surface-variant border-outline-variant'}`}>
              <input 
                className="hidden" 
                type="checkbox" 
                name="safetyFeatures" 
                value="Airbags"
                checked={formData.safetyFeatures.includes('Airbags')}
                onChange={handleCheckboxChange}
              />
              {formData.safetyFeatures.includes('Airbags') && <span className="material-symbols-outlined text-[18px]">check_circle</span>}
              <span className="font-label-sm text-label-sm">Airbags</span>
            </label>
            <label className={`flex items-center gap-xs px-md py-sm rounded-full cursor-pointer transition-all border ${formData.safetyFeatures.includes('Lane Assist') ? 'bg-primary-container text-on-primary-container border-primary' : 'bg-surface-container-high text-on-surface-variant border-outline-variant'}`}>
              <input 
                className="hidden" 
                type="checkbox" 
                name="safetyFeatures" 
                value="Lane Assist"
                checked={formData.safetyFeatures.includes('Lane Assist')}
                onChange={handleCheckboxChange}
              />
              {formData.safetyFeatures.includes('Lane Assist') && <span className="material-symbols-outlined text-[18px]">check_circle</span>}
              <span className="font-label-sm text-label-sm">Lane Assist</span>
            </label>
            <label className={`flex items-center gap-xs px-md py-sm rounded-full cursor-pointer transition-all border ${formData.safetyFeatures.includes('Parking Sensors') ? 'bg-primary-container text-on-primary-container border-primary' : 'bg-surface-container-high text-on-surface-variant border-outline-variant'}`}>
              <input 
                className="hidden" 
                type="checkbox" 
                name="safetyFeatures" 
                value="Parking Sensors"
                checked={formData.safetyFeatures.includes('Parking Sensors')}
                onChange={handleCheckboxChange}
              />
              {formData.safetyFeatures.includes('Parking Sensors') && <span className="material-symbols-outlined text-[18px]">check_circle</span>}
              <span className="font-label-sm text-label-sm">Parking Sensors</span>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VehicleDetails;
