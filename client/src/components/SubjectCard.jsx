import React from "react";
import { Calendar, BookOpen, Trash2, Edit3, ChevronRight } from "lucide-react";

const SubjectCard = ({ subject, onSelect, onEdit, onDelete }) => {
  const {
    id,
    title,
    description,
    target_exam_date,
    total_topics = 0,
    completed_topics = 0,
    progress_percentage = 0,
  } = subject;

  const formattedDate = target_exam_date
    ? new Date(target_exam_date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-slate-900 line-clamp-1">
            {title}
          </h3>
          <div className="flex items-center space-x-1">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(subject);
                }}
                className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors"
                title="Edit Subject"
                aria-label="Edit Subject"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                title="Delete Subject"
                aria-label="Delete Subject"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {description && (
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {formattedDate && (
          <div className="flex items-center space-x-2 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md mb-4 w-fit">
            <Calendar className="h-3.5 w-3.5" />
            <span>Target Exam: {formattedDate}</span>
          </div>
        )}

        <div className="space-y-1 mb-4">
          <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {completed_topics} / {total_topics} topics completed
            </span>
            <span className="text-indigo-700 font-semibold">
              {Math.round(progress_percentage)}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.max(0, progress_percentage))}%`,
              }}
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => onSelect && onSelect(subject)}
        className="w-full mt-2 py-2 px-3 bg-slate-50 hover:bg-indigo-50 text-indigo-700 font-medium text-sm rounded-lg flex items-center justify-center space-x-1 transition-colors border border-slate-200"
      >
        <span>Manage Topics</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default SubjectCard;
