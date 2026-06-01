import React, { useState } from 'react';

const TodoInput = ({ addTodo }) => {
  const [title, setTitle] = useState('');

  const handleAddTodo = () => {
    if (title.trim()) {
      addTodo(title);
      setTitle('');
    }
  };

  return (
    <section className='mb-section-gap'>
      <div className='flex gap-stack-gap'>
        <div className='relative flex-grow'>
          <input
            className='w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface-container-lowest font-body-md text-body-md focus:outline-none focus:ring-4 focus:ring-primary-container/20 focus:border-primary-container transition-all'
            placeholder='Add a new task...'
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
          />
        </div>
        <button
          className='bg-primary-container text-on-primary font-label-sm text-label-sm px-6 py-3 rounded-xl hover:bg-primary transition-all active:scale-95 flex items-center gap-2'
          onClick={handleAddTodo}
        >
          <span>Add Task</span>
          <span className='material-symbols-outlined' style={{ fontSize: '20px' }}>add</span>
        </button>
      </div>
    </section>
  );
};

export default TodoInput;
