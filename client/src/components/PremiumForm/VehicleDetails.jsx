import React from "react";

const SafetyFeature = ({ name, label, checked, onChange }) => (
  <label
    className={`flex items-center gap-xs px-md py-sm rounded-full cursor-pointer hover:bg-opacity-80 transition-all border ${checked ? "bg-primary-container text-on-primary-container border-primary" : "bg-surface-container-high text-on-surface-variant border-outline-variant"}`}
  >
    <input
      name={name}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="hidden"
    />
    {checked && (
      <span className="material-symbols-outlined text-[18px]">
        check_circle
      </span>
    )}
    <span className="font-label-sm text-label-sm">{label}</span>
  </label>
);

const VehicleDetails = ({ formData, handleChange, handleCheckboxChange }) => {
  return (
    <section className="flex flex-col gap-md">
      <div className="flex items-center gap-sm border-b border-outline-variant pb-sm">
        <span className="material-symbols-outlined text-primary">
          directions_car
        </span>
        <h2 className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
          Vehicle Details
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface">
            Make
          </label>
          <input
            name="make"
            value={formData.make}
            onChange={handleChange}
            className="w-full rounded-lg border-outline-variant bg-surface px-md py-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Toyota"
            type="text"
          />
        </div>
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface">
            Model
          </label>
          <input
            name="model"
            value={formData.model}
            onChange={handleChange}
            className="w-full rounded-lg border-outline-variant bg-surface px-md py-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Camry"
            type="text"
          />
        </div>
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface">
            Year
          </label>
          <input
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="w-full rounded-lg border-outline-variant bg-surface px-md py-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="2020"
            type="number"
          />
        </div>
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface">
            Engine Size (CC)
          </label>
          <input
            name="engineSize"
            value={formData.engineSize}
            onChange={handleChange}
            className="w-full rounded-lg border-outline-variant bg-surface px-md py-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="2500"
            type="number"
          />
        </div>
        <div className="flex flex-col gap-xs md:col-span-2">
          <label className="font-label-md text-label-md text-on-surface">
            Safety Features
          </label>
          <div className="flex flex-wrap gap-sm mt-xs">
            <SafetyFeature
              name="abs"
              label="ABS"
              checked={formData.safetyFeatures.abs}
              onChange={handleCheckboxChange}
            />
            <SafetyFeature
              name="airbags"
              label="Airbags"
              checked={formData.safetyFeatures.airbags}
              onChange={handleCheckboxChange}
            />
            <SafetyFeature
              name="laneAssist"
              label="Lane Assist"
              checked={formData.safetyFeatures.laneAssist}
              onChange={handleCheckboxChange}
            />
            <SafetyFeature
              name="parkingSensors"
              label="Parking Sensors"
              checked={formData.safetyFeatures.parkingSensors}
              onChange={handleCheckboxChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VehicleDetails;
