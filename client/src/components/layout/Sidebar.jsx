import React from "react";

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-lowest border-r border-outline-variant shadow-sm flex flex-col py-base_unit z-20">
      <div className="px-6 py-4 flex items-center gap-3">
        <img
          alt="HavenBroker Logo"
          className="h-8 w-8 object-contain"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBadxDGN5tX1hKL11iAHnEnPIfgOuRpRFHKi0NlDU1mzdg5b-I-WbotX_R5M3kciV8JlNkMYj2mjUEq_IfngwAQmD5NOn-NaFuw_ZQmZcJQVqv0bQfBlDOjNKE1C0g3Uwvh0eza5-0Ld7LND4PmruuS52mzZTpc4SxiCagfc7IgEcdaGeHRRIo7bQSq1VjS4voe0UJY-5OX09cV5tRpCHqQmskg2KEgh2yMlpjtjJlWjKIhDeqMjZLg89ZJvoRq2l1CfKYK-lpq1g"
        />
        <div className="flex flex-col">
          <span className="font-headline-md text-headline-md font-bold text-primary">
            HavenBroker
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">
            Broker Portal
          </span>
        </div>
      </div>
      <nav className="flex-1 mt-6 flex flex-col gap-1 px-3">
        <a
          className="flex items-center gap-3 px-4 py-3 bg-secondary-container text-on-secondary-container border-l-4 border-primary rounded-r-lg font-body-md text-body-md hover:bg-surface-container-high transition-all duration-200 active:scale-[0.98]"
          href="#"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            search_insights
          </span>
          Browse Properties
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-lg font-body-md text-body-md hover:bg-surface-container-high transition-all duration-200 active:scale-[0.98]"
          href="#"
        >
          <span className="material-symbols-outlined">favorite</span>
          Saved Listings
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-lg font-body-md text-body-md hover:bg-surface-container-high transition-all duration-200 active:scale-[0.98]"
          href="#"
        >
          <span className="material-symbols-outlined">forum</span>
          Contact Inquiries
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-lg font-body-md text-body-md hover:bg-surface-container-high transition-all duration-200 active:scale-[0.98]"
          href="#"
        >
          <span className="material-symbols-outlined">settings</span>
          Settings
        </a>
      </nav>
      <div className="px-4 py-4 mt-auto border-t border-outline-variant/50">
        <a
          className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-lg font-body-md text-body-md"
          href="#"
        >
          <span className="material-symbols-outlined">account_circle</span>
          Alex Mercer
        </a>
      </div>
    </aside>
  );
}
