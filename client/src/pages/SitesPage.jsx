import React, { useState, useEffect } from "react";
import { Compass, Search, Filter, RefreshCw } from "lucide-react";
import SiteForm from "../components/sites/SiteForm";
import SiteTable from "../components/sites/SiteTable";
import { getSites, createSite, deleteSite } from "../services/api";

export default function SitesPage() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [periodFilter, setPeriodFilter] = useState("");

  const fetchSitesList = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (regionFilter) params.region = regionFilter;
      if (periodFilter) params.period = periodFilter;

      const data = await getSites(params);
      setSites(data.items || []);
    } catch (err) {
      console.error("Failed to fetch sites:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSitesList();
  }, [search, regionFilter, periodFilter]);

  const handleCreateSite = async (sitePayload) => {
    await createSite(sitePayload);
    await fetchSitesList();
  };

  const handleDeleteSite = async (siteId) => {
    if (
      window.confirm("Are you sure you want to delete this excavation site?")
    ) {
      try {
        await deleteSite(siteId);
        await fetchSitesList();
      } catch (err) {
        console.error("Failed to delete site:", err);
        alert(
          "Failed to delete site. Ensure no linked artifacts or teams remain.",
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-lg border border-stone-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 flex items-center space-x-2 font-display">
            <Compass className="w-6 h-6 text-amber-800" />
            <span>Excavation Sites & GPS Geospatial Tracking</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Record detailed site metadata, historical period, region, and
            precise GPS coordinates (Latitude [-90, 90], Longitude [-180, 180],
            Altitude).
          </p>
        </div>

        <button
          onClick={fetchSitesList}
          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-medium flex items-center space-x-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-5">
          <SiteForm onSiteCreated={handleCreateSite} />
        </div>

        {/* Directory Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search site name or code..."
                className="w-full pl-9 pr-3 py-1.5 border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-800"
              />
            </div>

            <div className="flex space-x-2 w-full sm:w-auto">
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="px-2.5 py-1.5 border border-stone-300 rounded text-xs bg-white text-stone-700"
              >
                <option value="">All Regions</option>
                <option value="Mediterranean">Mediterranean</option>
                <option value="Near East">Near East</option>
                <option value="North Africa">North Africa</option>
              </select>

              <select
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                className="px-2.5 py-1.5 border border-stone-300 rounded text-xs bg-white text-stone-700"
              >
                <option value="">All Periods</option>
                <option value="Bronze Age">Bronze Age</option>
                <option value="Hellenistic">Hellenistic</option>
                <option value="Old Kingdom">Old Kingdom</option>
                <option value="Neolithic">Neolithic</option>
              </select>
            </div>
          </div>

          <SiteTable
            sites={sites}
            loading={loading}
            onDeleteSite={handleDeleteSite}
          />
        </div>
      </div>
    </div>
  );
}
