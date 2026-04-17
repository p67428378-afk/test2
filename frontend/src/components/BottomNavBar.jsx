import React from 'react';

const BottomNavBar = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-t border-white/40 shadow-[0_-12px_32px_rgba(0,72,141,0.06)] rounded-t-[24px]">
      <div className="flex justify-around items-center px-4 pt-3 pb-8">
        <a className="flex flex-col items-center justify-center bg-[#00488d] text-white rounded-xl px-5 py-2.5 active:scale-90 transition-all duration-300" href="#">
          <span className="material-symbols-outlined">policy</span>
          <span className="font-['Public_Sans'] text-[10px] font-semibold uppercase tracking-wider mt-1">Policy</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#424752] px-5 py-2.5 hover:text-[#005fb8] active:scale-90 transition-all duration-300" href="#">
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="font-['Public_Sans'] text-[10px] font-semibold uppercase tracking-wider mt-1">Claims</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#424752] px-5 py-2.5 hover:text-[#005fb8] active:scale-90 transition-all duration-300" href="#">
          <span className="material-symbols-outlined">medical_services</span>
          <span className="font-['Public_Sans'] text-[10px] font-semibold uppercase tracking-wider mt-1">Doctors</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#424752] px-5 py-2.5 hover:text-[#005fb8] active:scale-90 transition-all duration-300" href="#">
          <span className="material-symbols-outlined">person</span>
          <span className="font-['Public_Sans'] text-[10px] font-semibold uppercase tracking-wider mt-1">Profile</span>
        </a>
      </div>
    </nav>
  );
};

export default BottomNavBar;
