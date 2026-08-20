import React, { useState } from "react";

export default function HabitCard({ habit, onComplete }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async () => {
    if (habit.is_completed_today) return;
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
    onComplete(habit.id);
  };

  const getIconBgColor = (name) => {
    switch (name) {
      case "Brush Teeth":
        return "bg-[#38a1f2]";
      case "Wash Hands":
        return "bg-[#0fba82]";
      case "Eat Veggies":
        return "bg-[#f59e0b]";
      case "Sleep on Time":
        return "bg-[#944fe5]";
      default:
        return "bg-primary";
    }
  };

  if (habit.is_completed_today) {
    return (
      <div
        className="bg-[#0fba82] flex flex-col gap-3 h-[220px] items-center justify-center flex-1 min-w-[180px] p-6 rounded-2xl shadow-md transition-all duration-300 scale-100"
        data-name="HabitCard"
      >
        <div className="bg-white flex items-center justify-center rounded-full w-16 h-16 shadow-inner">
          <p className="text-3xl text-[#0fba82]">{habit.icon || "🌟"}</p>
        </div>
        <p className="font-bold text-lg text-white text-center">{habit.name}</p>
        <div className="flex items-center">
          <p className="font-medium text-sm text-white">✓ Completed!</p>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`bg-white border border-[#e0e5f0] flex flex-col gap-3 h-[220px] items-center justify-center flex-1 min-w-[180px] p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all duration-300 ${
        isAnimating ? "animate-star-burst" : ""
      }`}
      data-name="HabitCard"
    >
      <div
        className={`${getIconBgColor(habit.name)} flex items-center justify-center rounded-full w-16 h-16 shadow-md`}
      >
        <p className="text-3xl text-white">{habit.icon || "🌟"}</p>
      </div>
      <p className="font-bold text-lg text-[#1f293b] text-center">
        {habit.name}
      </p>
      <div className="flex items-center">
        <p className="font-medium text-sm text-[#63738c]">
          ⭐ +{habit.points} Stars
        </p>
      </div>
    </div>
  );
}
