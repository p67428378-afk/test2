import React, { useState } from "react";
import {
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  Send,
  GraduationCap,
  BookOpen,
  User,
} from "lucide-react";

export default function MatchExplorer({
  matches = [],
  isLoading = false,
  onSearch,
  onRequestExchange,
}) {
  const [query, setQuery] = useState("");
  const [proficiency, setProficiency] = useState("");
  const [reciprocalOnly, setReciprocalOnly] = useState(false);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    onSearch({
      query: query.trim() || undefined,
      proficiency: proficiency || undefined,
      reciprocal_only: reciprocalOnly,
    });
  };

  const handleReset = () => {
    setQuery("");
    setProficiency("");
    setReciprocalOnly(false);
    onSearch({});
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleFilterSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Keyword search input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search skill or partner name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Proficiency filter */}
            <div>
              <select
                value={proficiency}
                onChange={(e) => setProficiency(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Proficiency Levels</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>

            {/* Reciprocal match toggle */}
            <div className="flex items-center">
              <label className="inline-flex items-center cursor-pointer text-sm font-medium text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={reciprocalOnly}
                  onChange={(e) => setReciprocalOnly(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="ml-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Reciprocal Matches Only
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Matches Grid */}
      {isLoading ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-600">
            Discovering matching skill exchange partners...
          </p>
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 px-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            No Matching Exchange Partners Found
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            Try adding more skills to your "Learn" profile list, or adjust your
            search filters to widen the match discovery.
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-medium rounded-lg"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Header with partner info & reciprocal badge */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-base">
                      {match.partner_name
                        ? match.partner_name.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {match.partner_name}
                      </h4>
                      {match.partner_email && (
                        <p className="text-xs text-slate-500">
                          {match.partner_email}
                        </p>
                      )}
                    </div>
                  </div>

                  {match.is_reciprocal && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-purple-100 text-purple-800 rounded-full border border-purple-200 shadow-xs">
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      Reciprocal
                    </span>
                  )}
                </div>

                {/* Skill exchange offer details */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  {/* Partner teaches */}
                  <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                    <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5 mb-1">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                      Partner Teaches You:
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">
                        {match.teaches_skill.skill_name}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded">
                        {match.teaches_skill.proficiency}
                      </span>
                    </div>
                  </div>

                  {/* Partner wants to learn (if reciprocal or specified) */}
                  {match.learns_skill ? (
                    <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100">
                      <div className="text-xs font-semibold text-blue-800 flex items-center gap-1.5 mb-1">
                        <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                        You Teach Partner:
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">
                          {match.learns_skill.skill_name}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 bg-blue-200 text-blue-900 rounded">
                          {match.learns_skill.proficiency}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="text-xs text-slate-500">
                        Select a skill from your Teach profile when requesting
                        exchange.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Request Exchange Action Button */}
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button
                  onClick={() => onRequestExchange(match)}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Skill Exchange</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
