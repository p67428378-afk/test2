import React from 'react';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function WeeklyCalendar({ tasks = [], onUpdateTaskStatus }) {
  // Get current week dates
  const getWeekDates = () => {
    const current = new Date();
    const week = [];
    // Start from Sunday
    current.setDate(current.getDate() - current.getDay());
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return week;
  };

  const weekDates = getWeekDates();

  // Group tasks by day of week
  const getTasksForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter((t) => t.scheduled_date === dateStr);
  };

  return (
    <div className='card-level-1 rounded-xl p-6 micro-shadow space-y-6'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <span className='material-symbols-outlined text-primary'>calendar_month</span>
          <h3 className='font-label-lg text-on-surface font-bold'>Weekly Farming Schedule</h3>
        </div>
      </div>

      <div className='grid grid-cols-7 gap-4'>
        {weekDates.map((date, idx) => {
          const dayTasks = getTasksForDate(date);
          const isToday = new Date().toDateString() === date.toDateString();

          return (
            <div
              key={idx}
              className={`card-level-1 rounded-lg p-3 min-h-[180px] flex flex-col gap-2 border ${
                isToday ? 'border-primary/50 bg-surface-container-low' : 'border-outline-variant/30'
              }`}
            >
              <div className='flex justify-between items-center border-b border-outline-variant/20 pb-1'>
                <span className='font-label-sm text-on-surface-variant'>{DAYS_OF_WEEK[idx]}</span>
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isToday ? 'bg-primary text-on-primary' : 'text-on-surface'
                  }`}
                >
                  {date.getDate()}
                </span>
              </div>

              <div className='flex-1 overflow-y-auto space-y-2 max-h-[140px]'>
                {dayTasks.length === 0 ? (
                  <span className='text-[11px] text-on-surface-variant/50 italic block text-center pt-4'>
                    No tasks
                  </span>
                ) : (
                  dayTasks.map((task) => (
                    <div
                      key={task.task_id}
                      onClick={() =>
                        onUpdateTaskStatus(
                          task.task_id,
                          task.status === 'Completed' ? 'Pending' : 'Completed'
                        )
                      }
                      className={`p-1.5 rounded text-[11px] cursor-pointer transition-all border ${
                        task.status === 'Completed'
                          ? 'bg-primary/10 border-primary/30 text-primary/80 line-through'
                          : 'bg-surface-container-high border-outline-variant/30 text-on-surface hover:border-primary/50'
                      }`}
                      title={task.description}
                    >
                      <p className='font-bold truncate'>{task.task_type}</p>
                      <p className='text-[10px] text-on-surface-variant truncate'>{task.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}