import React from "react";
import { Info } from "lucide-react";

export default function Footer({ referenceId }) {
  return (
    <footer className="w-full py-lg px-margin-desktop text-center border-t border-[#334155] bg-surface-container-lowest">
      <p className="text-on-surface-variant text-body-md font-body-md mb-1 flex items-center justify-center gap-1">
        <Info className="w-[18px] h-[18px] text-outline" />
        <span>Need help? Call Premier Support at </span>
        <a
          className="text-primary hover:underline font-medium"
          href="tel:18005550199"
        >
          1-800-555-0199
        </a>
      </p>
      {referenceId && (
        <p className="text-outline text-[12px] font-label-md uppercase tracking-wider mt-2">
          Reference ID: {referenceId}
        </p>
      )}
    </footer>
  );
}
