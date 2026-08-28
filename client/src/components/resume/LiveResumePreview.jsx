import React from "react";
import {
  Mail,
  Phone,
  Calendar,
  Building,
  GraduationCap,
  Award,
  Wrench,
} from "lucide-react";

export default function LiveResumePreview({ resumeData, theme = "modern" }) {
  const {
    title = "",
    full_name = "",
    email = "",
    phone = "",
    summary = "",
    experiences = [],
    education = [],
    skills = [],
  } = resumeData || {};

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-[#e3e8f0] overflow-hidden transition-all print:shadow-none print:border-none">
      {/* Paper Container */}
      <div className="p-8 sm:p-10 max-w-3xl mx-auto bg-white min-h-[600px] flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="border-b-2 border-blue-600 pb-5 mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {full_name || "Your Full Name"}
            </h1>
            <p className="text-base sm:text-lg font-semibold text-blue-600 mt-1">
              {title || "Target Job Title / Specialization"}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-600 mt-3">
              {email && (
                <div className="flex items-center space-x-1.5">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{email}</span>
                </div>
              )}
              {phone && (
                <div className="flex items-center space-x-1.5">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          {summary && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded inline-block mb-2">
                Professional Summary
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {summary}
              </p>
            </div>
          )}

          {/* Experience Section */}
          {experiences && experiences.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded inline-block mb-3 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" />
                <span>Work Experience</span>
              </h2>

              <div className="space-y-4">
                {experiences.map((exp, idx) => (
                  <div
                    key={exp.id || idx}
                    className="relative pl-4 border-l-2 border-blue-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-sm font-bold text-gray-900">
                        {exp.role || "Role Title"}
                      </h3>
                      <div className="text-xs font-medium text-gray-500 flex items-center gap-1 mt-0.5 sm:mt-0">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span>
                          {formatDate(exp.start_date)} –{" "}
                          {exp.is_current
                            ? "Present"
                            : formatDate(exp.end_date) || "Present"}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-blue-600">
                      {exp.company_name || "Company"}
                    </p>
                    {exp.description && (
                      <p className="text-xs text-gray-600 mt-1.5 whitespace-pre-line leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {education && education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded inline-block mb-3 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Education</span>
              </h2>

              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div
                    key={edu.id || idx}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        {edu.degree || "Degree"}
                      </h3>
                      <p className="text-xs text-gray-600 font-medium">
                        {edu.institution || "Institution"}
                      </p>
                    </div>
                    <div className="text-xs font-medium text-gray-500 mt-0.5 sm:mt-0">
                      {formatDate(edu.start_date)}
                      {edu.end_date ? ` – ${formatDate(edu.end_date)}` : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Section */}
          {skills && skills.length > 0 && (
            <div className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded inline-block mb-2 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" />
                <span>Skills &amp; Expertise</span>
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => {
                  const name =
                    typeof skill === "string" ? skill : skill?.skill_name || "";
                  return (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded bg-gray-100 text-gray-800 text-xs font-semibold border border-gray-200"
                    >
                      {name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-gray-100 pt-3 mt-6 text-center text-2xs text-gray-400">
          Generated via QuickResume Maker
        </div>
      </div>
    </div>
  );
}
