import React from 'react';
import TaskRow from './TaskRow';

export default function TaskList({ tasks, currentFilter, onFilterChange, onToggleComplete, onUpdateDescription, onDeleteTask }) {
  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  const totalCount = tasks.length;
  const activeCount = tasks.filter((t) => !task.completed).length; // Wait, let's fix this typo: t => !t.completed
  // Let's write it correctly:
  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCountReal = totalCount - completedCount;

  return (
    <div className='bg-level-1 rounded-2xl overflow-hidden flex flex-col border border-white/5'>
      <div className='flex border-b border-white/5 px-6 pt-4 gap-6'>
        <button
          onClick={() => onFilterChange('all')}
          className={`pb-4 font-label-md text-label-md transition-colors ${
            currentFilter === 'all' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          All ({totalCount})
        </button>
        <button
          onClick={() => onFilterChange('active')}
          className={`pb-4 font-label-md text-label-md transition-colors ${
            currentFilter === 'active' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Active ({activeCountReal})
        </button>
        <button
          onClick={() => onFilterChange('completed')}
          className={`pb-4 font-label-md text-label-md transition-colors ${
            currentFilter === 'completed' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>
      <div className='flex flex-col divide-y divide-white/5'>
        {filteredTasks.length === 0 ? (
          <div className='p-8 text-center text-on-surface-variant/60 font-body-md'>
            No tasks found.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onUpdateDescription={onUpdateDescription}
              onDeleteTask={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}
