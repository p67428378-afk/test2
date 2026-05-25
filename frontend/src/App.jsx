import { useState, useEffect } from 'react';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch('/api/count')
      .then(response => response.json())
      .then(data => setCount(data.count))
      .catch(error => console.error('Error fetching count:', error));
  }, []);

  const increment = () => {
    fetch('/api/increment', { method: 'POST' })
      .then(response => response.json())
      .then(data => setCount(data.count))
      .catch(error => console.error('Error incrementing count:', error));
  };

  return (
    <div className='font-body min-h-screen bg-slate-50 flex flex-col items-center justify-center'>
      <div className='text-center'>
        <h2 className='font-headline text-9xl font-extrabold tracking-tighter text-slate-900 select-none'>
          {count}
        </h2>
        <p className='text-xs font-semibold tracking-widest uppercase font-inter text-slate-400 mt-4'>Count</p>
      </div>
      <button 
        onClick={increment} 
        className='mt-12 group relative px-12 py-6 bg-blue-600 text-white rounded-full font-headline text-lg font-bold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all duration-300 hover:scale-[1.02] active:scale-95 overflow-hidden'
      >
        <div className='absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity'></div>
        <span className='relative flex items-center space-x-3'>
          <span className='material-symbols-outlined' style={{fontVariationSettings: "'FILL' 0, 'wght' 700"}}>add</span>
          <span>INCREMENT</span>
        </span>
      </button>
    </div>
  );
}

export default App;
