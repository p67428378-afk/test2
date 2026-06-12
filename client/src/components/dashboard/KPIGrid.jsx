import React from 'react';
import { Users, Clock, AlertTriangle, FileText, TrendingUp } from 'lucide-react';

export default function KPIGrid({ stats = {} }) {
  const kpis = [
    {
      title: 'Total Onboarded',
      value: stats.totalOnboarded || '12,450',
      change: '8.2%',
      icon: Users,
      color: 'text-primary',
    },
    {
      title: 'Pending Verification',
      value: stats.pendingVerification || '48',
      badge: 'ATTENTION',
      badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      icon: Clock,
      color: 'text-amber-500',
    },
    {
      title: 'Active Alerts',
      value: stats.activeAlerts || '14',
      badge: 'CRITICAL',
      badgeColor: 'bg-error/10 text-error border-error/20',
      icon: AlertTriangle,
      color: 'text-error',
    },
    {
      title: 'Reports Filed',
      value: stats.reportsFiled || '186',
      badge: 'ON TRACK',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: FileText,
      color: 'text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div key={kpi.title} className="bg-surface-container rounded-lg border border-outline-variant p-5 hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{kpi.title}</h3>
              <Icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display-lg text-display-lg text-on-surface">{kpi.value}</span>
              {kpi.change && (
                <span className="font-body-sm text-body-sm text-green-400 flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> {kpi.change}
                </span>
              )}
              {kpi.badge && (
                <span className={`px-2 py-0.5 rounded-full border font-label-md text-[10px] ${kpi.badgeColor}`}>
                  {kpi.badge}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}