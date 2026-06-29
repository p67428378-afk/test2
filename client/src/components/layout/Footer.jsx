import React from "react";

export default function Footer() {
  return (
    <footer className="bg-surface-container-low dark:bg-surface-dim border-t border-outline-variant dark:border-outline w-full py-stack-lg mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto gap-stack-md">
        <div className="flex items-center gap-2 text-primary dark:text-primary-fixed-dim">
          <span className="material-symbols-outlined" data-icon="school">
            school
          </span>
          <span className="text-headline-sm font-headline-sm font-semibold">
            LearnHub
          </span>
        </div>
        <nav className="flex flex-wrap gap-4 justify-center font-label-md text-label-md">
          <a
            className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed-dim transition-all"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed-dim transition-all"
            href="#"
          >
            Terms of Service
          </a>
          <a
            className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed-dim transition-all"
            href="#"
          >
            Help Center
          </a>
          <a
            className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed-dim transition-all"
            href="#"
          >
            Contact Us
          </a>
        </nav>
        <div className="text-secondary dark:text-secondary-fixed-dim font-label-md text-label-md">
          © 2024 LearnHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
