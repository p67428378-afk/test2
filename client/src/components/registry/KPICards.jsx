import React from "react";
import { Layers, Shield, CheckCircle, AlertTriangle } from "lucide-react";

export default function KPICards({
  subjectsCount,
  versionsCount,
  currentCompatibility,
  validationPassRate,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Card 1 */}
      <div className="bg-[#1E293B] border border-[#334155] rounded p-4 hover:bg-[#2D3748] transition-colors relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-16 h-16 bg-[#4edea3]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold">
            Active Subjects
          </h3>
          <Layers className="text-[#94A3B8] w-5 h-5" />
        </div>
        <p className="text-3xl font-bold text-[#F8FAFC]">{subjectsCount}</p>
        <div className="mt-2 flex items-center gap-1 text-[#10b981]">
          <span className="text-xs font-medium">Registered subjects</span>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-[#1E293B] border border-[#334155] rounded p-4 hover:bg-[#2D3748] transition-colors relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-16 h-16 bg-[#bcc7de]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold">
            Total Schema Versions
          </h3>
          <Layers className="text-[#94A3B8] w-5 h-5" />
        </div>
        <p className="text-3xl font-bold text-[#F8FAFC]">{versionsCount}</p>
        <div className="mt-2 flex items-center gap-1 text-[#94A3B8]">
          <span className="text-xs">Across selected subject</span>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-[#1E293B] border border-[#334155] rounded p-4 hover:bg-[#2D3748] transition-colors relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-16 h-16 bg-[#4edea3]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold">
            Compatibility
          </h3>
          <Shield className="text-[#10b981] w-5 h-5" />
        </div>
        <p className="text-xl font-bold text-[#F8FAFC] mt-1">
          {currentCompatibility || "BACKWARD"}
        </p>
        <div className="mt-2 flex items-center gap-1 text-[#94A3B8]">
          <span className="text-xs">Subject policy enforced</span>
        </div>
      </div>

      {/* Card 4 */}
      <div className="bg-[#1E293B] border border-[#334155] rounded p-4 hover:bg-[#2D3748] transition-colors relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-16 h-16 bg-[#4edea3]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold">
            Validation Pass Rate
          </h3>
          <CheckCircle className="text-[#4edea3] w-5 h-5" />
        </div>
        <p className="text-3xl font-bold text-[#F8FAFC]">
          {validationPassRate}%
        </p>
        <div className="mt-2 flex items-center gap-1 text-[#94A3B8]">
          <span className="text-xs font-medium">
            Of all registration attempts
          </span>
        </div>
      </div>
    </div>
  );
}
