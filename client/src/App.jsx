import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import { useTodos } from './hooks/useTodos';

function App() {
  const { todos, addTodo, toggleTodo, removeTodo } = useTodos();

  return (
    <div className='bg-background text-on-surface min-h-screen flex flex-col'>
      <Header />
      <main className='flex-grow w-full max-w-container-max-width mx-auto px-margin-x py-section-gap'>
        <div className='mb-section-gap'>
          <h2 className='font-headline-xl text-headline-xl text-on-surface mb-2'>My Todo List</h2>
          <p className='font-body-md text-body-md text-on-surface-variant'>Stay focused, be productive, and conquer your day.</p>
        </div>
        <TodoInput addTodo={addTodo} />
        <TodoList todos={todos} toggleTodo={toggleTodo} removeTodo={removeTodo} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
