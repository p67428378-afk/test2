import React from 'react';

const PolicyDetailsSummary = ({ userDetails }) => {
  if (!userDetails) return null;

  return (
    <div className="mt-xl">
      <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-md px-base">Policy Details Summary</h3>
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg divide-y divide-outline-variant">
        <div className="py-sm flex justify-between items-center">
          <span className="font-label-md text-label-md text-on-surface-variant">Name</span>
          <span className="font-body-sm text-body-sm text-on-surface font-semibold">{userDetails.name}</span>
        </div>
        <div className="py-sm flex justify-between items-center">
          <span className="font-label-md text-label-md text-on-surface-variant">Age</span>
          <span className="font-body-sm text-body-sm text-on-surface">{userDetails.age} Years</span>
        </div>
        <div className="py-sm flex justify-between items-center">
          <span className="font-label-md text-label-md text-on-surface-variant">Experience</span>
          <span className="font-body-sm text-body-sm text-on-surface">{userDetails.drivingExperience} years</span>
        </div>
        <div className="py-sm flex justify-between items-center">
          <span className="font-label-md text-label-md text-on-surface-variant">Vehicle</span>
          <span className="font-body-sm text-body-sm text-on-surface">{userDetails.make} {userDetails.model} ({userDetails.year})</span>
        </div>
        <div className="py-sm flex justify-between items-center">
          <span className="font-label-md text-label-md text-on-surface-variant">Engine</span>
          <span className="font-body-sm text-body-sm text-on-surface">{userDetails.engineSize}cc</span>
        </div>
        <div className="py-sm flex justify-between items-center">
          <span className="font-label-md text-label-md text-on-surface-variant">Safety</span>
          <span className="font-body-sm text-body-sm text-on-surface">{userDetails.safetyFeatures.join(', ')}</span>
        </div>
        <div className="py-sm flex justify-between items-center">
          <span className="font-label-md text-label-md text-on-surface-variant">Claim-Free</span>
          <span className="font-body-sm text-body-sm text-on-surface">{userDetails.ncbYears} Years</span>
        </div>
      </div>
    </div>
  );
};

export default PolicyDetailsSummary;
