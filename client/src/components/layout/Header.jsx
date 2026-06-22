import React from "react";

export default function Header({
  searchQuery,
  setSearchQuery,
  onSuggestClick,
}) {
  return (
    <header className="bg-surface h-[72px] w-full sticky top-0 z-50 shadow-md flex justify-between items-center px-container-margin">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-[2px]">
          <div className="h-1 w-6 bg-[#FF9933] rounded-full"></div>
          <div className="h-1 w-6 bg-white border border-[#E2E8F0] rounded-full"></div>
          <div className="h-1 w-6 bg-[#138808] rounded-full"></div>
        </div>
        <h1 className="font-headline-md text-headline-md font-bold text-primary">
          Namaste India
        </h1>
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
          search
        </span>
        <input
          className="w-full h-10 pl-10 pr-4 bg-white border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9933] text-body-md text-on-surface placeholder:text-on-surface-variant"
          placeholder="Search greetings, regions, or languages..."
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Navigation Links & Action */}
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex items-center gap-6">
          <a
            className="text-primary border-b-2 border-primary pb-1 font-bold hover:text-primary transition-colors duration-200"
            href="#"
          >
            Home
          </a>
          <a
            className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200"
            href="#"
          >
            Regions
          </a>
          <a
            className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200"
            href="#"
          >
            About
          </a>
        </nav>
        <button
          onClick={onSuggestClick}
          className="bg-primary-container text-on-primary font-label-md px-4 py-2 rounded-lg hover:bg-primary transition-colors duration-200 flex items-center gap-2 shadow-sm"
        >
          Suggest a Greeting
        </button>
      </div>
    </header>
  );
}
