import React from 'react';

export default function KPICard({ title, value, icon: Icon, trend, trendType = 'up', subtitle, glowColor = 'brand-indigo' }) {
  const glowStyles = {
    'brand-indigo': 'from-brand-indigo/10 to-transparent',
    'secondary': 'from-secondary/10 to-transparent',
    'tertiary': 'from-tertiary/10 to-transparent',
    'warning': 'from-amber-500/5 to-transparent',
  };

  return (
    <div className={`glass-panel rounded-xl p-6 flex flex-col relative overflow-hidden group ${glowColor === 'warning' ? 'border-amber-500/30' : 'glass-panel-glow'}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${glowStyles[glowColor] || glowStyles['brand-indigo']} opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      <div className="relative z-10 flex justify-between items-start mb-4">
        <span className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">{title}</span>
        <div className="w-8 h-8 rounded-lg bg-surface-variant flex items-center justify-center">
          <Icon className={`h-4 w-4 ${glowColor === 'warning' ? 'text-amber-500' : glowColor === 'secondary' ? 'text-secondary' : glowColor === 'tertiary' ? 'text-tertiary' : 'text-brand-indigo'}`} />
        </div>
      </div>

      <div className="relative z-10 flex items-baseline gap-2 mt-auto">
        <span className="text-3xl font-bold text-on-surface tracking-tight">{value}</span>
      </div>

      {trend && (
        <div className={`relative z-10 mt-2 flex items-center text-xs font-semibold ${trendType === 'up' ? 'text-emerald-400' : 'text-amber-500'}`}>
          {trend}
        </div>
      )}
      {subtitle && (
        <div className="relative z-10 mt-2 text-xs text-on-surface-variant">
          {subtitle}
        </div>
      )}
    </div>
  );
}