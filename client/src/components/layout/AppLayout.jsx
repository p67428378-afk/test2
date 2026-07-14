import React from "react";

export default function AppLayout({ children }) {
  return (
    <div class="min-h-screen flex bg-[#F8FAFC]">
      {/* SideNavBar */}
      <aside class="fixed left-0 top-0 h-screen w-[260px] bg-inverse-surface shadow-md flex flex-col py-unit-lg z-50 transition-transform duration-300 md:translate-x-0 -translate-x-full">
        {/* Brand */}
        <div class="px-unit-lg mb-unit-lg flex items-center gap-3">
          <div class="w-10 h-10 rounded bg-white flex items-center justify-center shrink-0">
            <img
              alt="Medical Cross Logo"
              class="w-8 h-8 object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfmomwc6JreeNGeF-GmOQvl0NiB7lrPxJ_ypn_uNy5JTH2rM0Z5bw7CTBM1r7_3dRW8uVquFaFM9lqk_bB8P_u_5Ull2HWIHeoOYkKAwVZpMUP6pWaaR6Sl8Krl9LwUvW5mIv6vhmco1fQPHVINvyFHBwIWMSxgY8RgPz4FvahCSUyC9bSPwU1oJYrFT5576AAPyaJnSxQwHIOc_TMleuap5lDWJVLM2Y7wHYX5QaEbtA_HwpUrR3S4YeyT976NpwKRkkvKznf42SY"
            />
          </div>
          <div class="flex flex-col">
            <span class="font-headline-sm text-headline-sm font-bold text-primary truncate">
              CareFlow Portal
            </span>
            <span class="text-label-sm font-label-sm text-inverse-primary/70">
              Medical System
            </span>
          </div>
        </div>
        {/* Nav Links */}
        <nav class="flex-1 px-3 space-y-1 overflow-y-auto">
          <a
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-secondary-fixed-dim/5 transition-colors duration-200"
            href="#"
          >
            <span class="material-symbols-outlined shrink-0">dashboard</span>
            <span class="font-body-md text-body-md">Dashboard</span>
          </a>
          <a
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-primary border-l-4 border-primary bg-secondary-fixed-dim/10 font-bold opacity-90 transition-all"
            href="#"
          >
            <span class="material-symbols-outlined shrink-0">
              calendar_add_on
            </span>
            <span class="font-body-md text-body-md">Book Appointment</span>
          </a>
          <a
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-secondary-fixed-dim/5 transition-colors duration-200"
            href="#"
          >
            <span class="material-symbols-outlined shrink-0">event_note</span>
            <span class="font-body-md text-body-md">My Appointments</span>
          </a>
          <a
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-secondary-fixed-dim/5 transition-colors duration-200"
            href="#"
          >
            <span class="material-symbols-outlined shrink-0">group</span>
            <span class="font-body-md text-body-md">Doctors Directory</span>
          </a>
          <a
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-secondary-fixed-dim/5 transition-colors duration-200"
            href="#"
          >
            <span class="material-symbols-outlined shrink-0">settings</span>
            <span class="font-body-md text-body-md">Settings</span>
          </a>
        </nav>
        {/* Footer Profile */}
        <div class="mt-auto px-unit-lg pt-unit-md border-t border-inverse-primary/10">
          <a
            class="flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            <span class="material-symbols-outlined shrink-0 text-2xl">
              account_circle
            </span>
            <span class="font-body-md text-body-md truncate">
              Sarah Jenkins
            </span>
          </a>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div class="md:ml-[260px] min-h-screen flex flex-col bg-[#F8FAFC] w-full">
        {/* TopNavBar */}
        <header class="fixed top-0 right-0 h-[64px] w-full md:w-[calc(100%-260px)] bg-surface-container-lowest border-b border-outline-variant shadow-sm z-40 flex justify-between items-center px-unit-lg">
          <div class="flex items-center gap-4 flex-1">
            <button class="md:hidden text-on-surface p-1 rounded hover:bg-surface-container-high transition-colors">
              <span class="material-symbols-outlined">menu</span>
            </button>
            <div class="hidden sm:flex flex-col">
              <span class="font-headline-sm text-headline-sm font-bold text-on-surface">
                Scheduling Engine / Book Appointment
              </span>
            </div>
            {/* Search Bar */}
            <div class="relative max-w-md w-full ml-4 hidden lg:block">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="material-symbols-outlined text-outline">
                  search
                </span>
              </div>
              <input
                class="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-lg leading-5 bg-surface-container-lowest placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm transition duration-150 ease-in-out"
                placeholder="Search doctors, specialties..."
                type="text"
              />
            </div>
          </div>
          {/* Actions */}
          <div class="flex items-center gap-2 sm:gap-4 shrink-0">
            <button class="relative p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
              <span class="material-symbols-outlined">notifications</span>
              <span class="absolute top-1.5 right-1.5 block h-4 w-4 rounded-full bg-error text-on-error text-[10px] font-bold flex items-center justify-center leading-none">
                2
              </span>
            </button>
            <button class="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors hidden sm:block">
              <span class="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </header>

        {/* Main Canvas */}
        <main class="flex-1 pt-[64px] p-unit-md md:p-margin-page">
          {children}
        </main>
      </div>
    </div>
  );
}
