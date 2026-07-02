import React from "react";
import PropTypes from "prop-types";

const PasswordStrengthBar = ({ password }) => {
  const getStrength = (pass) => {
    if (!pass) return { score: 0, label: "None", color: "bg-gray-200" };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, label: "Weak", color: "bg-red-500" };
    if (score <= 4) return { score, label: "Medium", color: "bg-yellow-500" };
    return { score, label: "Strong", color: "bg-green-500" };
  };

  const strength = getStrength(password);

  return (
    <div className="mt-2 mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-gray-600">
          'Password Strength:'
        </span>
        <span
          className={`text-xs font-semibold ${
            strength.label === "Weak"
              ? "text-red-500"
              : strength.label === "Medium"
                ? "text-yellow-600"
                : strength.label === "Strong"
                  ? "text-green-600"
                  : "text-gray-400"
          }`}
        >
          {strength.label}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${strength.color}`}
          style={{ width: `${(strength.score / 5) * 100}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        'Must be at least 8 characters and include uppercase, lowercase,
        numbers, and special characters.'
      </p>
    </div>
  );
};

PasswordStrengthBar.propTypes = {
  password: PropTypes.string.isRequired,
};

export default PasswordStrengthBar;
