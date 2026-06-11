import React from 'react';

export default function Header({ title, searchQuery, setSearchQuery }) {
  return (
    <header className='flex justify-between items-center h-16 px-8 bg-[#0F172A] border-b border-outline-override z-10 shrink-0'>
      <div className='flex items-center gap-8 flex-1'>
        <h2 className='font-semibold text-xl text-white hidden lg:block'>{title}</h2>
        {/* Search Bar */}
        <div className='relative flex-1 max-w-md'>
          <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant'>search</span>
          <input 
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full bg-surface-override border border-outline-override rounded-lg py-2 pl-10 pr-4 text-white placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-indigo-override focus:border-transparent text-sm' 
            placeholder='Search cubicles or zones...'
          />
        </div>
      </div>
      <div className='flex items-center gap-4'>
        <button className='relative p-2 text-on-surface-variant hover:text-white transition-colors duration-200 ease-in-out rounded-full hover:bg-surface-container-high'>
          <span className='material-symbols-outlined'>notifications</span>
          <span className='absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-override text-[10px] font-bold text-white'>2</span>
        </button>
        <button className='p-2 text-on-surface-variant hover:text-white transition-colors duration-200 ease-in-out rounded-full hover:bg-surface-container-high'>
          <span className='material-symbols-outlined'>settings</span>
        </button>
        <div className='h-8 w-8 rounded-full overflow-hidden border border-outline-override ml-2'>
          <img 
            alt='Alex Rivera' 
            className='h-full w-full object-cover' 
            src='https://lh3.googleusercontent.com/aida-public/AB6AXuCI0KmD4i7cJlYfdIT9XBF-gP7qp0j2yhHGUa6EqNCKj472zJHAT-IoHCE7r7q-TjaJ_-bvrzCrMgYMTxZEsiVWm5saXULauC4hSPoOnHlfnGrTh-G-uBhP3jUWN49_F0ZhFZ-og22c5_ASdPc4JxpYau4LaKbGDbKN0If10ef1Sg7lElqFy5KFlRK1HlFJOheQzkw4N3rHRsxlVtVTkwiX4P2f8snPmy4eM1uYLdr7cT9sQTfdaz8FJFqfuKVYLch8A66Vo53KlWk'
          />
        </div>
      </div>
    </header>
  );
}