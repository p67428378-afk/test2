import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className='w-[260px] h-screen fixed left-0 top-0 border-r border-outline-variant bg-surface flex flex-col py-6 z-50'>
      <div className='px-6 mb-6 flex items-center gap-2 font-headline-md text-headline-md font-bold text-primary'>
        <span className='material-symbols-outlined' style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
        PaperFlow
      </div>
      <div className='px-6 mb-4 text-on-surface-variant text-label-sm font-label-sm uppercase tracking-wider'>
        Manuscript Manager
      </div>
      <nav className='flex-1 flex flex-col gap-2'>
        <NavLink
          to='/'
          className={({ isActive }) =>
            `flex items-center gap-2 px-6 py-4 transition-colors duration-200 ease-in-out font-label-md text-label-md hover:bg-surface-variant hover:text-on-surface ${
              isActive
                ? 'text-primary border-l-4 border-primary bg-surface-container-high'
                : 'text-on-surface-variant'
            }`
          }
        >
          <span className='material-symbols-outlined'>dashboard</span>
          Dashboard
        </NavLink>
        <NavLink
          to='/submit'
          className={({ isActive }) =>
            `flex items-center gap-2 px-6 py-4 transition-colors duration-200 ease-in-out font-label-md text-label-md hover:bg-surface-variant hover:text-on-surface ${
              isActive
                ? 'text-primary border-l-4 border-primary bg-surface-container-high'
                : 'text-on-surface-variant'
            }`
          }
        >
          <span className='material-symbols-outlined'>add_box</span>
          New Submission
        </NavLink>
        <NavLink
          to='/revisions'
          className={({ isActive }) =>
            `flex items-center gap-2 px-6 py-4 transition-colors duration-200 ease-in-out font-label-md text-label-md hover:bg-surface-variant hover:text-on-surface ${
              isActive
                ? 'text-primary border-l-4 border-primary bg-surface-container-high'
                : 'text-on-surface-variant'
            }`
          }
        >
          <span className='material-symbols-outlined'>history_edu</span>
          Revisions
        </NavLink>
      </nav>
      <div className='mt-auto px-6 pt-4 border-t border-outline-variant'>
        <div className='flex items-center gap-2 py-2 text-on-surface-variant rounded-lg'>
          <img
            alt='Dr. Alex Mercer'
            className='w-8 h-8 rounded-full border border-outline-variant'
            src='https://lh3.googleusercontent.com/aida-public/AB6AXuA4pgT_CcgcqgUcBx_-0PwZa1-zbL-9zIaTPPdbJgci4jG6sHG1O5L3E26_BuQDZm08RtROo64fIk1ZzdTSfL126PkjzE5i8zSFTI4AiEG190D_iShIQqevqYrclQAvx2XMBLt8NyHEVUYav_E8m2PZ6tQtih2cp1EXGRszCafkroDGVURVlWfucUwp5-bKHZETSfWflFj4XPQOlfF-LN4BN0j4WYmKqMY6AOXvOwwlcuD_Qwr6cXa9cRJYvQMCE5Sr5Xzm0S-skVs'
          />
          <div className='flex flex-col'>
            <span className='font-bold text-on-surface text-sm'>Dr. Alex Mercer</span>
            <span className='text-xs text-on-surface-variant'>Author / Creator</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
