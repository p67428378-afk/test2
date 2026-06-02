
import React from 'react';

const TopNavBar = () => {
  return (
    <header className='fixed top-0 left-0 w-full h-16 flex justify-between items-center px-lg py-sm bg-surface dark:bg-background border-b border-outline-variant dark:border-outline shadow-sm z-50'>
      <div className='flex items-center gap-md'>
        <span className='text-headline-md font-headline-md font-bold text-primary dark:text-primary-fixed'>WaterWise</span>
      </div>
      <div className='flex items-center gap-lg'>
        <div className='hidden md:flex items-center gap-lg'>
          <a href='#' className='text-primary dark:text-primary-fixed font-bold border-b-2 border-primary font-body-md text-body-md py-xs'>Dashboard</a>
          <a href='#' className='text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors px-sm py-xs rounded-lg font-body-md text-body-md'>Analytics</a>
          <a href='#' className='text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors px-sm py-xs rounded-lg font-body-md text-body-md'>Infrastructure</a>
        </div>
        <div className='flex items-center gap-md'>
          <span className='material-symbols-outlined text-primary dark:text-primary-fixed cursor-pointer active:opacity-80 p-xs rounded-full hover:bg-surface-container-low' data-icon='notifications'>notifications</span>
          <span className='material-symbols-outlined text-primary dark:text-primary-fixed cursor-pointer active:opacity-80 p-xs rounded-full hover:bg-surface-container-low' data-icon='help'>help</span>
          <img src='https://lh3.googleusercontent.com/aida-public/AB6AXuB9h8XVGFkM2-65vjBe3pwIfeC5Ts4PGriysRcBKFKLQk1VkS5rL2FrJV18J30-1KILBJYSBpSQur_zgViFOr4rpYF3It0CO64nneBcp3c02kf3G73HHYXEs5YCg47u_Q9MT9yFmJnNE7DYSR79vvmDT0yxeVoJYTJNLrHfjb23cl-of9ObXUvZJVse2cLw7xbYNgOPxtPxmhgvpxru919N0mHYYg8mS2EgljIH4Pd-YQo3FDObF9lbswvDrPwbvL_ROAlpW-9sAW8' alt='User avatar' className='w-8 h-8 rounded-full border border-outline-variant' />
        </div>
      </div>
    </header>
  );
};

export default TopNavBar;
