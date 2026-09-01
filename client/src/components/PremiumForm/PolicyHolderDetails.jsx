import React from "react";

const PolicyHolderDetails = ({ formData, handleChange }) => {
  return (
    <section className="flex flex-col gap-md">
      <div className="flex items-center gap-sm border-b border-outline-variant pb-sm">
        <span className="material-symbols-outlined text-primary">person</span>
        <h2 className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
          Policy Holder Details
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface">
            Name
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-lg border-outline-variant bg-surface px-md py-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="John Doe"
            type="text"
          />
        </div>
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface">
            Age
          </label>
          <input
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full rounded-lg border-outline-variant bg-surface px-md py-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="30"
            type="number"
          />
        </div>
        <div className="flex flex-col gap-xs md:col-span-2">
          <label className="font-label-md text-label-md text-on-surface">
            Driving Experience (Years)
          </label>
          <input
            name="drivingExperience"
            value={formData.drivingExperience}
            onChange={handleChange}
            className="w-full rounded-lg border-outline-variant bg-surface px-md py-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="10"
            type="number"
          />
        </div>
      </div>
    </section>
  );
};

export default PolicyHolderDetails;
