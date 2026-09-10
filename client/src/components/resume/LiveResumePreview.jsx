import React from "react";
import {
  Mail,
  Phone,
  Globe,
  Briefcase,
  GraduationCap,
  Wrench,
  Award,
} from "lucide-react";

export default function LiveResumePreview({ resumeData = {} }) {
  const {
    user_name = "Your Name",
    email = "email@example.com",
    phone = "",
    portfolio_url = "",
    template_id = "classic",
    experiences = [],
    education = [],
    skills = [],
  } = resumeData;

  const isModern = template_id === "modern";
  const isExecutive = template_id === "executive";
  const isMinimalist = template_id === "minimalist";

  return (
    <div className="w-full flex justify-center">
      {/* Paper Container - styled like an A4 sheet with responsive drop shadow */}
      <div
        id="resume-live-preview-sheet"
        className={`w-full max-w-[650px] min-h-[842px] bg-white text-slate-900 shadow-2xl rounded-sm p-6 sm:p-10 transition-all duration-300 border border-slate-200 ${
          template_id === "classic" ? "font-serif" : "font-sans"
        }`}
      >
        {/* ================= MODERN TEMPLATE ================= */}
        {isModern && (
          <div className="space-y-6">
            <div className="border-b-2 border-indigo-600 pb-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {user_name || "Jane Doe"}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-xs text-slate-600 font-sans">
                {email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    {email}
                  </span>
                )}
                {phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    {phone}
                  </span>
                )}
                {portfolio_url && (
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <a
                      href={
                        portfolio_url.startsWith("http")
                          ? portfolio_url
                          : `https://${portfolio_url}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline break-all"
                    >
                      {portfolio_url.replace(/^https?:\/\//, "")}
                    </a>
                  </span>
                )}
              </div>
            </div>

            {experiences && experiences.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5 border-b border-indigo-100 pb-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  Work Experience
                </h2>
                <div className="space-y-4">
                  {experiences.map((exp, idx) => (
                    <div
                      key={idx}
                      className="relative pl-3 border-l-2 border-indigo-200 space-y-1"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-1">
                        <span className="text-sm font-bold text-slate-900">
                          {exp.role || "Role Title"}
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                          {exp.start_date || "Start"} —{" "}
                          {exp.end_date || "Present"}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-indigo-600">
                        {exp.company || "Company Name"}
                      </div>
                      {exp.bullet_points &&
                        exp.bullet_points.filter(Boolean).length > 0 && (
                          <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-xs text-slate-700 leading-relaxed">
                            {exp.bullet_points
                              .filter(Boolean)
                              .map((bullet, bIdx) => (
                                <li key={bIdx}>{bullet}</li>
                              ))}
                          </ul>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {education && education.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5 border-b border-indigo-100 pb-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Education
                </h2>
                <div className="space-y-2.5">
                  {education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="flex flex-wrap items-baseline justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900">
                          {edu.degree || "Degree"}
                        </span>
                        <span className="text-slate-600">
                          , {edu.institution || "Institution"}
                        </span>
                      </div>
                      <span className="text-slate-500 font-medium">
                        {edu.completion_year || "Year"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {skills && skills.length > 0 && (
              <div className="space-y-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5 border-b border-indigo-100 pb-1">
                  <Wrench className="w-3.5 h-3.5" />
                  Skills & Expertise
                </h2>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 bg-indigo-50 text-indigo-800 text-[11px] font-medium rounded-full border border-indigo-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= EXECUTIVE TEMPLATE ================= */}
        {isExecutive && (
          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-5 rounded-lg">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {user_name || "Jane Doe"}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-300">
                {email && <span>{email}</span>}
                {phone && <span>• {phone}</span>}
                {portfolio_url && <span>• {portfolio_url}</span>}
              </div>
            </div>

            {experiences && experiences.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b-2 border-slate-900 pb-1">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  Executive Experience
                </h2>
                <div className="space-y-4">
                  {experiences.map((exp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex flex-wrap items-baseline justify-between">
                        <span className="text-sm font-bold text-slate-900">
                          {exp.role || "Executive Role"} —{" "}
                          {exp.company || "Enterprise"}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          {exp.start_date || "Start"} —{" "}
                          {exp.end_date || "Present"}
                        </span>
                      </div>
                      {exp.bullet_points &&
                        exp.bullet_points.filter(Boolean).length > 0 && (
                          <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-xs text-slate-700 leading-relaxed">
                            {exp.bullet_points
                              .filter(Boolean)
                              .map((bullet, bIdx) => (
                                <li key={bIdx}>{bullet}</li>
                              ))}
                          </ul>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {education && education.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1">
                  Education & Credentials
                </h2>
                <div className="space-y-2">
                  {education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="flex flex-wrap items-baseline justify-between text-xs"
                    >
                      <span className="font-bold text-slate-900">
                        {edu.degree}, {edu.institution}
                      </span>
                      <span className="text-slate-500">
                        {edu.completion_year}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {skills && skills.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1">
                  Core Competencies
                </h2>
                <div className="flex flex-wrap gap-2 pt-1">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded border border-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= MINIMALIST TEMPLATE ================= */}
        {isMinimalist && (
          <div className="space-y-5">
            <div className="pb-3 border-b border-slate-200">
              <h1 className="text-2xl font-light tracking-wide text-slate-900 uppercase">
                {user_name || "Jane Doe"}
              </h1>
              <p className="text-xs text-slate-500 mt-1 space-x-2">
                {email && <span>{email}</span>}
                {phone && <span>| {phone}</span>}
                {portfolio_url && <span>| {portfolio_url}</span>}
              </p>
            </div>

            {experiences && experiences.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
                  Experience
                </h2>
                <div className="space-y-3">
                  {experiences.map((exp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-900">
                          {exp.role} · {exp.company}
                        </span>
                        <span className="text-slate-400">
                          {exp.start_date} – {exp.end_date}
                        </span>
                      </div>
                      {exp.bullet_points &&
                        exp.bullet_points.filter(Boolean).length > 0 && (
                          <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-slate-600">
                            {exp.bullet_points
                              .filter(Boolean)
                              .map((bullet, bIdx) => (
                                <li key={bIdx}>{bullet}</li>
                              ))}
                          </ul>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {education && education.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
                  Education
                </h2>
                {education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span>
                      {edu.degree}, {edu.institution}
                    </span>
                    <span className="text-slate-400">
                      {edu.completion_year}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {skills && skills.length > 0 && (
              <div className="space-y-1.5">
                <h2 className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
                  Skills
                </h2>
                <p className="text-xs text-slate-600">{skills.join(" · ")}</p>
              </div>
            )}
          </div>
        )}

        {/* ================= CLASSIC TEMPLATE (Default) ================= */}
        {!isModern && !isExecutive && !isMinimalist && (
          <div className="space-y-5">
            {/* Centered Header */}
            <div className="text-center border-b border-slate-300 pb-4">
              <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide text-slate-900 font-serif">
                {user_name || "Jane Doe"}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-2 text-xs text-slate-600 font-sans">
                {email && <span>{email}</span>}
                {email && phone && <span>•</span>}
                {phone && <span>{phone}</span>}
                {(email || phone) && portfolio_url && <span>•</span>}
                {portfolio_url && (
                  <a
                    href={
                      portfolio_url.startsWith("http")
                        ? portfolio_url
                        : `https://${portfolio_url}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-700 underline break-all"
                  >
                    {portfolio_url.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
            </div>

            {/* Experience Section */}
            {experiences && experiences.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-400 pb-0.5 font-sans">
                  Professional Experience
                </h2>
                <div className="space-y-3.5">
                  {experiences.map((exp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex flex-wrap items-baseline justify-between text-xs">
                        <span className="font-bold text-slate-900">
                          {exp.role || "Job Title"} —{" "}
                          <span className="italic font-normal">
                            {exp.company || "Company"}
                          </span>
                        </span>
                        <span className="text-slate-600 font-sans text-[11px]">
                          {exp.start_date || "Start"} –{" "}
                          {exp.end_date || "Present"}
                        </span>
                      </div>
                      {exp.bullet_points &&
                        exp.bullet_points.filter(Boolean).length > 0 && (
                          <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700 leading-normal font-sans">
                            {exp.bullet_points
                              .filter(Boolean)
                              .map((bullet, bIdx) => (
                                <li key={bIdx}>{bullet}</li>
                              ))}
                          </ul>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Section */}
            {education && education.length > 0 && (
              <div className="space-y-2.5">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-400 pb-0.5 font-sans">
                  Education
                </h2>
                <div className="space-y-2">
                  {education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="flex flex-wrap items-baseline justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900">
                          {edu.degree || "Degree"}
                        </span>
                        <span className="italic text-slate-700">
                          , {edu.institution || "Institution"}
                        </span>
                      </div>
                      <span className="text-slate-600 font-sans text-[11px]">
                        {edu.completion_year || "Year"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills Section */}
            {skills && skills.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-400 pb-0.5 font-sans">
                  Skills
                </h2>
                <p className="text-xs text-slate-700 font-sans leading-relaxed">
                  {skills.join(", ")}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
