import React from 'react';

const Header = () => {
  return (
    <header className="fixed top-0 w-full z-50 glass-header shadow-sm border-none">
      <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high ring-2 ring-primary-fixed/30">
            <img alt="user profile picture" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNhbNlKgti5SccBnaHg1sVs03u4AAG5fn7xtQ_-xpCPtfnGAS0-UXhL1smR1-pHRdVsQv2Iblghuv2IEJ1VniXRrmCIoaHBxFVLtZ7PbsF9jA9-RFEFPvI1jwmUDu_zagYNawI1Q5aPbpNdNkJb9GnIYsOndOlZjfK96bkkD7eTPibjKhSqzUc5TroMy_d11-HFXeear2dgpk7svVPfAjL7atLNEjVgrAuLVWznU-jHeiwYLT5ekVnDvZFLpLSpSgZoN7UesotS9g"/>
          </div>
          <h1 className="font-headline font-bold text-lg tracking-tight text-on-background">Clinical Sanctuary</h1>
        </div>
        <nav className="hidden md:flex gap-8">
          <a className="text-primary font-bold transition-colors" href="#">Policy</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Claims</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Doctors</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Profile</a>
        </nav>
        <button className="p-2 rounded-xl hover:bg-surface-container-low transition-colors active:scale-95 duration-200">
          <span className="material-symbols-outlined text-primary">notifications</span>
        </button>
      </div>
      <div className="bg-surface-container h-[1px] w-full absolute bottom-0"></div>
    </header>
  );
};

export default Header;
