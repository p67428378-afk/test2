import React, { useState, useEffect } from "react";
import { SearchBar } from "../components/knowledge/SearchBar.jsx";
import { NoteCard } from "../components/knowledge/NoteCard.jsx";
import { Sidebar } from "../components/layout/Sidebar.jsx";
import { searchService, tagService, noteService } from "../services/api.js";
import { BookOpen, Sparkles, RefreshCw, AlertCircle } from "lucide-react";

export function KnowledgeBasePage() {
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("APPROVED");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [searchQuery, selectedTag, selectedCategory, selectedStatus]);

  const fetchTags = async () => {
    try {
      const data = await tagService.getTags();
      if (Array.isArray(data)) {
        setTags(data);
      }
    } catch (err) {
      // Tags loading error
    }
  };

  const fetchNotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        status: selectedStatus || undefined,
      };
      if (searchQuery.trim()) params.q = searchQuery.trim();
      if (selectedTag) params.tag = selectedTag;
      if (selectedCategory) params.category = selectedCategory;

      let data;
      if (searchQuery.trim() || selectedTag || selectedCategory) {
        data = await searchService.search(params);
      } else {
        data = await noteService.getNotes(params);
      }

      if (Array.isArray(data)) {
        setNotes(data);
      } else {
        setNotes([]);
      }
    } catch (err) {
      setError(err?.message || "Failed to load research notes");
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedTag(null);
    setSelectedCategory(null);
    setSelectedStatus("APPROVED");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Curated Internal Knowledge Repository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Technical Research Knowledge Base
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Search peer-reviewed research notes, architectural benchmarks, and
            SME-validated technical insights with full citation references.
          </p>
        </div>

        <div className="bg-slate-800/80 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center space-x-6 flex-shrink-0">
          <div>
            <p className="text-2xl font-bold text-white">{notes.length}</p>
            <p className="text-[11px] text-slate-400 font-medium">
              Notes Found
            </p>
          </div>
          <div className="h-8 w-px bg-slate-700" />
          <div>
            <p className="text-2xl font-bold text-emerald-400">{tags.length}</p>
            <p className="text-[11px] text-slate-400 font-medium">
              Taxonomy Tags
            </p>
          </div>
        </div>
      </div>

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
        availableTags={tags}
        onClear={handleClearFilters}
      />

      <div className="flex flex-col md:flex-row gap-6">
        <Sidebar
          categories={[
            "General",
            "Architecture",
            "Performance",
            "Security",
            "Database",
            "DevOps",
          ]}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
        />

        <main className="flex-1 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <p className="font-semibold text-slate-700">
              Showing {selectedStatus.toLowerCase()} research notes
              {selectedCategory && ` in "${selectedCategory}"`}
              {selectedTag && ` tagged with "#${selectedTag}"`}
            </p>
            <button
              onClick={fetchNotes}
              className="flex items-center space-x-1 text-slate-500 hover:text-slate-800 transition"
              title="Refresh"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-xl p-6 border border-slate-200 animate-pulse space-y-3"
                >
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="h-6 bg-slate-200 rounded w-3/4" />
                  <div className="h-16 bg-slate-100 rounded w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl border border-red-200 p-8 text-center space-y-3">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
              <p className="text-sm font-semibold text-slate-800">{error}</p>

              <button
                onClick={fetchNotes}
                className="px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-700"
              >
                Retry
              </button>
            </div>
          ) : notes.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
              <BookOpen className="h-10 w-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                No Research Notes Found
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No research notes matched your current search query or filter
                criteria. Try resetting filters or submitting a new research
                note.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default KnowledgeBasePage;
