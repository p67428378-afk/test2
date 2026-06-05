import React from 'react';
import { TrendingUp } from 'lucide-react';

const MetricCard = ({ title, value, change, changeType, icon }) => {
  const isPositive = changeType === 'positive';
  const changeColor = isPositive ? 'text-[#28A745]' : 'text-[#DC3545]';
  const bgColor = isPositive ? 'bg-tertiary-fixed/30' : 'bg-error-container/30';

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-lg flex flex-col justify-between transition-shadow hover:shadow-md">
      <div className="flex justify-between items-start mb-sm">
        <span className="font-label-caps text-label-caps text-on-surface-variant">{title}</span>
        {change && (
          <span className={`font-bold text-xs px-2 py-0.5 rounded-full ${changeColor} ${bgColor}`}>
            {isPositive ? '+' : ''}{change}
          </span>
        )}
      </div>
      <div className="flex items-end justify-between">
        <span className={`font-display-lg text-display-lg ${isPositive ? 'text-[#28A745]' : 'text-on-surface'}`}>{value}</span>
        {icon && React.cloneElement(icon, { className: "text-primary opacity-20", size: 40 })}
      </div>
    </div>
  );
};

export default MetricCard;
