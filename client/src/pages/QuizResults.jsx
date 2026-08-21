import React from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import { ArrowLeft, RotateCcw, Award, Clock, CheckCircle } from "lucide-react";
import ScoreCircle from "../components/ScoreCircle";

export default function QuizResults() {
  const location = useLocation();
  const { quizId } = useParams();
  const { score = 0, totalCards = 0, timeTaken = 0 } = location.state || {};

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const percentage =
    totalCards > 0 ? Math.round((score / totalCards) * 100) : 0;

  let feedbackTitle = "Keep Practicing!";
  let feedbackDesc = "Review the cards in this deck to improve your score.";
  if (percentage >= 80) {
    feedbackTitle = "Excellent Job!";
    feedbackDesc = "You have mastered this deck! Keep up the great work.";
  } else if (percentage >= 50) {
    feedbackTitle = "Good Effort!";
    feedbackDesc =
      "You are making great progress. A little more study and you will master it.";
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <div className="bg-white border border-[#e3e8f0] rounded-2xl p-8 md:p-10 shadow-sm text-center flex flex-col items-center">
        <div className="p-4 bg-blue-50 rounded-full text-primary mb-6">
          <Award className="size-10" />
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-text_primary tracking-tight mb-2">
          Quiz Completed!
        </h1>
        <p className="text-text_secondary text-sm mb-8">
          {feedbackTitle} {feedbackDesc}
        </p>

        {/* Score Circle */}
        <div className="mb-8">
          <ScoreCircle score={score} total={totalCards} />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-10 border-t border-b border-gray-100 py-6">
          <div className="flex flex-col items-center justify-center border-r border-gray-100">
            <Clock className="size-5 text-text_secondary mb-1" />
            <span className="text-xs font-semibold text-text_secondary uppercase tracking-wider">
              Time Taken
            </span>
            <span className="text-lg font-bold text-text_primary mt-1">
              {formatTime(timeTaken)}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <CheckCircle className="size-5 text-text_secondary mb-1" />
            <span className="text-xs font-semibold text-text_secondary uppercase tracking-wider">
              Accuracy
            </span>
            <span className="text-lg font-bold text-text_primary mt-1">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm text-sm"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Decks</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
