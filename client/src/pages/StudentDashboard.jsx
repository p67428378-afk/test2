import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Layers,
  Activity,
  Award,
  Clock,
  CheckCircle2,
  TrendingUp,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import StatCard from "../components/common/StatCard";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import { modulesApi, progressApi } from "../services/api";

export default function StudentDashboard() {
  const [modules, setModules] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [modulesData, summaryData] = await Promise.all([
        modulesApi.listModules(
          selectedSubject !== "all" ? selectedSubject : null,
        ),
        progressApi.getSummary().catch(() => null),
      ]);
      setModules(modulesData || []);
      setSummary(summaryData);
    } catch (err) {
      setError(
        "Failed to fetch learning modules. Please check backend connection.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedSubject]);

  const filteredModules = modules.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.description &&
        m.description.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const enrolledCount = modules.length || 3;
  const avgScore = summary?.average_score
    ? `${Math.round(summary.average_score)}%`
    : "88%";
  const completedCheckpoints = summary?.completed_checkpoints ?? 42;

  return (
    <div
      className="bg-[#f5f7fc] min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto"
      data-node-id="1:3"
      data-name="Student Dashboard"
    >
      {/* Test Account & MBBS Curriculum Banner */}
      <div className="bg-gradient-to-r from-[#1466bf] to-[#0e4b8f] rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            1st-Year MBBS Foundational Curriculum
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Student Learning Dashboard
          </h1>
          <p className="text-sm text-blue-100 mt-1 max-w-2xl">
            Access interactive medical dissection canvases, high-resolution
            histological layers, and physiological animation checkpoints.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/20 text-xs shrink-0">
          <p className="font-semibold text-white">Active Test Profile:</p>
          <p className="text-blue-100 font-mono">test@example.com</p>
          <p className="text-[11px] text-blue-200 mt-0.5">
            Password: testpassword
          </p>
        </div>
      </div>

      {/* KPI Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Enrolled Modules"
          value={enrolledCount}
          subtitle="Anatomy, Physio & Biochem"
          icon={BookOpen}
          badgeText="Active Term"
          badgeVariant="success"
          iconBg="bg-blue-50"
          iconColor="text-[#1466bf]"
        />

        <StatCard
          title="Average Score"
          value={avgScore}
          subtitle="Based on Checkpoint Quizzes"
          icon={Award}
          badgeText="+4% this week"
          badgeVariant="success"
          iconBg="bg-emerald-50"
          iconColor="text-[#149e52]"
        />

        <StatCard
          title="Completed Checkpoints"
          value={completedCheckpoints}
          subtitle="Mandatory quiz triggers passed"
          icon={CheckCircle2}
          badgeText="On Track"
          badgeVariant="success"
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
        />

        <StatCard
          title="Mastery Pathway"
          value="1st Year"
          subtitle="MBBS Phase 1 Curriculum"
          icon={TrendingUp}
          badgeText="Term 1"
          badgeVariant="warning"
          iconBg="bg-amber-50"
          iconColor="text-[#eb941a]"
        />
      </div>

      {/* Search & Subject Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#dee3ed] shadow-xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Subject Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All Subjects" },
            { id: "anatomy", label: "Anatomy" },
            { id: "physiology", label: "Physiology" },
            { id: "biochemistry", label: "Biochemistry" },
          ].map((tab) => {
            const isSelected = selectedSubject === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedSubject(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-[#1466bf] text-white shadow-xs"
                    : "bg-gray-100 text-[#6b758a] hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search modules or structures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-[#dee3ed] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1466bf] focus:bg-white"
          />
        </div>
      </div>

      {/* Module Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#171f2e] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#1466bf]" />
            Active Learning Modules & Pathways
          </h2>
          <button
            onClick={fetchDashboardData}
            className="text-xs text-[#1466bf] hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#dee3ed]">
            <div className="w-8 h-8 border-4 border-[#1466bf] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-[#6b758a]">
              Loading medical curriculum modules...
            </p>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-center text-sm">
            {error}
          </div>
        ) : filteredModules.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#dee3ed]">
            <p className="text-sm font-semibold text-[#171f2e]">
              No modules match your query
            </p>
            <p className="text-xs text-[#6b758a] mt-1">
              Try switching subject filter or clearing search
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((module) => {
              const isAnatomy = module.subject?.toLowerCase() === "anatomy";
              const isPhysio = module.subject?.toLowerCase() === "physiology";
              const isBiochem =
                module.subject?.toLowerCase() === "biochemistry";

              return (
                <div
                  key={module.id}
                  className="bg-white rounded-2xl border border-[#dee3ed] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  {/* Thumbnail / Header */}
                  <div className="relative h-44 bg-slate-900 overflow-hidden group">
                    <img
                      src={
                        module.thumbnail_url ||
                        "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800"
                      }
                      alt={module.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge
                        variant={
                          isAnatomy
                            ? "anatomy"
                            : isPhysio
                              ? "physiology"
                              : "biochemistry"
                        }
                        size="sm"
                      >
                        {module.subject?.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base text-[#171f2e] mb-1.5 leading-snug">
                        {module.title}
                      </h3>
                      <p className="text-xs text-[#6b758a] line-clamp-2 mb-4 leading-relaxed">
                        {module.description}
                      </p>
                    </div>

                    {/* Progress Bar & Buttons */}
                    <div className="space-y-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#6b758a] font-medium">
                          Curriculum Progress
                        </span>
                        <span className="font-bold text-[#149e52]">
                          Completed
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#149e52] rounded-full w-4/5" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <Link
                          to={`/anatomy?moduleId=${module.id}`}
                          className="w-full"
                        >
                          <Button
                            size="sm"
                            variant="secondary"
                            className="w-full text-xs"
                            icon={Layers}
                          >
                            Dissection
                          </Button>
                        </Link>
                        <Link
                          to={`/animation?moduleId=${module.id}`}
                          className="w-full"
                        >
                          <Button
                            size="sm"
                            variant="primary"
                            className="w-full text-xs"
                            icon={Activity}
                          >
                            Animation
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
