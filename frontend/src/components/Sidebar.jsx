import React from 'react';

const Sidebar = () => {
  return (
    <aside className='fixed left-0 top-0 h-full w-64 flex flex-col pt-20 pb-8 bg-slate-50 z-40 border-r-0'>
      <div className='px-8 mb-8'>
        <div className='flex items-center gap-3 mb-2'>
          <img
            src='https://lh3.googleusercontent.com/aida-public/AB6AXuBOpnkQ0jO2ovUBsQUEjQKbXv8upQNdaOLEXdaJKf6MnSBDLc5GNWGG6-FTsD1_HKg9o_9Cx7Fir10GqamFT_ojQAZlVYyf03wj3dpusGGooMJEYB-OxngJ4YClJtjBFHDOjbZ8Ro1vbxiAYRvMYV27HNUwuG_AfqjvawoDyINYYr78_WknSezddP9rQUPlFoXAtSrFUzreMQ8gHfR9xQtGoEBdSFdSmcKikVzjRK4M9uhwriyiGbSpMYoH1-Cgw6QbTzHc4E1wpwc'
            alt='Alex Sterling'
            className='w-10 h-10 rounded-full object-cover'
          />
          <div>
            <h3 className='font-headline font-bold text-blue-900 leading-tight'>Alex Sterling</h3>
            <p className='font-label text-xs text-slate-500'>Member ID: #88291</p>
          </div>
        </div>
      </div>
      <nav className='flex-1'>
        <ul className='space-y-1'>
          <li><a href='#' className='flex items-center gap-4 text-slate-600 px-8 py-3 hover:bg-slate-200/50 rounded-lg mx-2 transition-all'><span className='material-symbols-outlined'>dashboard</span>Overview</a></li>
          <li><a href='#' className='flex items-center gap-4 bg-white text-blue-800 rounded-l-full ml-4 pl-4 py-3 font-bold shadow-sm'><span className='material-symbols-outlined'>verified_user</span>Policies</a></li>
          <li><a href='#' className='flex items-center gap-4 text-slate-600 px-8 py-3 hover:bg-slate-200/50 rounded-lg mx-2 transition-all'><span className='material-symbols-outlined'>favorite</span>Health Trackers</a></li>
          <li><a href='#' className='flex items-center gap-4 text-slate-600 px-8 py-3 hover:bg-slate-200/50 rounded-lg mx-2 transition-all'><span className='material-symbols-outlined'>receipt_long</span>Claims History</a></li>
          <li><a href='#' className='flex items-center gap-4 text-slate-600 px-8 py-3 hover:bg-slate-200/50 rounded-lg mx-2 transition-all'><span className='material-symbols-outlined'>shield</span>Security Settings</a></li>
        </ul>
      </nav>
      <div className='px-6 mt-auto'>
        <button className='w-full flex items-center justify-center gap-2 py-3 bg-secondary-container text-on-secondary-container rounded-xl font-bold hover:bg-opacity-80 transition-all'>
          <span className='material-symbols-outlined'>medical_services</span>
          Find a Doctor
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
