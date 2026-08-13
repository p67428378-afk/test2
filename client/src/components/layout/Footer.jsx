import React from "react";

export default function Footer() {
  return (
    <footer className="bg-surface-container-low w-full mt-section-gap border-t border-outline-variant">
      <div className="flex flex-col md:flex-row justify-between items-center px-gutter py-12 max-w-container-max mx-auto gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <span className="font-display-lg text-display-lg text-on-surface tracking-tight">
            Canvas & Co.
          </span>
          <p className="font-body-sm text-body-sm text-tertiary">
            © 2024 Canvas & Co. Modern Editorial Gallery. All rights reserved.
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-6">
          <span className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            Terms of Service
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            Privacy Policy
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            Shipping & Returns
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            Accessibility
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            Contact Us
          </span>
        </nav>
      </div>
    </footer>
  );
}
