import React from "react";
import { CheckCircle, History } from "lucide-react";

export default function VersionHistory({ versions, currentSubject }) {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded flex flex-col h-[500px]">
      <div className="p-4 border-b border-[#334155] flex justify-between items-center bg-[#171f33] rounded-t">
        <h2 class="text-sm font-semibold text-[#F8FAFC]">
          Schema Version History
        </h2>
        <span className="text-xs text-[#94A3B8] px-2 py-1 bg-[#0F172A] rounded border border-[#334155]">
          Subject: {currentSubject}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        {versions.length === 0 ? (
          <div className="text-center text-[#94A3B8] py-8">
            No versions registered yet.
          </div>
        ) : (
          <>
            {/* Vertical Timeline Line */}
            <div className="absolute left-8 top-4 bottom-4 w-px bg-[#334155] z-0"></div>

            {versions.map((v, idx) => (
              <div key={v.id} className="relative z-10 flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0F172A] border-2 border-[#10b981] flex items-center justify-center shrink-0 mt-1">
                  {idx === 0 ? (
                    <CheckCircle className="text-[#10b981] w-4 h-4" />
                  ) : (
                    <History className="text-[#94A3B8] w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 bg-[#0F172A] border border-[#10b981]/30 rounded p-3 hover:border-[#10b981]/60 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#F8FAFC]">
                        v{v.version}
                      </span>
                      {idx === 0 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20">
                          LATEST
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#94A3B8]">
                      {new Date(v.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mb-3">
                    {currentSubject}-v{v.version} • Registered successfully
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/20">
                    <CheckCircle className="text-[#10b981] w-3.5 h-3.5" />
                    <span className="text-[11px] font-semibold text-[#10b981]">
                      BACKWARD COMPATIBLE
                    </span>
                  </div>

                  {/* Schema Definition Preview */}
                  <details className="mt-3">
                    <summary className="text-xs text-[#94A3B8] cursor-pointer hover:text-[#F8FAFC] transition-colors select-none">
                      View Schema JSON
                    </summary>
                    <pre className="mt-2 p-2 bg-[#1E293B] rounded text-xs font-mono text-[#E2E8F0] overflow-x-auto max-h-40">
                      {JSON.stringify(v.schema_definition, null, 2)}
                    </pre>
                  </details>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
