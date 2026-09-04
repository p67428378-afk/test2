import React from "react";
import { Sparkles, Clock, BookOpen, ArrowRight, Award } from "lucide-react";

const AIRecommendationCard = ({ recommendation, onStartSession }) => {
  const {
    topic_id,
    topic_title,
    subject_title,
    difficulty,
    estimated_minutes,
    priority_score,
    recommendation_reason,
  } = recommendation;

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case "Easy":
        return "text-emerald-700 bg-emerald-50";
      case "Medium":
        return "text-amber-700 bg-amber-50";
      case "Hard":
        return "text-red-700 bg-red-50";
      default:
        return "text-slate-700 bg-slate-50";
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 text-white rounded-xl p-5 shadow-md flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Sparkles className="h-24 w-24 text-white" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="flex items-center space-x-1 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-amber-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>AI Suggested Topic</span>
          </span>
          {priority_score !== undefined && (
            <span className="flex items-center space-x-1 text-xs text-indigo-200 font-medium">
              <Award className="h-3.5 w-3.5" />
              <span>Score: {Number(priority_score).toFixed(1)}</span>
            </span>
          )}
        </div>

        <div className="text-xs text-indigo-200 uppercase font-medium tracking-wide flex items-center gap-1 mb-1">
          <BookOpen className="h-3 w-3" />
          <span>{subject_title || "Subject"}</span>
        </div>

        <h3 className="font-bold text-lg text-white mb-2">
          {topic_title || "Topic Name"}
        </h3>

        <p className="text-xs text-indigo-100/90 mb-4 bg-white/10 p-2.5 rounded-lg border border-white/10">
          💡{" "}
          {recommendation_reason ||
            "High priority based on difficulty, exam target, and study decay."}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-2">
        <div className="flex items-center space-x-2 text-xs">
          <span
            className={`px-2 py-0.5 rounded font-medium ${getDifficultyColor(difficulty)}`}
          >
            {difficulty || "Medium"}
          </span>
          <span className="flex items-center space-x-1 text-indigo-200">
            <Clock className="h-3.5 w-3.5" />
            <span>{estimated_minutes || 60}m</span>
          </span>
        </div>

        <button
          onClick={() =>
            onStartSession && onStartSession(topic_id, topic_title)
          }
          className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-semibold rounded-lg text-xs flex items-center space-x-1 transition-colors shadow-sm"
        >
          <span>Log Session</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default AIRecommendationCard;
