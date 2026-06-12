import React, { useState } from 'react';

export default function ToDoList({ tasks = [], onCreateTask, onUpdateTaskStatus }) {
  const [taskType, setTaskType] = useState('Planting');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !scheduledDate) {
      alert('Please fill in all fields.');
      return;
    }
    onCreateTask({
      task_type: taskType,
      description,
      scheduled_date: scheduledDate,
      status: 'Pending',
      time_spent: 0,
    });
    setDescription('');
  };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-12 gap-gutter'>
      {/* To-Do List (8 col) */}
      <div className='card-level-1 rounded-xl flex flex-col micro-shadow lg:col-span-8 overflow-hidden'>
        <div className='p-5 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low/50'>
          <div className='flex items-center gap-3'>
            <span className='material-symbols-outlined text-primary'>task_alt</span>
            <h3 className='font-label-lg text-on-surface font-bold'>Weekly To-Do List</h3>
          </div>
        </div>
        <div className='p-6 space-y-4 max-h-[400px] overflow-y-auto'>
          {tasks.length === 0 ? (
            <div className='text-center text-on-surface-variant py-8'>
              No tasks scheduled for this week.
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.task_id}
                className='flex items-start gap-4 bg-[#0F172A]/50 border border-outline-variant/30 rounded-lg p-4 hover:border-primary/50 transition-colors'
              >
                <button
                  onClick={() =>
                    onUpdateTaskStatus(
                      task.task_id,
                      task.status === 'Completed' ? 'Pending' : 'Completed'
                    )
                  }
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    task.status === 'Completed'
                      ? 'bg-primary border-primary text-on-primary'
                      : 'border-outline-variant hover:border-primary'
                  }`}
                >
                  {task.status === 'Completed' && (
                    <span className='material-symbols-outlined text-[16px] font-bold'>check</span>
                  )}
                </button>
                <div className='flex-1'>
                  <div className='flex justify-between items-start'>
                    <h4
                      className={`font-label-lg font-bold ${
                        task.status === 'Completed' ? 'text-on-surface-variant line-through' : 'text-on-surface'
                      }`}
                    >
                      {task.task_type}
                    </h4>
                    <span className='text-xs text-on-surface-variant font-data-mono'>
                      {new Date(task.scheduled_date).toLocaleDateString()}
                    </span>
                  </div>
                  <p
                    className={`text-sm mt-1 ${
                      task.status === 'Completed' ? 'text-on-surface-variant/50 line-through' : 'text-on-surface-variant'
                    }`}
                  >
                    {task.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Task Form (4 col) */}
      <div className='card-level-1 rounded-xl p-5 micro-shadow lg:col-span-4 flex flex-col justify-between'>
        <div>
          <div className='flex items-center gap-3 mb-4 border-b border-outline-variant/20 pb-3'>
            <span className='material-symbols-outlined text-primary'>add_task</span>
            <h3 className='font-label-lg text-on-surface font-bold'>Create New Task</h3>
          </div>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block font-label-lg text-on-surface-variant mb-1'>Task Type</label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                className='w-full bg-[#0F172A] border border-outline-variant/50 rounded-lg p-2 text-on-surface focus:outline-none focus:border-primary'
              >
                <option value='Planting'>Planting</option>
                <option value='Harvesting'>Harvesting</option>
                <option value='Watering'>Watering</option>
                <option value='Fertilizing'>Fertilizing</option>
                <option value='Maintenance'>Maintenance</option>
              </select>
            </div>
            <div>
              <label className='block font-label-lg text-on-surface-variant mb-1'>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='w-full bg-[#0F172A] border border-outline-variant/50 rounded-lg p-2 text-on-surface focus:outline-none focus:border-primary h-20 resize-none'
                placeholder='e.g. Water Tulip Batch B'
                required
              />
            </div>
            <div>
              <label className='block font-label-lg text-on-surface-variant mb-1'>Scheduled Date</label>
              <input
                type='date'
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className='w-full bg-[#0F172A] border border-outline-variant/50 rounded-lg p-2 text-on-surface focus:outline-none focus:border-primary'
                required
              />
            </div>
            <button
              type='submit'
              className='w-full bg-primary text-on-primary font-label-lg py-2 px-4 rounded-lg hover:bg-primary-fixed transition-colors duration-200 shadow-sm mt-2'
            >
              Add Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}