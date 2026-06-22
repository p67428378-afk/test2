import React from "react";

export default function Footer() {
  return (
    <footer className="bg-surface w-full py-stack-lg border-t border-outline-variant/30 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto gap-stack-md text-on-surface">
        <div className="font-headline-sm text-headline-sm">
          Aura Lens Photography
        </div>
        <nav className="flex flex-wrap justify-center gap-gutter">
          <a
            className="text-on-surface-variant font-label-caps text-label-caps hover:text-primary underline decoration-tertiary-fixed-dim underline-offset-4 transition-all duration-200"
            href="#"
          >
            Instagram
          </a>
          <a
            className="text-on-surface-variant font-label-caps text-label-caps hover:text-primary underline decoration-tertiary-fixed-dim underline-offset-4 transition-all duration-200"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-on-surface-variant font-label-caps text-label-caps hover:text-primary underline decoration-tertiary-fixed-dim underline-offset-4 transition-all duration-200"
            href="#"
          >
            Terms of Service
          </a>
        </nav>
        <div className="font-body-md text-body-md text-on-surface-variant">
          © 2024 Aura Lens Photography. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
