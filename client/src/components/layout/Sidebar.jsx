import React from 'react';

export default function Sidebar() {
  return (
    <nav className='bg-[#1E293B] fixed left-0 top-0 h-full w-[260px] border-r border-[#334155] flex flex-col py-8 z-40 hidden md:flex'>
      <div className='px-6 mb-8 flex items-center gap-3'>
        <div className='w-10 h-10 rounded bg-[#F59E0B] flex items-center justify-center flex-shrink-0'>
          <span className='material-symbols-outlined text-black font-bold'>corporate_fare</span>
        </div>
        <div>
          <h1 className='text-lg font-bold text-white'>DG Assortment</h1>
          <p className='text-xs text-[#d8c3ad]'>Enterprise Suite</p>
        </div>
      </div>
      <div className='flex-1 overflow-y-auto mt-4 px-3 flex flex-col gap-1'>
        <a className='flex items-center gap-3 px-3 py-2 rounded-lg text-[#d8c3ad] hover:text-white hover:bg-[#273647] transition-colors duration-200 cursor-pointer' href='#'>
          <span className='material-symbols-outlined'>grid_view</span>
          <span className='text-sm'>Dashboard</span>
        </a>
        <a className='flex items-center gap-3 px-3 py-2 rounded-lg border-l-4 border-[#F59E0B] bg-[#F59E0B]/10 text-[#F59E0B] font-bold cursor-pointer' href='#'>
          <span className='material-symbols-outlined'>format_list_bulleted</span>
          <span className='text-sm'>Products</span>
        </a>
        <a className='flex items-center gap-3 px-3 py-2 rounded-lg text-[#d8c3ad] hover:text-white hover:bg-[#273647] transition-colors duration-200 cursor-pointer' href='#'>
          <span className='material-symbols-outlined'>layers</span>
          <span className='text-sm'>Scenarios</span>
        </a>
        <a className='flex items-center gap-3 px-3 py-2 rounded-lg text-[#d8c3ad] hover:text-white hover:bg-[#273647] transition-colors duration-200 cursor-pointer' href='#'>
          <span className='material-symbols-outlined'>check_circle</span>
          <span className='text-sm'>Approvals</span>
        </a>
        <a className='flex items-center gap-3 px-3 py-2 rounded-lg text-[#d8c3ad] hover:text-white hover:bg-[#273647] transition-colors duration-200 cursor-pointer' href='#'>
          <span className='material-symbols-outlined'>settings</span>
          <span className='text-sm'>Settings</span>
        </a>
      </div>
      <div className='mt-auto px-3'>
        <div className='border-t border-[#334155] pt-4 mt-4'>
          <a className='flex items-center gap-3 px-3 py-2 rounded-lg text-[#d8c3ad] hover:text-white hover:bg-[#273647] transition-colors duration-200 cursor-pointer' href='#'>
            <span className='material-symbols-outlined'>account_circle</span>
            <span className='text-sm'>John Doe</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
