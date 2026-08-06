import React, { useState } from "react";
import { BookOpen, Search, HelpCircle, Award, CheckCircle } from "lucide-react";

export default function LessonCardGrid({
  lessons,
  onSelectLesson,
  completedLessonIds = [],
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "all",
    "Nutrition",
    "Exercise",
    "Hygiene",
    "Sleep",
    "General",
  ];

  const filteredLessons = (lessons || []).filter((lesson) => {
    const matchesCategory =
      selectedCategory === "all" ||
      (lesson.category || "").toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      (lesson.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lesson.content || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Lesson Cards Grid */}
      {filteredLessons.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
          <BookOpen className="h-10 w-10 text-slate-500 mx-auto mb-3" />
          <p className="font-semibold text-slate-300">No lessons found.</p>
          <p className="text-xs mt-1">
            Try selecting another topic filter or search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLessons.map((lesson) => {
            const isCompleted = completedLessonIds.includes(lesson.id);
            return (
              <div
                key={lesson.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                      {lesson.category || "Health"}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                      <Award className="h-3.5 w-3.5" />+
                      {lesson.points_value || 15} pts
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-100 group-hover:text-emerald-400 transition-colors mb-2">
                    {lesson.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                    {lesson.content ||
                      "Learn fun facts and best habits to keep your body strong and energized every day!"}
                  </p>
                </div>

                <button
                  onClick={() => onSelectLesson(lesson)}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    isCompleted
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md"
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      <span>Completed - Play Again</span>
                    </>
                  ) : (
                    <>
                      <HelpCircle className="h-4 w-4" />
                      <span>Start Lesson & Quiz</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
