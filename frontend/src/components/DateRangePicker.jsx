
import React, { useState } from 'react';

const DateRangePicker = ({ startDate, setStartDate, endDate, setEndDate }) => {
  const [month, setMonth] = useState(new Date(startDate).getMonth());
  const [year, setYear] = useState(new Date(startDate).getFullYear());

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateClick = (day) => {
    const date = new Date(year, month, day);
    if (!startDate || (startDate && endDate)) {
      setStartDate(date.toISOString().split('T')[0]);
      setEndDate(null);
    } else if (date < new Date(startDate)) {
        setStartDate(date.toISOString().split('T')[0]);
    } else {
      setEndDate(date.toISOString().split('T')[0]);
    }
  };

  const renderCalendar = () => {
    const totalDays = daysInMonth(month, year);
    const firstDay = firstDayOfMonth(month, year);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day).toISOString().split('T')[0];
      const isSelected = (startDate && date === startDate) || (endDate && date === endDate) || (startDate && endDate && date > startDate && date < endDate);
      const isStart = startDate && date === startDate;
      const isEnd = endDate && date === endDate;

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`p-3 text-xs font-medium rounded-sm transition-colors ${
            isSelected ? 'bg-primary text-white' : 'text-on-surface hover:bg-surface-container-highest'
          } ${
            isStart ? 'rounded-l-full' : ''
          } ${
            isEnd ? 'rounded-r-full' : ''
        }`}>
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="bg-surface-container-low rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
            <h4 className="font-headline font-bold text-lg">{new Date(year, month).toLocaleString('default', { month: 'long' })} {year}</h4>
            <div className="flex gap-2">
                <button onClick={() => setMonth(month - 1)} className="p-2 hover:bg-surface-container-high rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button onClick={() => setMonth(month + 1)} className="p-2 hover:bg-surface-container-high rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
            </div>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center mb-4">
            <span className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Su</span>
            <span className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Mo</span>
            <span className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Tu</span>
            <span className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">We</span>
            <span className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Th</span>
            <span className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Fr</span>
            <span className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Sa</span>
        </div>
        <div className="grid grid-cols-7 gap-2">
            {renderCalendar()}
        </div>
    </div>
  );
};

export default DateRangePicker;
