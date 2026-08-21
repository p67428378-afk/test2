import React, { useState } from "react";
import { RotateCw } from "lucide-react";

export default function Flashcard({ front, back }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      onClick={() => setIsFlipped(!isFlipped)}
      className="w-full max-w-xl h-80 cursor-pointer group perspective [perspective:1000px]"
    >
      <div
        className={`relative size-full transition-transform duration-500 transform-style [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
      >
        {/* Front Side */}
        <div className="absolute size-full bg-white border-2 border-[#e3e8f0] rounded-2xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all backface-hidden [backface-visibility:hidden]">
          <div className="flex justify-between items-center text-xs font-semibold text-text_secondary uppercase tracking-wider">
            <span>Question</span>
            <span className="text-primary flex items-center gap-1">
              <RotateCw className="size-3.5" /> Flip
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center text-center px-4">
            <p className="text-xl font-semibold text-text_primary leading-relaxed">
              {front}
            </p>
          </div>
          <div className="text-center text-xs text-text_secondary">
            Click anywhere on the card to reveal the answer
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute size-full bg-blue-50 border-2 border-primary/20 rounded-2xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all backface-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="flex justify-between items-center text-xs font-semibold text-primary uppercase tracking-wider">
            <span>Answer</span>
            <span className="text-primary flex items-center gap-1">
              <RotateCw className="size-3.5" /> Flip
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center text-center px-4 overflow-y-auto">
            <p className="text-lg font-medium text-text_primary leading-relaxed">
              {back}
            </p>
          </div>
          <div className="text-center text-xs text-primary/60">
            Click anywhere on the card to see the question again
          </div>
        </div>
      </div>
    </div>
  );
}
