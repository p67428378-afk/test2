import React, { useState, useEffect } from 'react';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';
import taskService from './services/taskService';

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const fetchedTasks = await taskService.getAll();
      setTasks(fetchedTasks);
    };
    fetchTasks();
  }, []);

  const handleAddTask = async (task) => {
    const newTask = await taskService.create(task);
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = async (id, updatedTask) => {
    const newTask = await taskService.update(id, updatedTask);
    setTasks(tasks.map((task) => (task.id === id ? newTask : task)));
  };

  const handleDeleteTask = async (id) => {
    await taskService.remove(id);
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleCompleteTask = async (id) => {
    const updatedTask = await taskService.complete(id);
    setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
  };

  return (
    <div className='bg-surface text-on-surface font-body overflow-hidden h-screen flex'>
      <aside className='hidden md:flex flex-col h-screen p-6 gap-y-4 bg-[#f5f3f7] w-64 shrink-0 transition-all'>
        <div className='mb-8 px-2'>
          <h1 className='font-headline text-lg font-bold text-[#1b1b1f]'>Cognitive Architect</h1>
          <p className='text-xs text-on-surface-variant font-medium uppercase tracking-widest mt-1'>Premium Editorial UI</p>
        </div>
        <nav className='flex flex-col gap-y-2 flex-grow'>
          <button className='flex items-center gap-3 px-4 py-3 bg-white text-[#004394] rounded-md shadow-sm transition-all translate-x-1'>
            <span className='material-symbols-outlined' data-icon='today'>today</span>
            <span className='font-["Inter"] text-sm font-medium'>Daily View</span>
          </button>
          <button className='flex items-center gap-3 px-4 py-3 text-[#535f70] hover:bg-white/80 rounded-md transition-all'>
            <span className='material-symbols-outlined' data-icon='star'>star</span>
            <span className='font-["Inter"] text-sm font-medium'>Priority Focus</span>
          </button>
          <button className='flex items-center gap-3 px-4 py-3 text-[#535f70] hover:bg-white/80 rounded-md transition-all'>
            <span className='material-symbols-outlined' data-icon='folder'>folder</span>
            <span className='font-["Inter"] text-sm font-medium'>Projects</span>
          </button>
          <button className='flex items-center gap-3 px-4 py-3 text-[#535f70] hover:bg-white/80 rounded-md transition-all'>
            <span className='material-symbols-outlined' data-icon='group'>group</span>
            <span className='font-["Inter"] text-sm font-medium'>Team Feed</span>
          </button>
          <button className='flex items-center gap-3 px-4 py-3 text-[#535f70] hover:bg-white/80 rounded-md transition-all'>
            <span className='material-symbols-outlined' data-icon='archive'>archive</span>
            <span className='font-["Inter"] text-sm font-medium'>Archive</span>
          </button>
        </nav>
        <div className='mt-auto flex flex-col gap-y-2'>
          <button className='flex items-center gap-3 px-4 py-3 text-[#535f70] hover:bg-white/80 rounded-md transition-all'>
            <span className='material-symbols-outlined' data-icon='help'>help</span>
            <span className='font-["Inter"] text-sm font-medium'>Help</span>
          </button>
          <button className='flex items-center gap-3 px-4 py-3 text-[#535f70] hover:bg-white/80 rounded-md transition-all'>
            <span className='material-symbols-outlined' data-icon='logout'>logout</span>
            <span className='font-["Inter"] text-sm font-medium'>Sign Out</span>
          </button>
        </div>
      </aside>
      <main className='flex-grow flex flex-col overflow-hidden relative'>
        <header className='flex justify-between items-center px-8 py-4 w-full bg-[#f5f3f7] z-50'>
          <div className='flex items-center gap-8'>
            <span className='font-headline font-black text-xl text-[#004394]'>The Architect</span>
            <nav className='hidden lg:flex gap-6'>
              <a className='font-headline font-bold text-sm tracking-tight text-[#535f70] hover:text-[#004394] transition-colors' href='#'>Dashboard</a>
              <a className='font-headline font-bold text-sm tracking-tight text-[#004394] border-b-2 border-[#004394]' href='#'>Tasks</a>
              <a className='font-headline font-bold text-sm tracking-tight text-[#535f70] hover:text-[#004394] transition-colors' href='#'>Calendar</a>
              <a className='font-headline font-bold text-sm tracking-tight text-[#535f70] hover:text-[#004394] transition-colors' href='#'>Analytics</a>
            </nav>
          </div>
          <div className='flex items-center gap-4'>
            <div className='relative hidden sm:block'>
              <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline' data-icon='search'>search</span>
              <input className='bg-surface-container-lowest border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-outline w-64' placeholder='Search tasks...' type='text' />
            </div>
            <button className='material-symbols-outlined p-2 rounded-full hover:bg-white/50 text-secondary transition-all' data-icon='notifications'>notifications</button>
            <button className='material-symbols-outlined p-2 rounded-full hover:bg-white/50 text-secondary transition-all' data-icon='settings'>settings</button>
            <div className='w-8 h-8 rounded-full overflow-hidden ml-2 ring-1 ring-outline-variant'>
              <img alt='User Profile' data-alt='close-up portrait of a professional woman with a clean and bright background, studio lighting' src='https://lh3.googleusercontent.com/aida-public/AB6AXuAdNjjLDsNDqJ48VrmeS39u56lm1cgoxczzqFeJYV6xaSjcjfi-HrkHZ6z2ifGQm3LKOwiE-dpzekZ2YqrMekNKrhjcjtkrL3NDK5188VHnR8zOmRyOECkUmBa7hHHGmBGxN54yiuZ6cabV3i7E4o_uBRK3_AcZ_ER_dMGOdAJjk8MMtUS0HfCkhYXQs7MrpnX2cHjfxE88atqcG_abc514G-lTlxUfBcHn3Vzq7iLKsiEi7n2vkoptddS5ToLMsjZNa4xr1cbsVA' />
            </div>
          </div>
        </header>
        <section className='flex-grow overflow-y-auto p-8 lg:p-12 space-y-10'>
          <div className='max-w-6xl mx-auto'>
            <h2 className='font-headline text-5xl font-extrabold tracking-tight text-on-surface mb-2'>My Todo List</h2>
            <p className='font-label text-sm text-on-surface-variant font-medium'>Design your day with intentionality.</p>
          </div>
          <AddTask onAddTask={handleAddTask} />
          <TaskList tasks={tasks} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} onCompleteTask={handleCompleteTask} />
        </section>
      </main>
    </div>
  );
}

export default App;