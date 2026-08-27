import React, { useState, useEffect, useMemo } from "react";
import { getProjects } from "../../services/api.js";
import ProjectCard from "./ProjectCard.jsx";
import ProjectDetailModal from "./ProjectDetailModal.jsx";
import { Filter, Search, Loader2, AlertCircle, Sparkles } from "lucide-react";

export default function ProjectGallery() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchProjects = async (tag) => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (tag && tag !== "All") {
        params.tag = tag;
      }
      const data = await getProjects(params);
      setProjects(data || []);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to load showcased projects.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(selectedTag);
  }, [selectedTag]);

  // Extract all distinct tags from current project list for quick filter chips
  const availableTags = useMemo(() => {
    const tagSet = new Set();
    projects.forEach((p) => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach((t) => tagSet.add(t));
      }
    });
    return Array.from(tagSet);
  }, [projects]);

  // Filter projects based on search query in memory
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.summary?.toLowerCase().includes(q) ||
        (Array.isArray(p.tags) &&
          p.tags.some((t) => t.toLowerCase().includes(q))),
    );
  }, [projects, searchQuery]);

  return (
    <section
      id="projects"
      className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Featured Portfolio</span>
          </div>
          <h2 className="text-3xl font-bold text-[#171C29] tracking-tight">
            Showcase Projects
          </h2>
          <p className="text-[#707A8C] text-sm mt-1 max-w-xl">
            Explore verified applications, custom platforms, and engineering
            work delivered for clients.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-[#E3E8F0] rounded-lg text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-60 shadow-sm"
              aria-label="Search projects by title, summary, or tech tag"
            />
          </div>
        </div>
      </div>

      {/* Filter Tag Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedTag("")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            selectedTag === ""
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white text-slate-700 border border-[#E3E8F0] hover:bg-slate-50"
          }`}
        >
          <Filter className="w-3 h-3" />
          <span>All Technologies</span>
        </button>

        {availableTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setSelectedTag(tag === selectedTag ? "" : tag)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedTag === tag
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-700 border border-[#E3E8F0] hover:bg-slate-50"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
          <p className="text-sm font-medium">Loading portfolio projects...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-lg mx-auto my-8">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-red-800 mb-1">
            Failed to Load Projects
          </h3>
          <p className="text-xs text-red-600 mb-4">{error}</p>
          <button
            type="button"
            onClick={() => fetchProjects(selectedTag)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg shadow-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white border border-[#E3E8F0] rounded-xl p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-[#171C29] mb-1">
            No Projects Found
          </h3>
          <p className="text-sm text-[#707A8C]">
            {searchQuery || selectedTag
              ? "No projects matched your search filters. Try clearing tags or query."
              : "No showcased projects are currently available."}
          </p>
          {(searchQuery || selectedTag) && (
            <button
              type="button"
              onClick={() => {
                setSelectedTag("");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelectProject={(p) => setSelectedProject(p)}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
