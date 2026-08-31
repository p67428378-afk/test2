import React, { useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, Play, Award } from "lucide-react";
import Button from "../common/Button";
import Badge from "../common/Badge";
import { quizzesApi, progressApi } from "../../services/api";

export default function QuizOverlayModal({
  isOpen,
  checkpoint,
  moduleId,
  onComplete,
  onClose,
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!isOpen || !checkpoint) return null;

  const handleSubmit = async () => {
    if (selectedOption === null) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Call backend quiz evaluation endpoint
      const result = await quizzesApi.evaluateAnswer(
        checkpoint.id,
        selectedOption,
      );
      setEvaluation(result);

      // Record progress in backend if evaluated
      try {
        await progressApi.recordProgress({
          module_id: moduleId,
          score: result.is_correct ? 100 : 50,
          completed_checkpoints: [checkpoint.id],
          completed_at: new Date().toISOString(),
        });
      } catch (progErr) {
        // Non-blocking progress update failure
      }
    } catch (err) {
      // Fallback local evaluation if backend evaluation endpoint has network issues
      const isCorrect = selectedOption === checkpoint.correct_option;
      setEvaluation({
        is_correct: isCorrect,
        correct_option: checkpoint.correct_option,
        explanation: isCorrect
          ? "Excellent! Your answer is clinically and physiologically accurate."
          : `The correct answer was option ${(checkpoint.correct_option ?? 0) + 1}.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    const passed = evaluation?.is_correct ?? false;
    setEvaluation(null);
    setSelectedOption(null);
    onComplete(checkpoint.id, passed);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#dee3ed] relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#dee3ed] mb-6">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#1466bf] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-lg text-[#171f2e]">
                Interactive Checkpoint Quiz
              </h3>
              <p className="text-xs text-[#6b758a]">
                Pause & Learn • Mandatory 1st-Year MBBS Assessment
              </p>
            </div>
          </div>
          <Badge variant="physiology" size="sm">
            {checkpoint.timestamp_seconds
              ? `${checkpoint.timestamp_seconds}s`
              : "Checkpoint"}
          </Badge>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Question Content */}
        <div className="mb-6">
          <p className="text-base font-semibold text-[#171f2e] leading-relaxed">
            {checkpoint.question_text}
          </p>
        </div>

        {/* Options List */}
        {!evaluation ? (
          <div className="space-y-3 mb-6">
            {checkpoint.options?.map((option, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <button
                  key={`opt-${idx}`}
                  type="button"
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? "border-[#1466bf] bg-blue-50/60 ring-2 ring-[#1466bf]/20"
                      : "border-[#dee3ed] bg-white hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      isSelected
                        ? "bg-[#1466bf] text-white"
                        : "bg-gray-100 text-[#6b758a]"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span
                    className={`text-sm ${
                      isSelected
                        ? "font-semibold text-[#1466bf]"
                        : "text-[#171f2e]"
                    }`}
                  >
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          /* Result Feedback View */
          <div className="mb-6">
            <div
              className={`p-5 rounded-xl border mb-4 flex items-start gap-4 ${
                evaluation.is_correct
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-red-50 border-red-200 text-red-900"
              }`}
            >
              {evaluation.is_correct ? (
                <CheckCircle2 className="w-7 h-7 text-[#149e52] shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-7 h-7 text-[#d92d2d] shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-bold text-base mb-1">
                  {evaluation.is_correct
                    ? "Correct Answer!"
                    : "Incorrect Selection"}
                </h4>
                <p className="text-sm opacity-90">
                  {evaluation.explanation ||
                    (evaluation.is_correct
                      ? "Great job understanding this physiological concept."
                      : "Review the question and explanation below.")}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-[#dee3ed]">
              <span className="text-xs font-bold text-[#6b758a] uppercase tracking-wider block mb-1">
                Verified Medical Reference:
              </span>
              <p className="text-sm text-[#171f2e]">
                {checkpoint.options?.[evaluation.correct_option]}
              </p>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#dee3ed]">
          {!evaluation ? (
            <>
              {onClose && (
                <Button
                  variant="ghost"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Skip for Now
                </Button>
              )}
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={selectedOption === null || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Answer"}
              </Button>
            </>
          ) : (
            <Button
              variant="accent"
              onClick={handleContinue}
              icon={Play}
              className="w-full sm:w-auto"
            >
              Continue Animation
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
