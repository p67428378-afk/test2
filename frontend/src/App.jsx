import { useState, useEffect } from 'react';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch('/api/')
      .then(response => response.json())
      .then(data => setCount(data.count));
  }, []);

  const increment = () => {
    fetch('/api/increment', { method: 'POST' })
      .then(response => response.json())
      .then(data => setCount(data.count));
  };

  return (
    <div className='bg-background text-on-background font-body min-h-screen flex flex-col items-center'>
      <header className='w-full top-0 sticky z-50 bg-[#f8f9ff] dark:bg-slate-950'>
        <div className='flex items-center justify-between px-6 h-16 w-full max-w-md mx-auto'>
          <button className='hover:bg-[#dce9ff] dark:hover:bg-blue-900/30 transition-colors active:scale-95 transition-transform p-2 rounded-full'>
            <span className='material-symbols-outlined text-slate-500 dark:text-slate-400'>menu</span>
          </button>
          <h1 className='text-xl font-bold text-[#00345e] dark:text-blue-100 font-headline tracking-tight'>Counter</h1>
          <button className='hover:bg-[#dce9ff] dark:hover:bg-blue-900/30 transition-colors active:scale-95 transition-transform p-2 rounded-full'>
            <span className='material-symbols-outlined text-slate-500 dark:text-slate-400'>settings</span>
          </button>
        </div>
      </header>
      <main className='flex-1 w-full max-w-md flex flex-col items-center justify-center px-8 relative overflow-hidden'>
        <div className='absolute -top-24 -right-24 w-64 h-64 bg-surface-container-high rounded-full blur-[80px] opacity-40'></div>
        <div className='absolute -bottom-32 -left-32 w-80 h-80 bg-primary-container rounded-full blur-[100px] opacity-30'></div>
        <div className='w-full flex flex-col items-center space-y-16 py-12 z-10'>
          <div className='flex flex-col items-center'>
            <span className='text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 mb-2'>Current Session</span>
            <div className='h-[2px] w-8 bg-primary rounded-full'></div>
          </div>
          <div className='relative flex items-center justify-center'>
            <h2 className='font-headline font-extrabold text-[12rem] leading-none text-on-surface tracking-tighter transition-all duration-300'>
              {count}
            </h2>
            <div className='absolute inset-0 translate-y-4 blur-2xl text-primary/10 font-headline font-extrabold text-[12rem] leading-none pointer-events-none select-none'>
              {count}
            </div>
          </div>
          <div className='w-full flex flex-col items-center gap-8'>
            <button onClick={increment} className='hero-gradient group relative w-full h-20 rounded-full flex items-center justify-center shadow-[0px_12px_32px_rgba(0,52,94,0.15)] active:scale-95 transition-all duration-200 overflow-hidden'>
              <div className='absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity'></div>
              <span className='text-on-primary font-headline font-bold text-lg tracking-wide uppercase'>Increment</span>
              <span className='material-symbols-outlined ml-2 text-on-primary'>add</span>
            </button>
            <div className='flex gap-4 w-full'>
              <button className='flex-1 bg-surface-container-high hover:bg-surface-container-highest transition-colors h-14 rounded-full flex items-center justify-center active:scale-95 transition-transform'>
                <span className='material-symbols-outlined text-primary'>remove</span>
              </button>
              <button className='flex-1 glass-panel hover:bg-white/60 transition-colors h-14 rounded-full flex items-center justify-center active:scale-95 transition-transform text-primary font-headline font-semibold text-sm uppercase tracking-wider'>
                Reset
              </button>
            </div>
          </div>
        </div>
        <section className='w-full mt-8 mb-24 grid grid-cols-2 gap-4'>
          <div className='bg-surface-container-low p-5 rounded-full flex flex-col justify-between'>
            <span className='text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70'>Average Rate</span>
            <div className='mt-2 flex items-baseline gap-1'>
              <span className='text-xl font-headline font-bold text-on-surface'>12.4</span>
              <span className='text-[10px] font-medium text-on-surface-variant'>p/h</span>
            </div>
          </div>
          <div className='bg-surface-container-low p-5 rounded-full flex flex-col justify-between'>
            <span className='text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70'>Total Count</span>
            <div className='mt-2 flex items-baseline gap-1'>
              <span className='text-xl font-headline font-bold text-on-surface'>1,402</span>
              <span className='material-symbols-outlined text-primary text-xs' style={{fontVariationSettings: "'FILL' 1"}}>trending_up</span>
            </div>
          </div>
        </section>
      </main>
      <nav className='fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-[0px_-12px_32px_rgba(0,52,94,0.06)] rounded-t-3xl border-none'>
        <a className='flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 hover:text-[#0053db] dark:hover:text-blue-300 active:scale-90 transition-all duration-200' href='#'>
          <span className='material-symbols-outlined mb-1'>history</span>
          <span className='font-["Inter"] text-[10px] uppercase tracking-wider font-semibold'>History</span>
        </a>
        <a className='flex flex-col items-center justify-center bg-[#dce9ff] dark:bg-blue-900/40 text-[#0053db] dark:text-blue-300 rounded-2xl px-5 py-2 active:scale-90 transition-all duration-200' href='#'>
          <span className='material-symbols-outlined mb-1' style={{fontVariationSettings: "'FILL' 1"}}>add_circle</span>
          <span className='font-["Inter"] text-[10px] uppercase tracking-wider font-semibold'>Counter</span>
        </a>
        <a className='flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 hover:text-[#0053db] dark:hover:text-blue-300 active:scale-90 transition-all duration-200' href='#'>
          <span className='material-symbols-outlined mb-1'>analytics</span>
          <span className='font-["Inter"] text-[10px] uppercase tracking-wider font-semibold'>Stats</span>
        </a>
      </nav>
    </div>
  );
}

export default App;
