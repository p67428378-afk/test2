import React from 'react';

export default function Sidebar({ currentPage, setCurrentPage, onNewBooking }) {
  return (
    <nav className='hidden md:flex flex-col bg-surface-override fixed left-0 top-0 h-screen w-[280px] border-r border-outline-override z-20'>
      <div className='flex flex-col h-full py-6'>
        {/* Header */}
        <div className='px-6 mb-8 flex flex-col gap-1'>
          <h1 className='font-semibold text-2xl text-primary'>DeskFlow</h1>
          <p className='text-sm text-on-surface-variant'>Workspace Management</p>
        </div>
        
        {/* CTA */}
        <div className='px-4 mb-6'>
          <button 
            onClick={onNewBooking}
            className='w-full bg-indigo-override text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer active:scale-95 transition-transform'
          >
            <span className='material-symbols-outlined' style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
            New Booking
          </button>
        </div>

        {/* Navigation Links */}
        <ul className='flex-1 flex flex-col gap-1 px-2'>
          <li>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                currentPage === 'dashboard'
                  ? 'text-white bg-indigo-override/10 border-l-4 border-indigo-override'
                  : 'text-on-surface-variant hover:text-white hover:bg-surface-container-high'
              }`}
            >
              <span className='material-symbols-outlined'>desktop_windows</span>
              <span className='font-medium text-sm'>Book a Desk</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setCurrentPage('bookings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                currentPage === 'bookings'
                  ? 'text-white bg-indigo-override/10 border-l-4 border-indigo-override'
                  : 'text-on-surface-variant hover:text-white hover:bg-surface-container-high'
              }`}
            >
              <span className='material-symbols-outlined'>calendar_today</span>
              <span className='font-medium text-sm'>My Bookings</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => {}}
              className='w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-white hover:bg-surface-container-high transition-colors rounded-lg cursor-pointer active:scale-95 transition-transform text-left'
            >
              <span className='material-symbols-outlined'>settings</span>
              <span className='font-medium text-sm'>Settings</span>
            </button>
          </li>
        </ul>

        {/* Footer */}
        <div className='mt-auto px-4 pt-4 border-t border-outline-override'>
          <div className='flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-white hover:bg-surface-container-high transition-colors rounded-lg cursor-pointer active:scale-95 transition-transform'>
            <span className='material-symbols-outlined'>account_circle</span>
            <span className='font-medium text-sm'>Alex Rivera</span>
          </div>
        </div>
      </div>
    </nav>
  );
}