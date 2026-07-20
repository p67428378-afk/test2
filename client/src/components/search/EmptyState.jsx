import React from "react";

export default function EmptyState({ query }) {
  return (
    <div className="max-w-6xl mx-auto text-center py-16 bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm">
      <span className="material-symbols-outlined text-outline text-[64px] mb-4">
        search_off
      </span>
      <h3 className="text-headline-md font-headline-md text-on-surface mb-2">
        No books found
      </h3>
      <p className="text-body-lg font-body-lg text-on-surface-variant max-w-md mx-auto">
        We couldn't find any books matching "{query}". Please try checking your
        spelling or using different keywords.
      </p>
    </div>
  );
}
