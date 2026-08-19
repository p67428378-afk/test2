import React, { useState, useEffect } from "react";
import { getTechnicians } from "../services/api";
import { Users, Mail, ShieldCheck, UserCheck } from "lucide-react";

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTechs() {
      setLoading(true);
      setError("");
      try {
        const data = await getTechnicians();
        setTechnicians(data || []);
      } catch (err) {
        console.error("Failed to load technicians:", err);
        setError("Error loading technicians list.");
      } finally {
        setLoading(false);
      }
    }
    loadTechs();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[#171c29]">
          Active Technicians & Staff
        </h1>
        <p className="text-sm text-[#707a8c] mt-1">
          Registered electricity maintenance technicians available for task
          assignment.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl"
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-[#707a8c]">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-[#1f40b0] border-r-transparent align-[-0.125em]" />
          <p className="mt-2 text-sm font-medium">
            Loading technicians directory...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technicians.map((tech) => (
            <div
              key={tech.id}
              className="bg-white border border-[#e3e8f0] rounded-xl p-5 shadow-sm flex items-start gap-4"
            >
              <div className="bg-[#1f40b0]/10 text-[#1f40b0] p-3 rounded-full shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#171c29] text-base truncate">
                    {tech.full_name}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <UserCheck className="w-3 h-3" />
                    Active
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#707a8c] mt-2 truncate">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{tech.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#707a8c] mt-1">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                  <span className="capitalize">
                    {tech.role || "Technician"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
