import React from "react";

export default function BookCard({ book }) {
  const {
    title,
    author,
    isbn,
    available_copies = 0,
    total_copies = 0,
    is_available = true,
    cover_image_url,
    genre,
  } = book;

  // Determine status badge
  let badgeBg = "bg-[#dcfce7] text-[#15803d]";
  let badgeText = "Available";

  if (genre === "Reference") {
    badgeBg = "bg-[#dbeafe] text-[#1d4ed8]";
    badgeText = "Reference Only";
  } else if (!is_available || available_copies === 0) {
    badgeBg = "bg-[#fef3c7] text-[#b45309]";
    badgeText = "Checked Out";
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:-translate-y-1 transition-all duration-300 group flex flex-col">
      <div className="aspect-[4/3] bg-surface-container relative overflow-hidden flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-surface-variant/30 pattern-dots pattern-outline-variant pattern-bg-transparent pattern-size-4 pattern-opacity-20"></div>
        {cover_image_url ? (
          <img
            src={cover_image_url}
            alt={title}
            className="w-24 h-32 object-cover shadow-sm border border-outline-variant rounded-sm z-10 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-24 h-32 bg-surface shadow-sm border border-outline-variant flex items-center justify-center rounded-sm z-10 group-hover:scale-105 transition-transform duration-300">
            <span className="material-symbols-outlined text-outline text-[40px]">
              menu_book
            </span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badgeBg}`}
          >
            {badgeText}
          </span>
        </div>
        <h3 className="text-headline-sm font-headline-sm text-on-surface mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-body-md font-body-md text-on-surface-variant mb-4">
          {author}
        </p>
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-outline-variant/50">
          <span className="text-label-md font-label-md text-outline">
            ISBN: {isbn}
          </span>
          {badgeText === "Available" && (
            <button
              className="text-primary hover:bg-primary/10 p-1.5 rounded-md transition-colors"
              title="Add to Bookshelf"
            >
              <span className="material-symbols-outlined text-[20px]">
                bookmark_add
              </span>
            </button>
          )}
          {badgeText === "Checked Out" && (
            <button
              className="text-outline hover:text-primary p-1.5 rounded-md transition-colors"
              title="Join Waitlist"
            >
              <span className="material-symbols-outlined text-[20px]">
                notifications_active
              </span>
            </button>
          )}
          {badgeText === "Reference Only" && (
            <button
              className="text-outline hover:text-primary p-1.5 rounded-md transition-colors"
              title="View Location"
            >
              <span className="material-symbols-outlined text-[20px]">
                location_on
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
