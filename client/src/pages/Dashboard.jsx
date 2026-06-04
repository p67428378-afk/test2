import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import PremiumCalculator from '../components/PremiumCalculator';

const Dashboard = () => {
  return (
    <div className='text-on-background'>
      <Sidebar />
      <Header />
      <main className='pt-24 pb-12 lg:ml-[280px] px-margin_desktop'>
        <div className='max-w-[1440px] mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-12 gap-gutter mb-stack_lg'>
            <PremiumCalculator />
            <div className='md:col-span-4 flex flex-col gap-gutter'>
              <div className='bg-primary text-white p-stack_lg rounded-xl shadow-lg relative overflow-hidden flex-1 min-h-[200px]'>
                <div className='relative z-10'>
                  <h4 className='font-title-sm text-title-sm mb-2'>Policy Optimization</h4>
                  <p className='text-body-sm mb-4 opacity-90'>Our AI suggests a 5% discount if combined with home insurance.</p>
                  <button className='bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-body-sm font-bold backdrop-blur-sm transition-colors'>Apply Bundle</button>
                </div>
                <span className='material-symbols-outlined absolute -bottom-4 -right-4 text-9xl opacity-10 rotate-12' data-icon='auto_awesome'>auto_awesome</span>
              </div>
              <div className='bg-white p-stack_lg rounded-xl shadow-sm border border-outline-variant flex-1'>
                <h4 className='font-title-sm text-title-sm mb-4 text-[#1F2937]'>Active Risk Level</h4>
                <div className='flex items-end gap-2 mb-2'>
                  <div className='h-8 w-full bg-tertiary-fixed rounded-sm'></div>
                  <div className='h-12 w-full bg-tertiary-fixed rounded-sm'></div>
                  <div className='h-16 w-full bg-tertiary-fixed rounded-sm'></div>
                  <div className='h-20 w-full bg-surface-container-highest rounded-sm'></div>
                </div>
                <p className='font-body-md text-body-md text-tertiary font-bold'>Moderate-Low Risk</p>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-gutter'>
            <div className='bg-white p-stack_lg rounded-xl border border-outline-variant shadow-sm'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='p-2 bg-secondary-container rounded-lg'>
                  <span className='material-symbols-outlined text-secondary' data-icon='history'>history</span>
                </div>
                <h5 className='font-title-sm text-title-sm text-[#1F2937]'>Recent Calculations</h5>
              </div>
              <ul className='space-y-4'>
                <li className='flex justify-between items-center pb-2 border-b border-outline-variant'>
                  <div>
                    <p className='text-body-md font-bold'>Premium #9928</p>
                    <p className='text-body-sm text-on-surface-variant'>2 mins ago</p>
                  </div>
                  <span className='text-body-md font-bold text-on-surface'>$520.00</span>
                </li>
                <li className='flex justify-between items-center pb-2 border-b border-outline-variant'>
                  <div>
                    <p className='text-body-md font-bold'>Premium #9927</p>
                    <p className='text-body-sm text-on-surface-variant'>15 mins ago</p>
                  </div>
                  <span className='text-body-md font-bold text-on-surface'>$410.00</span>
                </li>
              </ul>
            </div>
            <div className='bg-white p-stack_lg rounded-xl border border-outline-variant shadow-sm'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='p-2 bg-tertiary-container text-white rounded-lg'>
                  <span className='material-symbols-outlined' data-icon='analytics'>analytics</span>
                </div>
                <h5 className='font-title-sm text-title-sm text-[#1F2937]'>Regional Impact</h5>
              </div>
              <div className='space-y-3'>
                <div className='flex justify-between text-body-sm'>
                  <span>Urban Zone A</span>
                  <span className='font-bold'>+12%</span>
                </div>
                <div className='w-full bg-surface-container h-2 rounded-full overflow-hidden'>
                  <div className='bg-primary h-full w-[70%]'></div>
                </div>
                <div className='flex justify-between text-body-sm'>
                  <span>Suburban Zone B</span>
                  <span className='font-bold'>-5%</span>
                </div>
                <div className='w-full bg-surface-container h-2 rounded-full overflow-hidden'>
                  <div className='bg-primary h-full w-[30%]'></div>
                </div>
              </div>
            </div>
            <div className='bg-white p-stack_lg rounded-xl border border-outline-variant shadow-sm relative overflow-hidden group'>
              <h5 className='font-title-sm text-title-sm text-[#1F2937] mb-2'>Market Trends</h5>
              <p className='text-body-sm text-on-surface-variant mb-6'>Inflation is currently affecting base rates globally by 3.2% annually.</p>
              <div className='aspect-video rounded-lg bg-surface-container-low flex items-center justify-center overflow-hidden'>
                <img className='w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500' alt='A clean, professional business line chart showing an upward trend of data points.' src='https://lh3.googleusercontent.com/aida-public/AB6AXuDAeVCt3oDrOw216pyddqUyKzKxYRwQBI2w5kmFjWEXe2VN2_VRf_k83aBCtP6u9WtD31rPOwzWBYMj8EOQHPybkBP9OGBJhY_W9-66N4FUag8n1I8EAz4qtWHX4AIWWyS6rEGyoQqOwC9di1FwEggo2JImRRzhTEGezSLvlJZ-EPR-OA2xpn71pIe5mGSFSnrFRMSZfRh7iY_s03KEMh2QOXkRYTuouSJKOvdiveUeJ9IxIJEwgLgu13EgkF8v4KiBAWml2XxnC38' />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
