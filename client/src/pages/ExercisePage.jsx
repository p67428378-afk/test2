import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import { ArrowLeft, Play, CheckCircle } from "lucide-react";
import { getActivities, saveProgress } from "../services/api";

const EXERCISES = [
  {
    id: "e1",
    name: "Kangaroo Jump",
    description: "Jump up and down like a happy kangaroo! 🦘",
    duration: 10,
    icon: "🦘",
  },
  {
    id: "e2",
    name: "Lion Stretch",
    description: "Reach your arms up high and stretch like a proud lion! 🦁",
    duration: 10,
    icon: "🦁",
  },
  {
    id: "e3",
    name: "Frog Hop",
    description: "Crouch down low and hop like a little green frog! 🐸",
    duration: 10,
    icon: "🐸",
  },
];

export default function ExercisePage({
  user,
  progress,
  onBack,
  onRefreshProgress,
}) {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [activity, setActivity] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const data = await getActivities("exercise");
        if (data && data.length > 0) {
          setActivity(data[0]);
        }
      } catch (error) {
        console.error("Error fetching exercise activity:", error);
      }
    };
    fetchActivity();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      handleExerciseComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startTimer = (duration) => {
    setTimeLeft(duration);
    setIsActive(true);
  };

  const handleExerciseComplete = () => {
    if (currentExercise < EXERCISES.length - 1) {
      setCurrentExercise(currentExercise + 1);
    } else {
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
      console.error("Error saving exercise progress:", error);
    }
  };

  const activeExercise = EXERCISES[currentExercise];

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
            🦁 Move & Groove! 🦘
          </h2>

          {!isCompleted ? (
            <div className="space-y-6 py-6 bg-orange-50 rounded-2xl border-2 border-orange-100 max-w-xl mx-auto">
              <div className="text-8xl animate-bounce">
                {activeExercise.icon}
              </div>
              <h3 className="text-2xl font-bold text-amber-900">
                {activeExercise.name}
              </h3>
              <p className="text-lg text-slate-700 px-6 leading-relaxed">
                {activeExercise.description}
              </p>

              {isActive ? (
                <div className="text-5xl font-black text-primary animate-pulse">
                  {timeLeft}s
                </div>
              ) : (
                <button
                  onClick={() => startTimer(activeExercise.duration)}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl chunky-button inline-flex items-center gap-2"
                >
                  <Play size={20} fill="white" />
                  Start Stretch!
                </button>
              )}

              <div className="text-sm text-slate-500 font-bold">
                Exercise {currentExercise + 1} of {EXERCISES.length}
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-8 bg-emerald-50 rounded-2xl border-2 border-emerald-200 max-w-xl mx-auto text-center">
              <CheckCircle className="text-emerald-500 mx-auto" size={64} />
              <h3 className="text-3xl font-black text-emerald-800">
                Active Kangaroo Badge Unlocked!
              </h3>
              <p className="text-lg text-emerald-700 px-6">
                You completed all the animal stretches! Your body is strong and
                healthy! 🦘✨
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
