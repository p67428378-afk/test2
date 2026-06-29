import React from "react";

export default function TopNavBar() {
  return (
    <header className="w-full top-0 sticky bg-surface dark:bg-background border-b border-outline-variant dark:border-outline z-50">
      <div className="flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        {/* Brand */}
        <a
          className="flex items-center gap-2 text-primary dark:text-primary-fixed-dim hover:opacity-80 transition-opacity"
          href="#"
        >
          <span className="material-symbols-outlined" data-icon="school">
            school
          </span>
          <span className="text-headline-md font-headline-md font-bold tracking-tight">
            LearnHub
          </span>
        </a>
        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex gap-8 h-full items-center">
          <a
            className="text-primary dark:text-primary-fixed-dim font-bold border-b-2 border-primary dark:border-primary-fixed-dim pb-1 pt-1 font-body-md text-body-md"
            href="#"
          >
            Courses
          </a>
          <a
            className="text-secondary dark:text-secondary-fixed font-medium hover:text-primary dark:hover:text-primary-fixed-dim transition-colors duration-200 font-body-md text-body-md"
            href="#"
          >
            Paths
          </a>
          <a
            className="text-secondary dark:text-secondary-fixed font-medium hover:text-primary dark:hover:text-primary-fixed-dim transition-colors duration-200 font-body-md text-body-md"
            href="#"
          >
            Mentors
          </a>
          <a
            className="text-secondary dark:text-secondary-fixed font-medium hover:text-primary dark:hover:text-primary-fixed-dim transition-colors duration-200 font-body-md text-body-md"
            href="#"
          >
            Enterprise
          </a>
        </nav>
        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="hidden md:block text-secondary dark:text-secondary-fixed font-medium hover:text-primary dark:hover:text-primary-fixed-dim transition-colors font-body-md text-body-md">
            Sign In
          </button>
          <button className="bg-primary text-on-primary px-4 py-2 rounded font-label-md text-label-md hover:opacity-90 transition-opacity">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}
