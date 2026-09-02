import React, { useState, useEffect } from "react";
import { BookOpen, Search, RefreshCw } from "lucide-react";
import PublicationForm from "../components/publications/PublicationForm";
import PublicationTable from "../components/publications/PublicationTable";
import {
  getPublications,
  createPublication,
  deletePublication,
  getArtifacts,
} from "../services/api";

export default function PublicationsPage() {
  const [publications, setPublications] = useState([]);
  const [artifacts, setArtifacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [doiFilter, setDoiFilter] = useState("");

  const fetchArtifactsList = async () => {
    try {
      const data = await getArtifacts({ limit: 100 });
      setArtifacts(data.items || []);
    } catch (err) {
      console.error("Error fetching artifacts for publication linking:", err);
    }
  };

  const fetchPublicationsList = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (doiFilter.trim()) params.doi = doiFilter.trim();

      const data = await getPublications(params);
      setPublications(data.items || []);
    } catch (err) {
      console.error("Failed to fetch publications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtifactsList();
  }, []);

  useEffect(() => {
    fetchPublicationsList();
  }, [search, doiFilter]);

  const handleCreatePublication = async (payload) => {
    await createPublication(payload);
    await fetchPublicationsList();
  };

  const handleDeletePublication = async (pubId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this publication citation record?",
      )
    ) {
      try {
        await deletePublication(pubId);
        await fetchPublicationsList();
      } catch (err) {
        console.error("Failed to delete publication:", err);
        alert("Failed to delete publication record.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-lg border border-stone-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 flex items-center space-x-2 font-display">
            <BookOpen className="w-6 h-6 text-amber-800" />
            <span>Publication History & Citation Registry</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Record academic citations, articles, monographs, DOIs, authors,
            journal publishers, and cross-link findings to cataloged artifacts.
          </p>
        </div>

        <button
          onClick={fetchPublicationsList}
          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-medium flex items-center space-x-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-5">
          <PublicationForm
            artifacts={artifacts}
            onPublicationCreated={handleCreatePublication}
          />
        </div>

        {/* Registry Table Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, author, journal..."
                className="w-full pl-9 pr-3 py-1.5 border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-800"
              />
            </div>

            <div className="w-full sm:w-auto">
              <input
                type="text"
                value={doiFilter}
                onChange={(e) => setDoiFilter(e.target.value)}
                placeholder="Filter by DOI..."
                className="px-3 py-1.5 border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-800 w-full sm:w-44"
              />
            </div>
          </div>

          <PublicationTable
            publications={publications}
            loading={loading}
            onDeletePublication={handleDeletePublication}
          />
        </div>
      </div>
    </div>
  );
}
