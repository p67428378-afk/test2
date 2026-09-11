import React, { useState } from "react";
import { GitCommit, History, FileText, ArrowRight } from "lucide-react";

export default function VersionDiffViewer({ versions = [], currentContract }) {
  const [selectedV1, setSelectedV1] = useState(versions[0]?.id || null);
  const [selectedV2, setSelectedV2] = useState(
    versions[versions.length - 1]?.id || null,
  );

  const ver1 = versions.find((v) => v.id === selectedV1) || versions[0];
  const ver2 =
    versions.find((v) => v.id === selectedV2) ||
    versions[versions.length - 1] ||
    ver1;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-base">
            Contract Version History & Diff Comparison
          </h3>
        </div>
      </div>

      {/* Version Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Baseline Version (Older)
          </label>
          <select
            value={selectedV1 || ""}
            onChange={(e) => setSelectedV1(e.target.value)}
            className="w-full text-xs border border-slate-300 rounded-md p-2 bg-white"
          >
            {versions.map((v) => (
              <option key={v.id} value={v.id}>
                {v.version_string || `v${v.version_number}.0`} -{" "}
                {new Date(v.created_at).toLocaleDateString()} (
                {v.change_summary || "No summary"})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Comparison Version (Newer)
          </label>
          <select
            value={selectedV2 || ""}
            onChange={(e) => setSelectedV2(e.target.value)}
            className="w-full text-xs border border-slate-300 rounded-md p-2 bg-white"
          >
            {versions.map((v) => (
              <option key={v.id} value={v.id}>
                {v.version_string || `v${v.version_number}.0`} -{" "}
                {new Date(v.created_at).toLocaleDateString()} (
                {v.change_summary || "No summary"})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Redline Side-by-Side Comparison */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span>{ver1?.version_string || "Baseline Version"} Terms</span>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <span>{ver2?.version_string || "Comparison Version"} Terms</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900 font-mono whitespace-pre-wrap leading-relaxed min-h-[120px]">
            <div className="font-sans font-bold text-rose-800 border-b border-rose-200 pb-1 mb-2 flex justify-between">
              <span>{ver1?.version_string || "v1.0"}</span>
              <span className="text-[10px] text-rose-600 font-normal">
                Original Terms
              </span>
            </div>
            {ver1?.terms_content ||
              currentContract?.terms ||
              "No terms specified for this version."}
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 font-mono whitespace-pre-wrap leading-relaxed min-h-[120px]">
            <div className="font-sans font-bold text-emerald-800 border-b border-emerald-200 pb-1 mb-2 flex justify-between">
              <span>{ver2?.version_string || "v1.1"}</span>
              <span className="text-[10px] text-emerald-600 font-normal">
                Updated Terms
              </span>
            </div>
            {ver2?.terms_content ||
              currentContract?.terms ||
              "No terms specified for this version."}
          </div>
        </div>
      </div>

      {/* Version Timeline */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          Version Log Timeline
        </h4>
        <div className="space-y-2">
          {versions.map((ver) => (
            <div
              key={ver.id}
              className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-md border border-slate-200"
            >
              <div className="flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-indigo-600" />
                <span className="font-bold font-mono text-slate-900">
                  {ver.version_string || `v${ver.version_number}.0`}
                </span>
                <span className="text-slate-500">
                  — {ver.change_summary || "Contract snapshot created"}
                </span>
              </div>
              <span className="text-slate-400 text-[11px]">
                {new Date(ver.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
