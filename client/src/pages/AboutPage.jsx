import React from 'react';
import TechBadge from '../components/common/TechBadge';

const AboutPage = () => {
  const techStack = [
    'React 18',
    'Vite',
    'Tailwind CSS',
    'FastAPI',
    'Python 3.11',
    'Vitest',
    'Docker',
    'Google Cloud Run',
  ];

  return (
    <main className='flex-grow flex items-center justify-center p-container-padding relative overflow-hidden'>
      {/* Ambient Glow */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-container rounded-full blur-[120px] opacity-10 pointer-events-none'></div>
      
      <div className='w-full max-w-[450px] bg-[#1E293B] border border-[#334155] rounded-2xl shadow-2xl p-8 relative z-10 text-center'>
        <h1 className='text-3xl font-bold text-primary mb-4 tracking-tight'>
          About Simple Calc
        </h1>
        <p className='text-on-surface-variant text-sm mb-6 leading-relaxed'>
          Simple Calc is a high-performance, modern web calculator designed with a premium dark-mode aesthetic. It leverages a stateless FastAPI backend to perform precise arithmetic operations and a responsive React frontend for an intuitive user experience.
        </p>
        
        <div className='border-t border-[#334155] pt-6 mb-6'>
          <h2 className='text-lg font-semibold text-on-surface mb-3'>
            Technology Stack
          </h2>
          <div className='flex flex-wrap gap-2 justify-center'>
            {techStack.map((tech) => (
              <TechBadge key={tech} label={tech} />
            ))}
          </div>
        </div>

        <div className='text-xs text-on-surface-variant/60'>
          Version 1.0.0 • Built with ❤️ by SDLC Assistant
        </div>
      </div>
    </main>
  );
};

export default AboutPage;
