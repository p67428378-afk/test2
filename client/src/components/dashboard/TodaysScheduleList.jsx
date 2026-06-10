import React from 'react';

export default function TodaysScheduleList({ funerals = [], onViewFullCalendar }) {
  const getServiceTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'burial':
        return 'church';
      case 'cremation':
        return 'fire_extinguisher';
      default:
        return 'visibility';
    }
  };

  const getServiceTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'burial':
        return {
          bg: 'bg-primary',
          text: 'text-primary',
          onText: 'text-on-primary',
          badge: 'bg-primary/10 text-primary border-primary/20',
        };
      case 'cremation':
        return {
          bg: 'bg-tertiary',
          text: 'text-tertiary',
          onText: 'text-on-tertiary',
          badge: 'bg-tertiary/10 text-tertiary border-tertiary/20',
        };
      default:
        return {
          bg: 'bg-secondary',
          text: 'text-secondary',
          onText: 'text-on-secondary',
          badge: 'bg-secondary/10 text-secondary border-secondary/20',
        };
    }
  };

  return (
    <div className="bg-surface-container rounded-xl border border-outline-variant flex flex-col h-full">
      <div className="px-6 py-5 border-b border-outline-variant flex justify-between items-center">
        <h3 className="font-headline-md text-headline-md">Today's Schedule</h3>
        <span className="material-symbols-outlined text-on-surface-variant">calendar_today</span>
      </div>
      <div className="p-6 flex-1">
        <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant">
          {funerals.length === 0 ? (
            <div className="pl-10 text-on-surface-variant text-sm">
              No services scheduled for today.
            </div>
          ) : (
            funerals.slice(0, 3).map((funeral, index) => {
              const colors = getServiceTypeColor(funeral.service_type);
              return (
                <div key={funeral.funeral_id || index} className="relative pl-10 group">
                  <div className={`absolute left-0 top-1 w-6 h-6 rounded-full ${colors.bg} flex items-center justify-center z-10 outline outline-4 outline-surface-container`}>
                    <span className={`material-symbols-outlined text-[14px] ${colors.onText}`}>
                      {getServiceTypeIcon(funeral.service_type)}
                    </span>
                  </div>
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-label-md font-bold ${colors.text} uppercase`}>
                      {funeral.service_date ? new Date(funeral.service_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM'}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${colors.badge}`}>
                      {funeral.service_type || 'Service'}
                    </span>
                  </div>
                  <h4 className="font-medium text-on-surface">
                    {funeral.deceased_name || `Case #${(funeral.body_id || '').substring(0, 8).toUpperCase()}`}
                  </h4>
                  <p className="text-sm text-on-surface-variant flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {funeral.assigned_resources || 'Chapel A'}
                  </p>
                  {funeral.notes && (
                    <p className="text-xs italic text-on-surface-variant mt-2">Notes: {funeral.notes}</p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="p-6 bg-surface-container-low border-t border-outline-variant">
        <button
          onClick={onViewFullCalendar}
          className="w-full py-2.5 bg-surface-variant hover:bg-surface-container-highest text-on-surface rounded-lg text-label-md transition-colors flex items-center justify-center gap-2"
        >
          Go to Full Calendar <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}