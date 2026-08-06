import React, { useState } from "react";
import LessonCardGrid from "../components/lessons/LessonCardGrid.jsx";
import QuizModalCard from "../components/lessons/QuizModalCard.jsx";
import { BookOpen } from "lucide-react";

export default function LessonsPage({
  lessons,
  onSubmitQuiz,
  completedLessonIds = [],
}) {
  const [selectedLesson, setSelectedLesson] = useState(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-2 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="h-4 w-4" />
          <span>Interactive Health Academy</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
          Fun Health Habits Lessons & Quizzes
        </h1>
        <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
          Explore short, fun interactive lessons about hydration, nutrition,
          sleep, and hygiene. Answer quiz questions to test your knowledge and
          earn extra reward points!
        </p>
      </div>

      {/* Lesson Catalog Grid */}
      <LessonCardGrid
        lessons={lessons}
        onSelectLesson={(lesson) => setSelectedLesson(lesson)}
        completedLessonIds={completedLessonIds}
      />

      {/* Quiz Modal */}
      {selectedLesson && (
        <QuizModalCard
          lesson={selectedLesson}
          onClose={() => setSelectedLesson(null)}
          onSubmitQuiz={onSubmitQuiz}
        />
      )}
    </div>
  );
}
