import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, User, CheckCircle, Plus } from "lucide-react";

const CourseCard = ({ course, isEnrolled, onEnroll, progress = 0 }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow border border-slate-200 flex flex-col justify-between hover:shadow-md transition">
      <div>
        <div className="flex justify-between items-start mb-2">
          <span className="bg-indigo-100 text-indigo-950 font-bold px-2.5 py-1 rounded text-xs">
            {course.course_code}
          </span>
          <span className="text-xs font-medium text-slate-500">
            {course.semester || "Fall 2026"}
          </span>
        </div>

        <h3 className="font-bold text-slate-800 text-base line-clamp-1">
          {course.title}
        </h3>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span>{course.instructor?.full_name || "Faculty Instructor"}</span>
        </p>

        {course.description && (
          <p className="text-xs text-slate-600 mt-2 line-clamp-2">
            {course.description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        {isEnrolled ? (
          <div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(Math.max(progress, 10), 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Enrolled
              </span>
              <Link
                to={`/courses/${course.id}`}
                className="px-3 py-1 bg-indigo-950 text-white rounded text-xs font-semibold hover:bg-indigo-900 transition"
              >
                View Course
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">
              {course.enrollment_count || 0} Students
            </span>
            <button
              onClick={() => onEnroll && onEnroll(course.id)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-indigo-950 font-bold rounded text-xs shadow-sm flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Enroll Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
