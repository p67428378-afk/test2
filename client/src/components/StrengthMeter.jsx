import React from "react";

const StrengthMeter = ({ strength = "Strong", entropyBits = 0 }) => {
  const getStrengthConfig = (str) => {
    const lower = (str || "").toLowerCase();
    if (lower.includes("very weak")) {
      return {
        label: "Very Weak",
        width: "20%",
        color: "bg-red-500",
        textColor: "text-red-600",
      };
    }
    if (lower.includes("weak")) {
      return {
        label: "Weak",
        width: "40%",
        color: "bg-orange-500",
        textColor: "text-orange-600",
      };
    }
    if (lower.includes("medium")) {
      return {
        label: "Medium",
        width: "60%",
        color: "bg-yellow-500",
        textColor: "text-yellow-600",
      };
    }
    if (lower.includes("very strong")) {
      return {
        label: "Very Strong",
        width: "100%",
        color: "bg-emerald-500",
        textColor: "text-emerald-600",
      };
    }
    if (lower.includes("strong")) {
      return {
        label: "Strong",
        width: "80%",
        color: "bg-emerald-500",
        textColor: "text-emerald-600",
      };
    }
    return {
      label: strength,
      width: "70%",
      color: "bg-blue-500",
      textColor: "text-blue-600",
    };
  };

  const config = getStrengthConfig(strength);

  return (
    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
      <div className="flex justify-between text-xs font-medium mb-1.5">
        <span className="text-slate-500">Password Strength</span>
        <span className={`${config.textColor} font-bold`}>{config.label}</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className={`${config.color} h-2 rounded-full transition-all duration-300`}
          style={{ width: config.width }}
        ></div>
      </div>
      {entropyBits > 0 && (
        <div className="mt-2 text-right text-[10px] text-slate-400 font-mono">
          Entropy: {entropyBits.toFixed(1)} bits
        </div>
      )}
    </div>
  );
};

export default StrengthMeter;
