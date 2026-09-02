import React, { useState, useEffect } from "react";
import { Package, Search, Filter, RefreshCw, Camera } from "lucide-react";
import ArtifactForm from "../components/artifacts/ArtifactForm";
import ArtifactTable from "../components/artifacts/ArtifactTable";
import PhotoUploader from "../components/media/PhotoUploader";
import {
  getArtifacts,
  createArtifact,
  deleteArtifact,
  getSites,
  getAllTeamMembers,
} from "../services/api";

export default function ArtifactsPage() {
  const [artifacts, setArtifacts] = useState([]);
  const [sites, setSites] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [siteFilter, setSiteFilter] = useState("");
  const [materialFilter, setMaterialFilter] = useState("");

  // Selected artifact for photo upload
  const [selectedArtifact, setSelectedArtifact] = useState(null);

  const fetchInitialData = async () => {
    try {
      const [sRes, mRes] = await Promise.all([
        getSites().catch(() => ({ items: [] })),
        getAllTeamMembers().catch(() => []),
      ]);
      setSites(sRes.items || []);
      setMembers(mRes || []);
    } catch (err) {
      console.error("Error loading sites/members for artifacts:", err);
    }
  };

  const fetchArtifactsList = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (siteFilter) params.site_id = siteFilter;
      if (materialFilter) params.material = materialFilter;

      const data = await getArtifacts(params);
      setArtifacts(data.items || []);
    } catch (err) {
      console.error("Failed to fetch artifacts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchArtifactsList();
  }, [search, siteFilter, materialFilter]);

  const handleCreateArtifact = async (artifactPayload) => {
    await createArtifact(artifactPayload);
    await fetchArtifactsList();
  };

  const handleDeleteArtifact = async (artifactId) => {
    if (
      window.confirm("Are you sure you want to delete this cataloged artifact?")
    ) {
      try {
        await deleteArtifact(artifactId);
        await fetchArtifactsList();
      } catch (err) {
        console.error("Failed to delete artifact:", err);
        alert("Failed to delete artifact.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-lg border border-stone-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 flex items-center space-x-2 font-display">
            <Package className="w-6 h-6 text-amber-800" />
            <span>Artifact Recording & Cataloging</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Log discovered artifacts linked to excavation sites, stratum context
            layer, depth in meters, excavation date, and discoverer.
          </p>
        </div>

        <button
          onClick={fetchArtifactsList}
          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-medium flex items-center space-x-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-5 space-y-6">
          <ArtifactForm
            sites={sites}
            members={members}
            onArtifactCreated={handleCreateArtifact}
          />

          {selectedArtifact ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-amber-50 p-2 rounded text-xs text-amber-900 border border-amber-200">
                <span>
                  Attaching photos to{" "}
                  <strong>{selectedArtifact.artifact_code}</strong>
                </span>
                <button
                  onClick={() => setSelectedArtifact(null)}
                  className="text-amber-800 font-bold hover:underline"
                >
                  Clear Selection
                </button>
              </div>
              <PhotoUploader
                siteId={selectedArtifact.site_id}
                artifactId={selectedArtifact.id}
                onMediaUploaded={() => fetchArtifactsList()}
              />
            </div>
          ) : (
            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 text-center text-xs text-stone-500">
              <Camera className="w-6 h-6 mx-auto text-stone-400 mb-1" />
              <span>
                Select an artifact from the table to attach high-resolution
                photographs & metadata.
              </span>
            </div>
          )}
        </div>

        {/* Catalog Table Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search artifact code..."
                className="w-full pl-9 pr-3 py-1.5 border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-800"
              />
            </div>

            <div className="flex space-x-2 w-full sm:w-auto">
              <select
                value={siteFilter}
                onChange={(e) => setSiteFilter(e.target.value)}
                className="px-2.5 py-1.5 border border-stone-300 rounded text-xs bg-white text-stone-700"
              >
                <option value="">All Sites</option>
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <select
                value={materialFilter}
                onChange={(e) => setMaterialFilter(e.target.value)}
                className="px-2.5 py-1.5 border border-stone-300 rounded text-xs bg-white text-stone-700"
              >
                <option value="">All Materials</option>
                <option value="Ceramic">Ceramic</option>
                <option value="Bronze">Bronze</option>
                <option value="Lithic">Lithic</option>
                <option value="Bone">Bone</option>
                <option value="Organic">Organic</option>
                <option value="Glass">Glass</option>
              </select>
            </div>
          </div>

          <ArtifactTable
            artifacts={artifacts}
            loading={loading}
            onDeleteArtifact={handleDeleteArtifact}
            onSelectArtifact={(art) => setSelectedArtifact(art)}
          />
        </div>
      </div>
    </div>
  );
}
