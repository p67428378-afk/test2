import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../hooks/useTheme'; // Custom hook to get tailwind colors

const data = [
  { name: '09:00', value: 4500 }, { name: '10:00', value: 4510 },
  { name: '11:00', value: 4490 }, { name: '12:00', value: 4520 },
  { name: '13:00', value: 4515 }, { name: '14:00', value: 4530 },
  { name: '15:00', value: 4525 }, { name: '16:00', value: 4540 },
];

const MarketOverviewChart = () => {
  const theme = useTheme();

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 h-full flex flex-col shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-title-sm text-title-sm text-on-surface">Market Index Performance</h3>
        <div className="flex gap-2 items-center">
          <span className="w-3 h-3 bg-primary rounded-full"></span>
          <span className="font-label-caps text-xs text-on-surface-variant">S&P 500</span>
        </div>
      </div>
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.primary} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={theme.primary} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.outlineVariant} strokeOpacity={0.3} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: theme.onSurfaceVariant }} />
            <YAxis domain={['dataMin - 20', 'dataMax + 20']} tick={{ fontSize: 10, fill: theme.onSurfaceVariant }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme.surfaceContainer,
                borderColor: theme.outlineVariant,
                fontSize: '12px',
                color: theme.onSurface
              }}
            />
            <Area type="monotone" dataKey="value" stroke={theme.primary} strokeWidth={2} fillOpacity={1} fill="url(#chartGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
       <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="border-l-2 border-primary pl-3">
          <p className="font-label-caps text-xs text-on-surface-variant">CURRENT VAL</p>
          <p className="font-title-sm text-on-surface font-bold">4,540.22</p>
        </div>
        <div className="border-l-2 border-tertiary pl-3">
          <p className="font-label-caps text-xs text-on-surface-variant">24H CHANGE</p>
          <p className="font-title-sm text-tertiary font-bold">+0.85%</p>
        </div>
      </div>
    </div>
  );
};

export default MarketOverviewChart;
