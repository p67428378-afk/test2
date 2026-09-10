import React from "react";
import {
  CheckCircle2,
  Layout,
  Sparkles,
  Award,
  FileText,
  Feather,
} from "lucide-react";

export const RESUME_TEMPLATES = [
  {
    id: "classic",
    name: "Classic Template",
    icon: FileText,
    badge: "Traditional",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-300",
    description:
      "Traditional, serif-accented layout with clean horizontal rules and centered header. Ideal for academic, corporate, finance, and legal roles.",
    previewHeaderBg: "bg-slate-100 text-slate-800",
    fontFamily: "font-serif",
  },
  {
    id: "modern",
    name: "Modern Template",
    icon: Sparkles,
    badge: "Popular",
    badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
    description:
      "Contemporary layout with indigo accent headings, left border timeline markers, and pill badge skills. Ideal for tech, creative, and startups.",
    previewHeaderBg: "bg-indigo-600 text-white",
    fontFamily: "font-sans",
  },
  {
    id: "executive",
    name: "Executive Template",
    icon: Award,
    badge: "Senior Roles",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    description:
      "Sleek navy-and-gold aesthetic emphasizing career progression, leadership milestones, and core competencies.",
    previewHeaderBg: "bg-slate-800 text-amber-300",
    fontFamily: "font-sans",
  },
  {
    id: "minimalist",
    name: "Minimalist Template",
    icon: Feather,
    badge: "Clean & Simple",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    description:
      "Ultra-clean spacing, high-legibility typography, and no extraneous visual clutter for an ATS-optimized CV.",
    previewHeaderBg: "bg-slate-200 text-slate-900",
    fontFamily: "font-sans",
  },
];

export default function TemplateCardGrid({
  selectedTemplate = "classic",
  onSelectTemplate,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {RESUME_TEMPLATES.map((tpl) => {
        const isSelected = selectedTemplate === tpl.id;
        const IconComponent = tpl.icon || Layout;

        return (
          <div
            key={tpl.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelectTemplate && onSelectTemplate(tpl.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectTemplate && onSelectTemplate(tpl.id);
              }
            }}
            className={`cursor-pointer rounded-xl p-4 border-2 transition relative flex flex-col justify-between ${
              isSelected
                ? "border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20 shadow-sm"
                : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        {tpl.name}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tpl.badgeColor}`}
                      >
                        {tpl.badge}
                      </span>
                    </div>
                  </div>
                </div>
                {isSelected ? (
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-300 shrink-0" />
                )}
              </div>

              <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
                {tpl.description}
              </p>
            </div>

            {/* Thumbnail preview mockup */}
            <div
              className={`mt-3 p-2.5 bg-white rounded-lg border border-slate-200 ${tpl.fontFamily} text-[8px] text-slate-700 leading-tight select-none shadow-2xs`}
            >
              <div
                className={`text-center font-bold py-1 px-2 rounded-xs mb-1 ${tpl.previewHeaderBg}`}
              >
                CANDIDATE NAME
              </div>
              <div className="text-center text-[7px] text-slate-400 mb-1">
                email@example.com | (555) 000-0000
              </div>
              <div className="font-bold uppercase text-[7px] border-b border-slate-200 pb-0.5 mb-1 text-slate-600">
                Experience
              </div>
              <div className="text-[7px] text-slate-600">
                • Senior Software Engineer - Acme Corp
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
