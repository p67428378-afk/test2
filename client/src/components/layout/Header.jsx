import React from "react";
import { ShieldAlert } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full flex justify-between items-center px-margin-desktop py-lg border-b border-[#334155] bg-surface-container-low/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-xs">
        <img
          alt="Apex Premier Logo"
          className="h-[60px] w-auto"
          src="https://lh3.googleusercontent.com/aida/AP1WRLsqHOcb7Szjgdtd2-1M0YnqIziAysLJAc-KATaTFvfQz719OKijNy6GTtNLbO4REkZ6By4hjOvYjQMDShd7Vv9oMKqYpSGBVED5oLYDQ0bBoVbN8Gtf7U_GCSUXgD-sYNd9v0lZWZjwQ_cpGJvFNGfJyXDzKqRoygwTRdYHO4CjQ2R8Ft_LQTVCg0H8hQ8pfsqzNdwhmO9N4aXUp9MxKzMp1AvesC77BOldt9FHXZRp5lSUvYjP0BTjQrR1"
        />
      </div>
      <div className="flex items-center gap-xs text-primary-container font-label-md text-label-md px-sm py-xs rounded-full bg-primary-container/10 border border-primary-container/20">
        <ShieldAlert className="w-[18px] h-[18px] text-primary-container" />
        <span>End-to-End Encrypted</span>
      </div>
    </header>
  );
}
