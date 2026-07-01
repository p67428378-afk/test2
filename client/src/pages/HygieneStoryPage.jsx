import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import StepTracker from "../components/hygiene/StepTracker";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { getActivities, saveProgress } from "../services/api";

const HYGIENE_STEPS = [
  {
    id: "s1",
    title: "Wet Hands",
    description:
      "Turn on the tap and get your hands nice and wet with clean water! 💧",
    icon: "🚰",
  },
  {
    id: "s2",
    title: "Get Soap",
    description:
      "Rub-a-dub-dub! Grab some soap and make lots of bubbly bubbles! 🧼",
    icon: "🧼",
  },
  {
    id: "s3",
    title: "Scrub Scrub",
    description:
      "Scrub your palms, the backs of your hands, and between your fingers for 20 seconds! Sing the Happy Birthday song twice! 🎶",
    icon: "🧼",
  },
  {
    id: "s4",
    title: "Rinse Off",
    description:
      "Wash away all the bubbles and dirt bugs under the clean water! 🌊",
    icon: "💦",
  },
  {
    id: "s5",
    title: "Dry Dry",
    description:
      "Dry your hands completely with a clean towel. Now you are a Super Soaper! 🧼✨",
    icon: "✨",
  },
];

export default function HygieneStoryPage({
  user,
  progress,
  onBack,
  onRefreshProgress,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [activity, setActivity] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const data = await getActivities("hygiene");
        if (data && data.length > 0) {
          setActivity(data[0]);
        }
      } catch (error) {
        console.error("Error fetching hygiene activity:", error);
      }
    };
    fetchActivity();
  }, []);

  const handleNext = () => {
    if (currentStep < HYGIENE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (!isCompleted) {
      setIsCompleted(true);
      handleComplete();
    }
  };

  const handleComplete = async () => {
    if (!user || !activity) return;
    try {
      await saveProgress(user.id, activity.id, true, 100);
      onRefreshProgress();
    } catch (error) {
      console.error("Error saving hygiene progress:", error);
    }
  };

  const handleStepClick = (index) => {
    if (index <= currentStep) {
      setCurrentStep(index);
    }
  };

  const activeStep = HYGIENE_STEPS[currentStep];

  return (
    <div className="min-h-screen bg-[#E0F2FE] pb-12">
      <Header user={user} points={progress?.total_points || 0} />

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary font-bold hover:underline"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl p-8 shadow-lg border-4 border-sky-100 text-center space-y-8">
          <h2 className="text-3xl font-black text-primary">
            🧼 Super Soaper Adventure! 🧼
          </h2>

          <StepTracker
            steps={HYGIENE_STEPS}
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />

          {!isCompleted ? (
            <div className="space-y-6 py-6 bg-sky-50 rounded-2xl border-2 border-sky-100 max-w-xl mx-auto">
              <div className="text-8xl animate-bounce">{activeStep.icon}</div>
              <h3 className="text-2xl font-bold text-primary">
                {activeStep.title}
              </h3>
              <p className="text-lg text-slate-700 px-6 leading-relaxed">
                {activeStep.description}
              </p>
              <button
                onClick={handleNext}
                className="bg-primary hover:bg-primary-container text-white font-bold py-3 px-8 rounded-xl chunky-button inline-flex items-center gap-2"
              >
                {currentStep === HYGIENE_STEPS.length - 1
                  ? "Finish Adventure!"
                  : "Next Step"}
                <ArrowRight size={20} />
              </button>
            </div>
          ) : (
            <div className="space-y-6 py-8 bg-emerald-50 rounded-2xl border-2 border-emerald-200 max-w-xl mx-auto text-center">
              <CheckCircle className="text-emerald-500 mx-auto" size={64} />
              <h3 className="text-3xl font-black text-emerald-800">
                Super Soaper Badge Unlocked!
              </h3>
              <p className="text-lg text-emerald-700 px-6">
                You have learned all the steps to keep your hands clean and
                defeat the dirt bugs! 🌟
              </p>
              <button
                onClick={onBack}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl chunky-button"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
