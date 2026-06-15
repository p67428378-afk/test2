import React, { useState } from 'react';

export default function TaskForm({ onAddTask }) {
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    onAddTask(description);
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className='bg-level-1 p-2 rounded-2xl flex items-center gap-4'>
      <div className='flex-1 flex items-center gap-3 px-4'>
        <span className='material-symbols-outlined text-primary'>add_circle</span>
        <input
          className='w-full bg-transparent border-none text-on-surface focus:ring-0 p-0 font-body-md text-body-md placeholder:text-on-surface-variant/50 outline-none'
          placeholder='Add a new task...'
          type='text'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button
        type='submit'
        className='bg-[#6366F1] hover:bg-[#4F46E5] text-white px-6 py-3 rounded-xl font-label-md text-label-md transition-colors flex items-center gap-2 shrink-0'
      >
        + Add Task
      </button>
    </form>
  );
}
