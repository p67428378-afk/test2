import React from 'react';

const TodoItem = ({ todo, toggleTodo, removeTodo }) => {
  return (
    <div className={`task-card flex items-center justify-between p-4 border border-transparent rounded-xl shadow-sm transition-all duration-200 ${todo.completed ? 'bg-surface-container-low opacity-80' : 'bg-surface-container-lowest'}`}>
      <div className='flex items-center gap-4'>
        <button 
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${todo.completed ? 'bg-secondary text-white' : 'border-2 border-outline-variant hover:border-primary-container'}`}
          onClick={() => toggleTodo(todo.id, todo.completed)} >
          {todo.completed && <span className='material-symbols-outlined' style={{ fontSize: '16px', fontWeight: 800 }}>check</span>}
        </button>
        <span className={`font-body-md text-body-md ${todo.completed ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>{todo.title}</span>
      </div>
      <div className='flex items-center gap-2'>
        <button className='p-2 text-on-surface-variant hover:text-primary-container transition-colors rounded-lg hover:bg-surface-container-low' data-icon='edit'>
          <span className='material-symbols-outlined'>edit</span>
        </button>
        <button 
          className='p-2 text-on-surface-variant hover:text-error transition-colors rounded-lg hover:bg-error-container/10' 
          data-icon='delete'
          onClick={() => removeTodo(todo.id)} >
          <span className='material-symbols-outlined'>delete</span>
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
