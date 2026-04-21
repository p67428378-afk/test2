import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onUpdateTask, onDeleteTask, onCompleteTask }) => {
  return (
    <div className='max-w-6xl mx-auto'>
      <div className='bg-surface-container-low p-1 rounded-2xl'>
        <table className='w-full text-left border-separate border-spacing-y-3 px-4'>
          <thead>
            <tr className='text-on-surface-variant font-label text-[10px] font-bold uppercase tracking-[0.2em]'>
              <th className='pb-2 pl-4 w-12 text-center'>Status</th>
              <th className='pb-2 px-4'>Task Objective</th>
              <th className='pb-2 px-4'>Timeline</th>
              <th className='pb-2 px-4'>Intensity</th>
              <th className='pb-2 pr-4 text-right'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} onUpdateTask={onUpdateTask} onDeleteTask={onDeleteTask} onCompleteTask={onCompleteTask} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
