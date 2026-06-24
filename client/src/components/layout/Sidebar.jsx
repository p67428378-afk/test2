import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-inverse-surface shadow-md flex flex-col p-lg gap-sm z-20">
      <div className="flex items-center gap-sm mb-lg px-4">
        <span className="material-symbols-outlined text-primary-container text-3xl">
          menu_book
        </span>
        <span className="text-headline-md font-headline-md font-bold text-on-primary-fixed">
          LibManage
        </span>
      </div>
      <nav className="flex flex-col gap-sm flex-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer active:scale-95 transition-transform ${
              isActive
                ? "bg-primary-container text-on-primary-container font-semibold"
                : "text-tertiary-fixed-dim hover:text-on-primary-fixed hover:bg-primary-fixed-dim/10"
            }`
          }
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-body-md text-body-md">Dashboard</span>
        </NavLink>
        <NavLink
          to="/catalog"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer active:scale-95 transition-transform ${
              isActive
                ? "bg-primary-container text-on-primary-container font-semibold"
                : "text-tertiary-fixed-dim hover:text-on-primary-fixed hover:bg-primary-fixed-dim/10"
            }`
          }
        >
          <span className="material-symbols-outlined">menu_book</span>
          <span className="font-body-md text-body-md">Catalog</span>
        </NavLink>
        <NavLink
          to="/add-book"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer active:scale-95 transition-transform ${
              isActive
                ? "bg-primary-container text-on-primary-container font-semibold"
                : "text-tertiary-fixed-dim hover:text-on-primary-fixed hover:bg-primary-fixed-dim/10"
            }`
          }
        >
          <span className="material-symbols-outlined">add_box</span>
          <span className="font-body-md text-body-md">Add Book</span>
        </NavLink>
      </nav>
      <div className="mt-auto px-4 py-3 flex items-center gap-3 border-t border-outline-variant/20 pt-lg">
        <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden">
          <img
            className="w-full h-full object-cover"
            alt="Aarchi Jain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDL9txr2LO7RFPdneKdkIyuG6kGizFKgJx_BLEj1yj7rHe35xCwjui4E5lGzYqddoEMF7I3NpLMjqLt1O0V_cYUeRX_gN7o6W-IIH3De6FVGY29JyJTWxI9czSvThmuoQF3Hx9v4jhuN6rVutA_OjLp2iV-CaYoovsS-Efq-CxlaaHJPBP6hBvS8jkdeoNUdOUhpbKwr29pMr2U9Fq2K2zT_Tp7UvsB29CKbztvzeC01UFkuiv0NYzLFCxeG3_lt7T5vyXhsdz0VRk"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-body-md text-body-md text-on-primary-fixed font-semibold">
            Aarchi Jain
          </span>
          <span className="font-label-md text-label-md text-tertiary-fixed-dim">
            Librarian
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
