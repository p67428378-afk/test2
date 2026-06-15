import React from 'react';
import { Terminal, Trash2, History } from 'lucide-react';

export default function ApiLogPanel({ logs, onClearLogs }) {
  return (
    <section className='w-full md:w-[40%] h-full flex flex-col'>
      <div className='flex items-center justify-between mb-sm px-xs'>
        <h2 className='font-headline-md text-headline-md text-on-surface flex items-center gap-sm'>
          <Terminal className='w-6 h-6 text-primary' />
          Live API Integration Log
        </h2>
        <div className='flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-sm py-unit rounded'>
          <History className='w-3.5 h-3.5' />
          Real-time
        </div>
      </div>
      
      {/* Terminal Panel */}
      <div className='glass-panel flex-1 rounded-xl flex flex-col border border-outline-variant/30 overflow-hidden relative group'>
        {/* Terminal Header */}
        <div className='bg-surface-container-lowest border-b border-outline-variant/20 px-md py-sm flex items-center gap-sm'>
          <div className='flex gap-2'>
            <div className='w-3 h-3 rounded-full bg-error-container border border-error/50'></div>
            <div className='w-3 h-3 rounded-full bg-tertiary-container border border-tertiary/50'></div>
            <div className='w-3 h-3 rounded-full bg-secondary-container border border-secondary/50'></div>
          </div>
          <span className='font-label-sm text-label-sm text-outline mx-auto tracking-wider'>bash - root@calc-engine-v1</span>
        </div>
        
        {/* Log Output Area */}
        <div className='p-md flex-1 overflow-y-auto font-label-sm text-label-sm text-on-surface-variant space-y-md bg-surface-container-low/50'>
          {logs.length === 0 ? (
            <div className='text-outline-variant italic p-sm'>No API requests logged yet. Perform a calculation to see live logs.</div>
          ) : (
            logs.map((log, index) => (
              <div
                key={index}
                className={`border-l-2 pl-sm py-unit bg-surface-container-lowest/30 rounded-r-md ${
                  log.success ? 'border-secondary-fixed' : 'border-error'
                }`}
              >
                <div className='flex items-center gap-sm mb-unit text-outline flex-wrap'>
                  <span className='text-primary font-bold'>{log.request.method}</span>
                  <span className='break-all'>{log.request.url}</span>
                  <span className={`font-bold ${log.success ? 'text-secondary-fixed' : 'text-error'}`}>
                    | {log.status} {log.statusText} |
                  </span>
                  <span>{log.duration}ms</span>
                </div>
                <div className='text-on-surface break-all opacity-80 pl-xs border-l border-outline-variant/30 ml-xs'>
                  <span className='text-tertiary-fixed-dim'>JSON:</span>{' '}
                  {log.request.body ? JSON.stringify(log.request.body) : 'null'}{' '}
                  <span className='text-primary'>-&gt;</span>{' '}
                  <span className={log.success ? 'text-on-surface' : 'text-error'}>
                    {log.success ? JSON.stringify(log.data) : JSON.stringify({ detail: log.error })}
                  </span>
                </div>
              </div>
            ))
          )}
          
          {/* Blinking Cursor */}
          <div className='flex items-center gap-xs mt-sm opacity-70'>
            <span className='text-secondary-fixed'>root@calc-api:~$</span>
            <span className='w-2 h-4 bg-on-surface inline-block animate-pulse'></span>
          </div>
        </div>
        
        {/* Clear Logs Button Overlay (Appears on hover or visible at bottom) */}
        {logs.length > 0 && (
          <div className='absolute bottom-md right-md bg-surface-container-high/90 backdrop-blur border border-outline-variant/50 rounded-lg p-unit shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            <button
              onClick={onClearLogs}
              className='flex items-center gap-xs px-sm py-sm text-error hover:bg-error-container/20 rounded font-label-sm text-label-sm transition-colors'
            >
              <Trash2 className='w-4 h-4' />
              Clear Logs
            </button>
          </div>
        )}
      </div>
      
      {logs.length > 0 && (
        <div className='mt-sm flex justify-end md:hidden'>
          <button
            onClick={onClearLogs}
            className='flex items-center gap-xs px-md py-sm bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:text-error hover:border-error/50 rounded-lg font-label-md text-label-md transition-colors'
          >
            <Trash2 className='w-4.5 h-4.5' />
            Clear Logs
          </button>
        </div>
      )}
    </section>
  );
}
