import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

function GuideCalendar({ availability = [], onToggleAvailability }) {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Generate a simple grid of days for June 2026
  const daysInMonth = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-06-${dayNum.toString().padStart(2, '0')}`;
    const slot = availability.find(a => a.date === dateStr);
    return {
      dayNum,
      dateStr,
      isAvailable: slot ? slot.isAvailable : false,
      hasSlot: !!slot
    };
  });

  return (
    <section className="bg-[#1E293B] border border-[#334155] rounded-[16px] p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-primary" />
          Guide Calendar
        </h2>
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-variant text-on-surface">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-label-md text-label-md text-on-surface">June 2026</span>
          <button className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-variant text-on-surface">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center mb-2">
        {daysOfWeek.map(day => (
          <div key={day} className="text-on-surface-variant font-label-md text-xs py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {/* Empty cells for padding (June 1, 2026 is a Monday, so 1 empty cell for Sunday) */}
        <div className="aspect-square"></div>
        
        {daysInMonth.map(day => (
          <button
            key={day.dayNum}
            onClick={() => onToggleAvailability && onToggleAvailability(day.dateStr)}
            className={`aspect-square rounded-lg flex flex-col items-center justify-between p-2 border transition-all ${
              day.hasSlot
                ? day.isAvailable
                  ? 'bg-primary/10 border-primary text-primary hover:bg-primary/20'
                  : 'bg-error/10 border-error text-error hover:bg-error/20'
                : 'bg-surface-container-low border-outline-variant text-on-surface-variant hover:border-primary'
            }`}
          >
            <span className="font-label-md text-sm font-bold">{day.dayNum}</span>
            {day.hasSlot && (
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-4 text-xs">
        <div className="flex items-center gap-1.5 text-primary">
          <span className="w-3 h-3 rounded bg-primary/20 border border-primary inline-block"></span>
          Available
        </div>
        <div className="flex items-center gap-1.5 text-error">
          <span className="w-3 h-3 rounded bg-error/20 border border-error inline-block"></span>
          Unavailable
        </div>
        <div className="flex items-center gap-1.5 text-on-surface-variant">
          <span className="w-3 h-3 rounded bg-surface-container-low border border-outline-variant inline-block"></span>
          No Slot Set
        </div>
      </div>
    </section>
  );
}

export default GuideCalendar;
