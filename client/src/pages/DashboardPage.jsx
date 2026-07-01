import React from "react";
import Header from "../components/layout/Header";
import ModuleCard from "../components/dashboard/ModuleCard";
import BadgeCard from "../components/dashboard/BadgeCard";
import { Rocket, Award } from "lucide-react";

export default function DashboardPage({
  user,
  progress,
  onSelectModule,
  onResetUser,
}) {
  const points = progress?.total_points || 0;
  const unlockedBadges = progress?.unlocked_badges || [];

  const isBadgeUnlocked = (badgeName) => {
    return unlockedBadges.some(
      (b) => b.badge_name.toLowerCase() === badgeName.toLowerCase(),
    );
  };

  return (
    <div className="min-h-screen bg-[#E0F2FE] pb-24 md:pb-12">
      <Header user={user} points={points} onResetUser={onResetUser} />

      <main className="max-w-7xl mx-auto px-4 md:px-12 py-10 space-y-8">
        {/* Welcome Banner */}
        <section className="bg-white rounded-xl p-8 shadow-[0_10px_30px_rgba(0,88,190,0.1)] relative overflow-hidden flex flex-col md:flex-row items-center gap-8 border-4 border-sky-100">
          <div className="flex-1 space-y-4 z-10 text-center md:text-left">
            <h2 className="text-4xl font-black text-primary leading-tight">
              Hi, {user?.username || "Explorer"}! <br />
              <span className="text-amber-600">
                What healthy habit shall we learn today?
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-lg">
              Tap a module below to start your next adventure and earn more
              badges!
            </p>
            <button
              onClick={() => onSelectModule("nutrition")}
              className="bg-primary hover:bg-primary-container text-white font-bold py-4 px-8 rounded-xl chunky-button inline-flex items-center gap-2 mt-4"
            >
              <Rocket size={20} />
              Start Daily Mission
            </button>
          </div>
          <div className="w-full md:w-1/2 h-64 md:h-80 relative z-0 rounded-lg overflow-hidden sticker-badge rotate-1 bg-amber-100 flex items-center justify-center text-8xl">
            ☀️
          </div>
        </section>

        {/* Modules Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ModuleCard
            title="Sort the Foods!"
            description="Help Chef Bunny sort healthy treats into the right baskets."
            icon="🍎"
            bgColor="#DCFCE7"
            borderColor="#86EFAC"
            textColor="#166534"
            btnColor="#22C55E"
            btnBorderColor="#15803d"
            btnText="Play Game"
            onPlay={() => onSelectModule("nutrition")}
          />
          <ModuleCard
            title="Move & Groove!"
            description="Follow fun animal stretches and get your body moving."
            icon="🦁"
            bgColor="#FFEDD5"
            borderColor="#FDBA74"
            textColor="#9A3412"
            btnColor="#F97316"
            btnBorderColor="#C2410C"
            btnText="Start Video"
            onPlay={() => onSelectModule("exercise")}
          />
          <ModuleCard
            title="Super Soaper!"
            description="Learn the magic of clean hands and defeat the dirt bugs."
            icon="🧼"
            bgColor="#DBEAFE"
            borderColor="#93C5FD"
            textColor="#1E40AF"
            btnColor="#3B82F6"
            btnBorderColor="#1D4ED8"
            btnText="Read Story"
            onPlay={() => onSelectModule("hygiene")}
          />
        </section>

        {/* Badges Section */}
        <section className="bg-white rounded-xl p-8 shadow-[0_10px_30px_rgba(0,88,190,0.1)] border-4 border-sky-100">
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Award className="text-primary" size={28} />
              My Badges
            </h3>
          </div>
          <div className="flex overflow-x-auto pb-4 gap-6 snap-x">
            <BadgeCard
              name="Veggie Champion"
              icon="🥕"
              isUnlocked={isBadgeUnlocked("Veggie Champion")}
              requirement="Complete Nutrition to unlock!"
            />
            <BadgeCard
              name="Active Kangaroo"
              icon="🦘"
              isUnlocked={isBadgeUnlocked("Active Kangaroo")}
              requirement="Complete Exercise to unlock!"
            />
            <BadgeCard
              name="Super Soaper"
              icon="🧼"
              isUnlocked={isBadgeUnlocked("Super Soaper")}
              requirement="Complete Hygiene to unlock!"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
