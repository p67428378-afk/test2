import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function TopNavBar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-surface/80 backdrop-blur-md text-primary h-[64px] w-full sticky top-0 z-50 border-b border-outline-variant/10">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto h-full">
        <Link
          to="/"
          className="font-headline-sm text-headline-sm text-primary hover:opacity-90 transition-opacity"
        >
          Aura Lens Photography
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-gutter">
          <Link
            to="/"
            className={`font-label-caps text-label-caps cursor-pointer transition-all duration-200 active:scale-95 pb-1 ${
              isActive("/")
                ? "text-primary border-b-2 border-tertiary-fixed-dim"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Portfolio
          </Link>
          <Link
            to="/book"
            className={`font-label-caps text-label-caps cursor-pointer transition-all duration-200 active:scale-95 pb-1 ${
              isActive("/book")
                ? "text-primary border-b-2 border-tertiary-fixed-dim"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Book a Session
          </Link>
          <Link
            to="/contact"
            className={`font-label-caps text-label-caps cursor-pointer transition-all duration-200 active:scale-95 pb-1 ${
              isActive("/contact")
                ? "text-primary border-b-2 border-tertiary-fixed-dim"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Contact
          </Link>
          <Link to="/book">
            <button className="bg-tertiary-fixed-dim text-on-tertiary-fixed font-button text-button px-6 py-2 rounded transition-all duration-200 hover:bg-tertiary-fixed active:scale-95 ml-4">
              Book a Session
            </button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-primary focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="md:hidden bg-surface border-b border-outline-variant/20 px-margin-mobile py-4 flex flex-col gap-4 animate-fade-in">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`font-label-caps text-label-caps py-2 ${
              isActive("/")
                ? "text-primary font-semibold"
                : "text-on-surface-variant"
            }`}
          >
            Portfolio
          </Link>
          <Link
            to="/book"
            onClick={() => setIsOpen(false)}
            className={`font-label-caps text-label-caps py-2 ${
              isActive("/book")
                ? "text-primary font-semibold"
                : "text-on-surface-variant"
            }`}
          >
            Book a Session
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className={`font-label-caps text-label-caps py-2 ${
              isActive("/contact")
                ? "text-primary font-semibold"
                : "text-on-surface-variant"
            }`}
          >
            Contact
          </Link>
          <Link to="/book" onClick={() => setIsOpen(false)}>
            <button className="w-full bg-tertiary-fixed-dim text-on-tertiary-fixed font-button text-button py-3 rounded transition-all duration-200 hover:bg-tertiary-fixed active:scale-95">
              Book a Session
            </button>
          </Link>
        </nav>
      )}
    </header>
  );
}
