import React from 'react';
import TodoItem from './TodoItem';

const TodoList = ({ todos, toggleTodo, removeTodo }) => {
  if (todos.length === 0) {
    return (
      <div className='mt-section-gap flex flex-col items-center justify-center text-center py-12 px-6 border-2 border-dashed border-outline-variant/30 rounded-3xl opacity-40'>
        <span className='material-symbols-outlined text-6xl mb-4 text-outline-variant' data-icon='task_alt'>task_alt</span>
        <h3 className='font-headline-md text-headline-md text-on-surface-variant'>No pending priorities</h3>
        <p className='font-caption text-caption text-on-surface-variant'>Everything is organized and up to date.</p>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} toggleTodo={toggleTodo} removeTodo={removeTodo} />
      ))}
    </div>
  );
};

export default TodoList;
