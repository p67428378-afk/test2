import React from 'react';
import { Terminal, BookOpen, Cpu, HelpCircle } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className='hidden lg:flex flex-col w-64 bg-surface-container/50 border-r border-outline-variant/30 p-md gap-lg h-full'>
      <div className='flex flex-col gap-sm'>
        <span className='font-label-sm text-label-sm text-outline-variant uppercase tracking-widest'>Navigation</span>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center gap-sm px-md py-sm rounded-lg font-label-md text-label-md transition-colors text-left ${
            activeTab === 'calculator'
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'text-on-surface-variant hover:bg-surface-variant/30 hover:text-on-surface'
          }`}
        >
          <Terminal className='w-4 h-4' />
          Calculator
        </button>
        <button
          onClick={() => setActiveTab('api-reference')}
          className={`flex items-center gap-sm px-md py-sm rounded-lg font-label-md text-label-md transition-colors text-left ${
            activeTab === 'api-reference'
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'text-on-surface-variant hover:bg-surface-variant/30 hover:text-on-surface'
          }`}
        >
          <BookOpen className='w-4 h-4' />
          API Reference
        </button>
      </div>

      <div className='flex flex-col gap-sm mt-auto'>
        <div className='p-sm bg-surface-container-high/50 rounded-lg border border-outline-variant/20 flex flex-col gap-xs'>
          <div className='flex items-center gap-xs text-primary font-label-sm text-label-sm'>
            <Cpu className='w-3.5 h-3.5' />
            <span>System Info</span>
          </div>
          <p className='text-[11px] text-on-surface-variant font-label-sm'>
            Engine: FastAPI v0.110+<br />
            Frontend: React 18 + Vite<br />
            Styling: Tailwind CSS
          </p>
        </div>
        <div className='flex items-center gap-xs text-outline-variant hover:text-on-surface-variant cursor-pointer transition-colors pl-xs'>
          <HelpCircle className='w-3.5 h-3.5' />
          <span className='text-[11px] font-label-sm'>Documentation & Help</span>
        </div>
      </div>
    </aside>
  );
}
