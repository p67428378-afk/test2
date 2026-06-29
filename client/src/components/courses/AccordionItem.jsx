import React, { useState } from "react";
import PropTypes from "prop-types";

export default function AccordionItem({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-outline-variant rounded-lg overflow-hidden bg-surface">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-stack-md text-left font-medium text-on-surface hover:bg-surface-container-low transition-colors"
      >
        <span className="text-body-lg font-semibold">{title}</span>
        <span
          className="material-symbols-outlined transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          expand_more
        </span>
      </button>
      {isOpen && (
        <div className="p-stack-md border-t border-outline-variant bg-surface-container-lowest text-body-md text-on-surface-variant flex flex-col gap-2">
          {children}
        </div>
      )}
    </div>
  );
}

AccordionItem.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
