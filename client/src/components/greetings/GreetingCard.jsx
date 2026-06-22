import React from "react";

const GREETING_DETAILS = {
  Namaste: {
    script: "नमस्ते",
    language: "Sanskrit/Hindi",
    bg: "bg-[#EFF6FF]",
    text: "text-[#1D4ED8]",
    border: "border-[#BFDBFE]",
  },
  Vanakkam: {
    script: "வணக்கம்",
    language: "Tamil",
    bg: "bg-[#ECFDF5]",
    text: "text-[#047857]",
    border: "border-[#A7F3D0]",
  },
  "Sat Sri Akaal": {
    script: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ",
    language: "Punjabi",
    bg: "bg-[#FFF7ED]",
    text: "text-[#C2410C]",
    border: "border-[#FED7AA]",
  },
  Aadab: {
    script: "आदाब",
    language: "Urdu",
    bg: "bg-[#FAF5FF]",
    text: "text-[#7E22CE]",
    border: "border-[#E9D5FF]",
  },
  Nomoskar: {
    script: "নমস্কার",
    language: "Bengali",
    bg: "bg-[#F0FDFA]",
    text: "text-[#0F766E]",
    border: "border-[#CCFBF1]",
  },
};

export default function GreetingCard({ greeting }) {
  const details = GREETING_DETAILS[greeting.greeting] || {
    script: "",
    language: "Local Language",
    bg: "bg-[#F1F5F9]",
    text: "text-[#475569]",
    border: "border-[#E2E8F0]",
  };

  const handleSpeak = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(greeting.greeting);
      utterance.lang = "en-IN";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col group">
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              {greeting.greeting}
            </h3>
            {details.script && (
              <p className="font-body-sm text-body-sm text-on-surface-variant font-medium mt-1">
                {details.script}
              </p>
            )}
          </div>
          <button
            onClick={handleSpeak}
            className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-on-primary transition-colors shadow-sm"
            title="Listen to pronunciation"
          >
            <span className="material-symbols-outlined">volume_up</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
            {greeting.region}
          </span>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${details.bg} ${details.text} ${details.border}`}
          >
            {details.language}
          </span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">
          {greeting.description}
        </p>
      </div>
      <div className="px-6 py-4 border-t border-[#E2E8F0] bg-gray-50/50">
        <a
          className="text-primary font-label-md hover:underline flex items-center gap-1"
          href="#"
        >
          Learn More{" "}
          <span className="material-symbols-outlined text-sm">
            chevron_right
          </span>
        </a>
      </div>
    </div>
  );
}
