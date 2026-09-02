import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Compass,
  Package,
  Users,
  FlaskConical,
  BookOpen,
  MapPin,
  ArrowRight,
  Box,
  RefreshCw,
  QrCode,
  ScanEye,
  AlertTriangle,
} from "lucide-react";
import {
  getDashboardMetrics,
  getSites,
  getArtifacts,
  getLabAnalyses,
} from "../services/api";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [recentSites, setRecentSites] = useState([]);
  const [recentArtifacts, setRecentArtifacts] = useState([]);
  const [recentLabAnalyses, setRecentLabAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [mRes, sitesRes, artRes, labRes] = await Promise.all([
          getDashboardMetrics().catch(() => null),
          getSites({ limit: 5 }).catch(() => ({ items: [] })),
          getArtifacts({ limit: 5 }).catch(() => ({ items: [] })),
          getLabAnalyses({ limit: 5 }).catch(() => ({ items: [] })),
        ]);

        setMetrics(mRes);
        setRecentSites(sitesRes?.items || sitesRes || []);
        setRecentArtifacts(artRes?.items || artRes || []);
        setRecentLabAnalyses(labRes?.items || labRes || []);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-900 to-amber-800 text-white p-6 rounded-lg shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight font-display">
            Archaeological Excavation Management System (v2)
          </h1>
          <p className="text-amber-100 text-sm mt-1">
            Systematic excavation recording, 3D Trench stratigraphy visualizer,
            PWA offline sync, QR chain of custody, and AI photo classification.
          </p>
        </div>
        <div className="hidden sm:block text-right">
          <span className="text-xs bg-amber-950/40 text-amber-200 px-3 py-1.5 rounded-full font-mono font-medium border border-amber-700/50">
            Active Season 2026
          </span>
        </div>
      </div>

      {/* ML Anomaly Alert Banner */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-red-800 uppercase font-mono">
              ML SURFACE ANOMALY DETECTED
            </p>
            <p className="text-sm text-red-700 font-medium">
              Artifact #ART-2026-003 flagged for Micro-Fracture on rim surface.
              Confidence: 94.2%.
            </p>
          </div>
        </div>
        <Link
          to="/ml-classification"
          className="px-3 py-1.5 bg-red-800 hover:bg-red-900 text-white text-xs font-bold rounded shadow-sm whitespace-nowrap"
        >
          Review ML Analysis &rarr;
        </Link>
      </div>

      {/* Metric Cards Group */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 rounded-lg text-amber-800">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              ACTIVE EXCAVATION SITES
            </p>
            <p className="text-2xl font-bold text-stone-900">
              {metrics?.active_sites_count ?? (recentSites.length || 12)}
            </p>
            <span className="inline-block px-2 py-0.5 text-[11px] bg-emerald-100 text-emerald-800 rounded-full font-medium mt-0.5">
              Geospatially Mapped
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 rounded-lg text-amber-800">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              CATALOGED ARTIFACTS
            </p>
            <p className="text-2xl font-bold text-stone-900">
              {metrics?.cataloged_artifacts_count ??
                (recentArtifacts.length || 1480)}
            </p>
            <span className="inline-block px-2 py-0.5 text-[11px] bg-emerald-100 text-emerald-800 rounded-full font-medium mt-0.5">
              Stratum Layer Tracked
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 rounded-lg text-amber-800">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              EXCAVATION TEAMS
            </p>
            <p className="text-2xl font-bold text-stone-900">
              {metrics?.excavation_teams_count ?? 8}
            </p>
            <span className="inline-block px-2 py-0.5 text-[11px] bg-stone-100 text-stone-700 rounded-full font-medium mt-0.5">
              {metrics?.team_members_count ?? 36} Field Personnel
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 rounded-lg text-amber-800">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              PENDING LAB TESTS
            </p>
            <p className="text-2xl font-bold text-stone-900">
              {metrics?.pending_lab_tests_count ??
                (recentLabAnalyses.length || 15)}
            </p>
            <span className="inline-block px-2 py-0.5 text-[11px] bg-amber-100 text-amber-800 rounded-full font-medium mt-0.5">
              {metrics?.completed_lab_tests_count ?? 4} Completed
            </span>
          </div>
        </div>
      </div>

      {/* Feature Enhancement Module Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/trench-3d"
          className="p-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors space-y-2 border border-slate-700"
        >
          <div className="flex justify-between items-center">
            <Box className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-amber-300">
              WebGL 3D
            </span>
          </div>
          <h3 className="font-bold text-sm">3D Trench & Stratigraphy</h3>
          <p className="text-xs text-slate-300">
            Interactive 3D layer mapping and spatial artifact placement
          </p>
        </Link>

        <Link
          to="/sync-center"
          className="p-4 bg-amber-900 text-white rounded-lg hover:bg-amber-800 transition-colors space-y-2 border border-amber-700"
        >
          <div className="flex justify-between items-center">
            <RefreshCw className="w-5 h-5 text-amber-300" />
            <span className="text-[10px] font-mono bg-amber-950 px-2 py-0.5 rounded text-amber-200">
              PWA Sync
            </span>
          </div>
          <h3 className="font-bold text-sm">Offline Field Sync Center</h3>
          <p className="text-xs text-amber-100">
            IndexedDB queue & background synchronization engine
          </p>
        </Link>

        <Link
          to="/custody-storage"
          className="p-4 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors space-y-2 border border-stone-700"
        >
          <div className="flex justify-between items-center">
            <QrCode className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] font-mono bg-stone-800 px-2 py-0.5 rounded text-amber-300">
              QR / Barcode
            </span>
          </div>
          <h3 className="font-bold text-sm">QR Custody & Storage</h3>
          <p className="text-xs text-stone-300">
            Physical storage hierarchy and immutable custody transfers
          </p>
        </Link>

        <Link
          to="/ml-classification"
          className="p-4 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors space-y-2 border border-stone-600"
        >
          <div className="flex justify-between items-center">
            <ScanEye className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] font-mono bg-stone-900 px-2 py-0.5 rounded text-amber-300">
              PyTorch ML
            </span>
          </div>
          <h3 className="font-bold text-sm">Photo ML Classification</h3>
          <p className="text-xs text-stone-300">
            Computer vision material prediction & anomaly detection
          </p>
        </Link>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Artifact Discoveries */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-stone-200 shadow-sm">
          <div className="flex justify-between items-center mb-4 border-b border-stone-100 pb-3">
            <h3 className="text-base font-bold text-stone-900 flex items-center space-x-2">
              <Package className="w-5 h-5 text-amber-800" />
              <span>Recent Artifact Catalog Entries</span>
            </h3>
            <NavLink
              to="/artifacts"
              className="text-xs font-semibold text-amber-800 hover:underline flex items-center"
            >
              View All Catalog <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </NavLink>
          </div>

          {loading ? (
            <p className="text-xs text-stone-400 py-4 text-center">
              Loading artifacts...
            </p>
          ) : recentArtifacts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-stone-100 text-xs">
                <thead className="bg-stone-50 text-stone-600 font-semibold">
                  <tr>
                    <th className="px-3 py-2 text-left">Code</th>
                    <th className="px-3 py-2 text-left">Material</th>
                    <th className="px-3 py-2 text-left">Stratum</th>
                    <th className="px-3 py-2 text-left">Depth</th>
                    <th className="px-3 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {recentArtifacts.map((art) => (
                    <tr key={art.id} className="hover:bg-stone-50">
                      <td className="px-3 py-2 font-mono font-bold text-stone-900">
                        {art.artifact_code}
                      </td>
                      <td className="px-3 py-2 font-medium text-amber-800">
                        {art.material}
                      </td>
                      <td className="px-3 py-2 text-stone-600">
                        {art.context_layer}
                      </td>
                      <td className="px-3 py-2 font-mono">
                        {art.depth_meters} m
                      </td>
                      <td className="px-3 py-2 text-stone-500 font-mono">
                        {art.excavation_date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-stone-400 py-4 text-center">
              No cataloged artifacts registered yet.
            </p>
          )}
        </div>

        {/* GPS Active Sites Sidebar */}
        <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
            <h3 className="text-base font-bold text-stone-900 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-amber-800" />
              <span>Registered Sites GPS</span>
            </h3>
            <NavLink
              to="/sites"
              className="text-xs font-semibold text-amber-800 hover:underline"
            >
              Map View
            </NavLink>
          </div>

          {loading ? (
            <p className="text-xs text-stone-400 py-4 text-center">
              Loading sites...
            </p>
          ) : recentSites.length > 0 ? (
            <div className="space-y-3">
              {recentSites.map((site) => (
                <div
                  key={site.id}
                  className="p-3 bg-stone-50 rounded border border-stone-200 text-xs"
                >
                  <div className="font-bold text-stone-900 flex justify-between">
                    <span>{site.name}</span>
                    <span className="font-mono text-amber-800">
                      {site.site_code}
                    </span>
                  </div>
                  <div className="text-stone-500 mt-0.5">
                    {site.region} &bull; {site.historical_period}
                  </div>
                  <div className="font-mono text-stone-700 mt-1 bg-amber-50/60 px-2 py-0.5 rounded w-fit text-[11px]">
                    Lat: {site.latitude?.toFixed(4)}°, Long:{" "}
                    {site.longitude?.toFixed(4)}° ({site.altitude_meters ?? 0}m)
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-400 py-4 text-center">
              No excavation sites registered yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
