import React from 'react';

const KPICard = ({ title, value, icon: Icon, prefix = '', suffix = '', decimals = 0 }) => {

  const formatValue = (val) => {
    if (val === null || val === undefined) {
      return <span className="text-gray-400">N/A</span>;
    }
    const numValue = Number(val);
    if (isNaN(numValue)) {
        return <span className="text-gray-400">N/A</span>;
    }
    return numValue.toFixed(decimals);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {Icon && <Icon className="h-6 w-6 text-gray-400" />}
      </div>
      <div className="mt-4">
        {value !== null && value !== undefined ? (
          <p className="text-3xl font-bold text-gray-900">
            {prefix}{formatValue(value)}{suffix}
          </p>
        ) : (
          <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        )}
      </div>
    </div>
  );
};

export default KPICard;
