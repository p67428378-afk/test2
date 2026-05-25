import InterestCertificateForm from './components/InterestCertificateForm';

function App() {
  return (
    <div className="bg-background font-body-md text-on-background min-h-screen">
      <nav className="bg-[#0A192F] fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 h-16 shadow-lg border-b border-white/10">
        <div className="flex items-center gap-8">
          <span className="text-xl font-extrabold text-white tracking-tight font-headline-sm">BankSecure</span>
          <div className="hidden md:flex items-center gap-6">
            <a className="font-manrope text-sm font-medium text-slate-300 hover:text-white transition-colors" href="#">Overview</a>
            <a className="font-manrope text-sm font-medium text-emerald-400 border-b-2 border-emerald-400 pb-1" href="#">Services</a>
            <a className="font-manrope text-sm font-medium text-slate-300 hover:text-white transition-colors" href="#">Tax Center</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 border border-white/10">
            <span className="material-symbols-outlined text-white text-lg">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-white text-xs w-48 placeholder-slate-400" placeholder="Search transactions..." type="text"/>
          </div>
          <button className="p-2 text-slate-300 hover:bg-white/5 transition-all rounded">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-slate-300 hover:bg-white/5 transition-all rounded">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="h-8 w-8 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border border-white/20">
            <img alt="User Profile Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1QRC3zVZh4VcRHPLMZQ7H-fn99IyQS4rTDfapOH6RKEmQNB_T29dXeJFbzOFUS8Jl4xgFnCRIOX2XdXATdMTmXFPJa9V_I-v2tiGmRETXuHMfkfeYHdBjLIXkgrFJJAWCvo4TRgQk5ronTrsXmjaWKv7j6WM2i-yJbA1mvNI5cZrQiw4Rs2lWiggI4TiphdIi0o2m7-nukWkxifcb6zYeQdpTvgOF78qmK2rMantetNu-m-BfBh9q3j63IHB-OdOGz--Y4SfU"/>
          </div>
        </div>
      </nav>
      <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col py-6 gap-2">
        <div className="px-6 mb-6">
          <h2 className="text-[#0A192F] font-headline-sm text-lg font-bold">Premium Banking</h2>
          <p className="text-on-primary-container text-xs">Verified Account</p>
        </div>
        <nav className="flex-1 px-2 space-y-1">
          <a className="flex items-center gap-3 px-4 py-3 font-manrope text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all rounded" href="#">
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </a>
          <a className="flex items-center gap-3 px-4 py-3 font-manrope text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all rounded" href="#">
            <span className="material-symbols-outlined">account_balance</span>
            Accounts
          </a>
          <a className="flex items-center gap-3 px-4 py-3 font-manrope text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all rounded" href="#">
            <span className="material-symbols-outlined">trending_up</span>
            Investments
          </a>
          <a className="flex items-center gap-3 px-4 py-3 font-manrope text-sm font-semibold bg-slate-50 text-[#0A192F] border-r-4 border-emerald-500 rounded-l" href="#">
            <span className="material-symbols-outlined">description</span>
            Tax &amp; Certificates
          </a>
          <a className="flex items-center gap-3 px-4 py-3 font-manrope text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all rounded" href="#">
            <span className="material-symbols-outlined">receipt_long</span>
            Statements
          </a>
        </nav>
        <div className="px-4 mt-auto space-y-1">
          <button className="w-full bg-secondary text-white py-3 rounded-lg font-label-md flex items-center justify-center gap-2 mb-6 hover:brightness-90 transition-all">
            <span className="material-symbols-outlined text-sm">add</span>
            New Transaction
          </button>
          <a className="flex items-center gap-3 px-4 py-2 font-manrope text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all rounded" href="#">
            <span className="material-symbols-outlined">shield</span>
            Security
          </a>
          <a className="flex items-center gap-3 px-4 py-2 font-manrope text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all rounded" href="#">
            <span className="material-symbols-outlined">logout</span>
            Logout
          </a>
        </div>
      </aside>
      <main className="pl-64 pt-16 min-h-screen">
        <div className="max-w-[1440px] mx-auto px-gutter py-xl">
          <div className="mb-lg">
            <div className="flex items-center gap-2 text-on-primary-container font-label-sm mb-xs">
              <span>Tax Center</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span className="text-on-surface">Interest Certificates</span>
            </div>
            <h1 className="font-headline-md text-on-surface">Consolidated Interest Certificate</h1>
            <p className="text-on-surface-variant font-body-md mt-2 max-w-2xl">
              Generate a comprehensive summary of interest earned across all your savings accounts, fixed deposits, and recurring deposits for a specific financial year.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-xl">
                <InterestCertificateForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
