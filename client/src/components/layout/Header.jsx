import React from "react";
import { Bell, Settings } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-surface-container-high border-b border-outline-variant flex justify-between items-center w-full px-lg h-16 sticky top-0 z-50">
      <div className="flex items-center gap-md">
        <div className="h-10 w-10 bg-primary-container text-on-primary-container rounded flex items-center justify-center font-bold text-lg">
          DG
        </div>
        <div>
          <h1 className="font-headline-sm text-headline-sm text-primary font-semibold">
            DG Cluster Assortment Advisor
          </h1>
          <p className="font-label-md text-label-md text-on-surface-variant">
            Small Town Value Cluster — Snacks Category
          </p>
        </div>
      </div>
      <div className="flex items-center gap-md text-on-surface-variant">
        <button
          aria-label="Notifications"
          className="hover:bg-surface-bright p-sm rounded transition-colors"
        >
          <Bell className="h-5 w-5" />
        </button>
        <button
          aria-label="Settings"
          className="hover:bg-surface-bright p-sm rounded transition-colors"
        >
          <Settings className="h-5 w-5" />
        </button>
        <div className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant ml-sm cursor-pointer">
          <img
            className="h-full w-full object-cover"
            alt="Category Manager"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2ru-e5yK7xkJ-Y2MmZo003LvGYFsfmtfF1fBF5Lf4YrrPeH1_JekYoblSpAhCzUHL2X7CHvRZzv5ShRQYS7uWC6vctN6N6uycD-ssRr8ELXQDB0j2FjREDDUVa2XXjIEeApbc1ThB-bbRuBreSzSq1ArAurryZ1lGMINKkcr3nI27Ik2f7SvxPgQ5WB5nH0ndW5gEFI_Edtg6Qxg6-6Y51nIMdi8QZVFrEa7WK4JaVu4ww2LqpNxCKLsj8JjWfvQVeGWW5Z9G7ZGc"
          />
        </div>
      </div>
    </header>
  );
}
