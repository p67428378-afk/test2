import React from 'react';

export default function TopNavBar() {
  return (
    <header className='bg-surface-container border-b border-outline-variant w-full h-[64px] flex justify-between items-center px-6 shrink-0 sticky top-0 z-50'>
      <div className='flex items-center gap-4'>
        <img
          alt='DG Logo'
          className='w-10 h-10 object-contain'
          src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAGbklEQVR4Aeyce2wURRzHv7s8Kg2gVZrURBC0tIDRAIkkiEZEjY3BFv8hxBRF44NIUCk1IEgk0YBYQUASQwwRKTEBRREIEuOD+CBEBEEBMWBiAaE8RORNga7f316v3PXm2r3O7rX7uMxvZ+c3v/nt/D6d3b2b2a2JDD7WHpRau1FN2UbZb/2OcxTL17IbZxlLDWPYyrya+SMZIEGLAK0a5NFpFZ2fhoXPYaCcMojSkwfqQvF3MpDLWHoxiMHMy5mvYbwnKVUSO8vNprQArZ3oTCcVOIs/6aGSzrsyD0u6loFWSuwcOJOEBcvKpASIU7UbOuALtphLcHnMw5kM5MHAPJ6nK20mCgopADnqiniqbqHtCEqUhICBMlj4iRCLpZgoSQAJ7wYarqNBiiF1YU/9yGaN9Qd6JIJoBGhZ6MiKtRyyfZlHSU2gCPVY3cDKtmgEiD2opGYoJUrNExjWwMq2sgE2DMtptibaOCHwifUX+WJoA+SwfIOFbpQoOSPQHZfxupiaJNmdF8cnpRBJRgTGCTuTo28EbxydM2oaGQuBHGEnAEukFCJxL9R6lJg8fQe65zFkniwMlJtIQcjCdjPcApPXvwhga5EaIEAgp7Xto3bIMSMIegQigHr8ONOl6SDszaMRqDkCXAFo9AeyJbmDgN73A0PHAONnAivWAydPoc0+rgDMZu/PXwBqDgGbdwCLVwBjJgP5w4DJc4AzZ7PZk9ixfAcw1u3k7eXLwLylQCF/lK7bmFzndSkQAOOQjhwHyibEYMZ1Xuc+AegcQ3197HR+cZbzNjqWgQMYh7GwGnjnw3jJu9xTgFzlg9ty+Dvg04VA5VPA7UXNg6l4E9jwffM2urWeAtTtnKp9AVciHn0QqHoZ2P4ZMLsC6NxJZRnTjZ0CyJ07VnJ/6zuAiQhM9n7qM8DPnwBFvRNrru4f/xd4d/nVstt77ILbLrPvT07l9YvTj8T5y7zrUyAACp5bewGzJsleqhw+xlG6M1XvhiYwAAVGxThg2GDZS5VVX6bq3NAECqBhAM+NVmPZEo1ANZim2sKbm2pi5UNHY7nb20CNQIFTyGuh5E1FroNNdW6U2xxgS9Ng+XcBpc8DTgHkX6/G4tWUl6cAVXDU4aXXyve4td8CQ3htO3EyvV1b1XgH0OWIDtYCFZzzc9mttjvfAJRIN/wg2/YlvgLYvtDFeuMrgCV3xzrdnra+AXhTAef3prYndLG+eApQNRcYO6zzbY88YORwYMtKIE9ef3HeNCuWngJ0EoEKcqLu2CZg7XuAzAM68VfLiQOVXddclVZf1+YA9UNI9rBtd3I5XnL6B4jbO83DAzDp9RineFq2CxTAujpgySp10IMHqPW62kABnMHFpr/+ViMpvU+t19UGBuCuvcDcpWocXa4Bhg9R1+lqAwFwxx5g1ETgyhU1jpceBzp0UNfpapMA6jrLdnt5CmEWF5NkpmZfjfroMr316nh1nRta3wE8cBj4eAMw5W3gjjJg+nyg7lJ6FB9VAbld0tfr1ngKUDUfqKvrNQIYzdW3t5YAu/Y1H/6CacADnJBt3kqv1lOAel3Taz3hMeCFsXo+nLQOHEBZmZPHPhbNcBK+vk2gAPa8EVi9CPaDR/ponHkIBED5lbF0NrD/Gy5A8RrpLHR3rHwHUKa37r0TmFgOVHON5OiPwFb+fHtilDtAMvXiCsDE6Sev92V6a+MyYOF0oLwUkO95mQbtpr0rAN3skN98RQA1/2IRwAigHgHd1jICL+o6CXH7iyYs1IYYgF7oZCcjMALYeoy1JgxsR/RpHQGyM2GCs2utax/6VgZWC0D+gkR0I8l0NFioQzG+No2+kNeV0yzHZOo1RPYGPuDU2SXTDjkHrzG/QImSMwIX0BEzxNQGaNyCI7DA5RlRRdIiAQMLeObaT+HYAO0Gpk30V3s/2qQnYGEzcjATDZ9GgEY/nIaJh6k/SImSioCFfTAw0uiDxstdI0CxN4ohD0YIxFNSjiSJwHF0QglXFf9J1CYBlAoa/IZ69OH+Jkp7TNnvk4WvyKSY1z35r+5Jx08BKLXGbTiBfriHN5anKUdEF1KRF8SeRX88ZDNRQFACFDvDQL0xAEt4XewLA3MI8ozoQyL/2TEbKOQZ+b6wSBd3WoDxBnJzoUwlzG7UlRKkvP+9jfl+yjnq/J7OM44DlF8oywmujNCus2OWG2sL0f0PAAD//4Q8fQoAAAAGSURBVAMAzK1XMIh6D9wAAAAASUVORK5CYII='
        />
        <h1 className='text-headline-md font-headline-md font-bold text-secondary hidden sm:block tracking-tight'>
          Cluster Assortment Advisor
        </h1>
      </div>
      <div className='flex items-center gap-6 hidden md:flex'>
        <div className='flex items-center gap-2'>
          <span className='text-on-surface-variant font-label-caps uppercase text-xs'>Store Cluster:</span>
          <select className='bg-[#1E293B] border border-[#334155] text-on-surface font-body-sm rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none'>
            <option>Small Town Value</option>
            <option>Suburban Core</option>
            <option>Urban Density</option>
          </select>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-on-surface-variant font-label-caps uppercase text-xs'>Category:</span>
          <select className='bg-[#1E293B] border border-[#334155] text-on-surface font-body-sm rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none'>
            <option>Snacks</option>
            <option>Beverages</option>
            <option>Household</option>
          </select>
        </div>
        <nav className='flex gap-4 ml-6'>
          <a className='text-primary font-bold border-b-2 border-primary pb-1 text-body-md font-body-md' href='#'>
            Cluster
          </a>
          <a className='text-on-surface-variant font-body-md hover:text-primary-fixed-dim transition-colors duration-200 pb-1 border-b-2 border-transparent' href='#'>
            Category
          </a>
          <a className='text-on-surface-variant font-body-md hover:text-primary-fixed-dim transition-colors duration-200 pb-1 border-b-2 border-transparent' href='#'>
            Scenarios
          </a>
          <a className='text-on-surface-variant font-body-md hover:text-primary-fixed-dim transition-colors duration-200 pb-1 border-b-2 border-transparent' href='#'>
            Performance
          </a>
        </nav>
      </div>
      <div className='flex items-center gap-4'>
        <button className='text-on-surface-variant hover:text-primary-fixed-dim transition-colors duration-200 p-2 rounded-full hover:bg-surface-variant/50'>
          <span className='material-symbols-outlined'>search</span>
        </button>
        <button className='text-on-surface-variant hover:text-primary-fixed-dim transition-colors duration-200 p-2 rounded-full hover:bg-surface-variant/50 relative'>
          <span className='material-symbols-outlined'>notifications</span>
          <span className='absolute top-1 right-1 w-2 h-2 bg-error rounded-full'></span>
        </button>
        <div className='w-px h-6 bg-outline-variant mx-1 hidden sm:block'></div>
        <div className='flex items-center gap-2 cursor-pointer group'>
          <div className='text-right hidden sm:block'>
            <div className='text-body-sm font-body-sm font-bold text-on-surface group-hover:text-primary transition-colors'>
              Sarah Jenkins
            </div>
            <div className='text-label-caps font-label-caps text-on-surface-variant text-xs'>
              Category Manager
            </div>
          </div>
          <div className='w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-body-sm ring-2 ring-transparent group-hover:ring-primary transition-all'>
            SJ
          </div>
        </div>
      </div>
    </header>
  );
}