import React from 'react';

const PremiumResult = ({ premium }) => {
  if (premium === null) {
    return null;
  }

  return (
    <div className="mt-stack-gap pt-stack-gap border-t border-outline-variant opacity-100 transition-opacity duration-500">
      <h3 className="text-label-sm font-label-sm text-on-surface-variant mb-4">Your Estimated Premium:</h3>
      <div className="bg-secondary-container p-6 rounded-lg text-center">
        <div className="text-display-lg font-display-lg text-on-secondary-container">
          {`$${premium.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / year`}
        </div>
        <p className="text-caption text-on-secondary-container mt-2 opacity-80">Based on standard risk assessment parameters.</p>
      </div>
    </div>
  );
};

export default PremiumResult;
