import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
  Folder,
} from "lucide-react";

const ModuleAccordion = ({ modules }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  const defaultModules = [
    {
      title: "Module 1: Course Introduction & Overview",
      materials: [
        { name: "CS101_Syllabus_Fall2026.pdf", type: "pdf" },
        { name: "Lecture_1_Slides.pdf", type: "pdf" },
      ],
    },
    {
      title: "Module 2: Programming Fundamentals & Data Structures",
      materials: [
        { name: "Lecture_2_Slides.pdf", type: "pdf" },
        { name: "Code_Examples.zip", type: "zip" },
        { name: "Practice_Problems.pdf", type: "pdf" },
      ],
    },
  ];

  const displayModules =
    modules && modules.length > 0 ? modules : defaultModules;

  return (
    <div className="space-y-4">
      {displayModules.map((mod, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm"
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full bg-slate-100 p-4 font-bold text-slate-800 border-l-4 border-indigo-950 flex justify-between items-center text-left hover:bg-slate-200 transition"
            >
              <div className="flex items-center gap-2">
                <Folder className="w-5 h-5 text-indigo-950" />
                <span>{mod.title || `Module ${idx + 1}`}</span>
              </div>
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {isOpen && (
              <div className="p-4 space-y-2 bg-white border-t border-slate-100">
                {mod.materials && mod.materials.length > 0 ? (
                  mod.materials.map((mat, mIdx) => {
                    const matName = typeof mat === "string" ? mat : mat.name;
                    return (
                      <div
                        key={mIdx}
                        className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2 text-indigo-700 text-sm font-medium">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          <span>{matName}</span>
                        </div>
                        <a
                          href={`#download-${mIdx}`}
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`Simulating download of ${matName}`);
                          }}
                          className="text-xs text-indigo-950 hover:text-amber-600 font-semibold flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded"
                        >
                          <Download className="w-3.5 h-3.5" /> Download
                        </a>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    No materials uploaded for this module.
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ModuleAccordion;
