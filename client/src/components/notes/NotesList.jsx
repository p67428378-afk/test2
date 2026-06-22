import React from "react";
import NoteCard from "./NoteCard";

export default function NotesList({
  notes,
  selectedNoteId,
  onNoteSelect,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}) {
  return (
    <section className="hidden md:flex flex-col w-[380px] bg-surface-container h-full border-r border-outline-variant/30 flex-shrink-0 z-10">
      {/* List Header */}
      <div className="p-4 border-b border-outline-variant/30 bg-surface-container/80 backdrop-blur-md sticky top-0 z-10">
        <div className="relative group mb-3">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-surface-variant/40 border border-outline-variant/50 rounded-lg py-2 pl-10 pr-4 text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-variant/60 transition-all outline-none"
            placeholder="Search notes..."
          />
        </div>
        <div className="flex justify-between items-center px-1">
          <span className="font-label-sm text-label-sm text-outline">
            {notes.length} {notes.length === 1 ? "Note" : "Notes"}
          </span>
          <button
            onClick={() =>
              onSortChange(sortBy === "date_desc" ? "date_asc" : "date_desc")
            }
            className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">sort</span>
            Sort by {sortBy === "date_desc" ? "Newest" : "Oldest"}
          </button>
        </div>
      </div>

      {/* Notes List Scroll Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {notes.length === 0 ? (
          <div className="text-center py-8 text-outline font-label-md">
            No notes found
          </div>
        ) : (
          notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isSelected={note.id === selectedNoteId}
              onClick={() => onNoteSelect(note.id)}
            />
          ))
        )}
      </div>
    </section>
  );
}
