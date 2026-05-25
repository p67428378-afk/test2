import React from 'react';

const TaskItem = ({ task, onUpdateTask, onDeleteTask, onCompleteTask }) => {
  const priorityColor = {
    Urgent: 'bg-error',
    High: 'bg-tertiary',
    Medium: 'bg-primary',
    Low: 'bg-outline-variant',
  };

  const priorityBg = {
    Urgent: 'bg-error-container',
    High: 'bg-tertiary-fixed',
    Medium: 'bg-secondary-fixed',
    Low: 'bg-surface-container-highest',
  };

  const priorityText = {
    Urgent: 'text-on-error-container',
    High: 'text-on-tertiary-fixed-variant',
    Medium: 'text-on-secondary-fixed-variant',
    Low: 'text-on-surface-variant',
  };

  return (
    <tr className={`group bg-surface-container-lowest hover:shadow-[0_20px_40px_rgba(27,27,31,0.06)] transition-all ${task.is_complete ? 'opacity-50' : ''}`}>
      <td className='py-5 pl-4 rounded-l-xl relative'>
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 ${priorityColor[task.priority]} rounded-full`}></div>
        <div className='flex justify-center'>
          <input
            className='w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary-container'
            type='checkbox'
            checked={task.is_complete}
            onChange={() => onCompleteTask(task.id)}
          />
        </div>
      </td>
      <td className='py-5 px-4'>
        <span className={`font-headline font-bold text-on-surface block ${task.is_complete ? 'line-through' : ''}`}>{task.description}</span>
      </td>
      <td className='py-5 px-4'>
        <div className='flex items-center gap-2 text-on-surface-variant font-medium text-xs'>
          <span className='material-symbols-outlined text-[16px]'>calendar_today</span>
          {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </td>
      <td className='py-5 px-4'>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${priorityBg[task.priority]} ${priorityText[task.priority]}`}>
          {task.priority}
        </span>
      </td>
      <td className='py-5 pr-4 rounded-r-xl text-right'>
        <div className='flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
          <button className='p-2 hover:bg-surface-container-low rounded-lg text-secondary transition-colors'>
            <span className='material-symbols-outlined text-[20px]'>edit</span>
          </button>
          <button onClick={() => onDeleteTask(task.id)} className='p-2 hover:bg-error-container/20 rounded-lg text-error transition-colors'>
            <span className='material-symbols-outlined text-[20px]'>delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TaskItem;
