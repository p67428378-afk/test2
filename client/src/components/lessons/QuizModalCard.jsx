import React, { useState } from "react";
import {
  X,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
} from "lucide-react";

export default function QuizModalCard({ lesson, onClose, onSubmitQuiz }) {
  const [selectedOption, setSelectedOption] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  if (!lesson) return null;

  // Parse quiz options robustly
  let options = [];
  if (Array.isArray(lesson.quiz_options)) {
    options = lesson.quiz_options;
  } else if (typeof lesson.quiz_options === "string") {
    try {
      options = JSON.parse(lesson.quiz_options);
    } catch {
      options = lesson.quiz_options.split(",").map((opt) => opt.trim());
    }
  }

  // Default options fallback if empty
  if (!options || options.length === 0) {
    options = ["Water", "Soda", "Energy Drink", "Flavored Syrup"];
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOption || submitting) return;

    setSubmitting(true);
    try {
      const res = await onSubmitQuiz(lesson.id, selectedOption);
      setResult(res);
    } catch (err) {
      console.error("Quiz submission error:", err);
      setResult({
        correct: false,
        message: err.response?.data?.detail || "Failed to submit quiz answer.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Lesson Header */}
        <div className="space-y-2 pr-8">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              {lesson.category || "Health Habit"}
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
              <Award className="h-4 w-4" />+{lesson.points_value || 15} Points
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">
            {lesson.title}
          </h2>
        </div>

        {/* Lesson Body Content */}
        <div className="p-4 bg-slate-800/60 border border-slate-800 rounded-2xl text-xs leading-relaxed text-slate-300">
          <p className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            Lesson Story:
          </p>
          <p>
            {lesson.content ||
              "Staying healthy is fun when done step-by-step every single day!"}
          </p>
        </div>

        {/* Quiz Question Section */}
        <div className="space-y-4 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-slate-100">
              Quiz:{" "}
              {lesson.quiz_question ||
                "What is the best choice for daily hydration?"}
            </h3>
          </div>

          {result ? (
            <div
              className={`p-4 rounded-2xl border text-center space-y-3 ${
                result.correct
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-400"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {result.correct ? (
                  <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                ) : (
                  <XCircle className="h-8 w-8 text-rose-400" />
                )}
                <span className="font-bold text-lg">
                  {result.correct ? "Awesome Job! Correct!" : "Not Quite!"}
                </span>
              </div>

              <p className="text-xs text-slate-300">{result.message}</p>

              {result.correct && (
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full font-bold text-xs border border-amber-500/30">
                  <Award className="h-4 w-4" />
                  <span>
                    +{result.points_awarded || lesson.points_value || 15} Points
                    Earned!
                  </span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl font-bold text-xs transition-colors"
                >
                  Close & Continue
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                {options.map((opt, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all text-xs font-semibold ${
                      selectedOption === opt
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                        : "bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    <span>{opt}</span>
                    <input
                      type="radio"
                      name="quizOption"
                      value={opt}
                      checked={selectedOption === opt}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className="accent-emerald-500 h-4 w-4"
                    />
                  </label>
                ))}
              </div>

              <button
                type="submit"
                disabled={!selectedOption || submitting}
                className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 rounded-xl font-bold text-xs transition-all shadow-md"
              >
                {submitting ? "Checking Answer..." : "Submit Answer"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
