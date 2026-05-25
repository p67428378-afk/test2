import React, { useState } from 'react';

const AddTask = ({ onAddTask }) => {
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Low');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description) {
      alert('Please add a task description');
      return;
    }
    onAddTask({ description, due_date: dueDate, priority });
    setDescription('');
    setDueDate('');
    setPriority('Low');
  };

  return (
    <div className='max-w-6xl mx-auto'>
      <div className='bg-surface-container-low p-6 rounded-xl space-y-4'>
        <p className='font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1'>Add New Entry</p>
        <form onSubmit={handleSubmit} className='flex flex-col lg:flex-row items-end gap-4'>
          <div className='flex-grow w-full lg:w-auto'>
            <label className='block font-label text-xs font-medium text-on-surface-variant mb-1.5 ml-1'>Task Description</label>
            <input
              className='w-full bg-surface-container-lowest border-none rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-outline placeholder:text-outline-variant'
              placeholder='What needs to be done?'
              type='text'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className='w-full lg:w-48'>
            <label className='block font-label text-xs font-medium text-on-surface-variant mb-1.5 ml-1'>Due Date</label>
            <input
              className='w-full bg-surface-container-lowest border-none rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-outline'
              type='date'
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className='w-full lg:w-48'>
            <label className='block font-label text-xs font-medium text-on-surface-variant mb-1.5 ml-1'>Priority</label>
            <select
              className='w-full bg-surface-container-lowest border-none rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-outline appearance-none'
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </div>
          <button type='submit' className='w-full lg:w-auto premium-gradient text-on-primary font-headline font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95'>
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
