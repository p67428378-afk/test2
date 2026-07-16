import React from "react";

export default function Header({ onSearch, searchValue, setSearchValue }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  return (
    <header className="fixed top-0 right-0 h-[64px] w-[calc(100%-260px)] bg-surface-container-lowest border-b border-outline-variant shadow-sm flex justify-between items-center px-gutter z-10">
      <div className="flex-1 flex items-center">
        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-md focus-within:ring-2 focus-within:ring-primary rounded-lg transition-all"
        >
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none font-body-sm text-body-sm text-slate-900 placeholder-slate-500"
            placeholder="Search by location..."
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors active:scale-[0.98]">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1 right-1 w-4 h-4 bg-error text-on-error rounded-full flex items-center justify-center font-label-sm text-[10px]">
            2
          </span>
        </button>
        <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors active:scale-[0.98]">
          <span className="material-symbols-outlined">apps</span>
        </button>
        <div className="h-8 w-8 rounded-full bg-primary-container overflow-hidden ml-2 border border-outline-variant">
          <img
            alt="Broker Profile Avatar"
            className="h-full w-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCL_rJSV22p5mwcmGuittFp4s_ne5b6juuCnSM4XRWUsiOJIkWuz85J8Z1kowQHSYRz2lvLmabILcNTLSyMx6LGWFM0e0hg1chGZJheHWvx-TedW7heyAM23SmY29rRQ4m13OfQi_v4KZJMJ6KpukK0j1-1oUU-nmXkjfh7SfvG5oEpyGs4dlTuAUfBz9ND8Wk0S6_vlpbT1RSHFbvLpvDP_KcXNnmHvuodctsCBX4Yk1H6F97aFV6VQluop5uSnZOdz5YdcEJ7nFg"
          />
        </div>
      </div>
    </header>
  );
}
