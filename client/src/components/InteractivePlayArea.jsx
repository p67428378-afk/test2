import React, { useEffect, useState, useRef } from "react";

const EMOJI_MAP = {
  A: "🍎",
  B: "🎈",
  C: "🐱",
  D: "🐶",
  E: "🐘",
  F: "🐸",
  G: "🍇",
  H: "🎩",
  I: "⛺",
  J: "🧃",
  K: "🪁",
  L: "🦁",
  M: "🐒",
  N: "🪹",
  O: "🦉",
  P: "🐧",
  Q: "👑",
  R: "🐇",
  S: "☀️",
  T: "🐅",
  U: "☂️",
  V: "🎻",
  W: "🍉",
  X: "🪘",
  Y: "🐂",
  Z: "🦓",
};

export default function InteractivePlayArea({ item, type, onExplored }) {
  const [isFallbackActive, setIsFallbackActive] = useState(false);
  const [countingStars, setCountingStars] = useState([]);
  const [countingText, setCountingText] = useState("");
  const audioRef = useRef(null);
  const speechTimeoutRef = useRef(null);

  useEffect(() => {
    if (!item) return;

    // Reset counting state for numbers
    setCountingStars([]);
    setCountingText("");

    // Stop any ongoing speech synthesis
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }

    // Play sound
    playSound();

    // If it's a number, trigger the counting animation
    if (type === "number") {
      triggerCountingAnimation();
    }

    // Log progress
    if (onExplored) {
      onExplored(item.id);
    }
  }, [item]);

  const playSound = () => {
    if (!item) return;

    const textToSpeak =
      type === "alphabet"
        ? `${item.value} is for ${item.word_association}`
        : `${item.value}`;

    // Try playing audio file first
    const audio = new Audio(item.audio_url);
    audioRef.current = audio;

    audio
      .play()
      .then(() => {
        setIsFallbackActive(false);
      })
      .catch((err) => {
        console.warn(
          "Audio file failed to play, falling back to Web Speech API:",
          err,
        );
        speakFallback(textToSpeak);
      });
  };

  const speakFallback = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8; // Kid-friendly slower rate
    utterance.pitch = 1.2; // Slightly higher pitch for kids
    window.speechSynthesis.speak(utterance);
    setIsFallbackActive(true);
  };

  const triggerCountingAnimation = () => {
    const count = parseInt(item.value, 10);
    if (isNaN(count)) return;

    let currentCount = 0;
    const stars = [];
    const numberWords = [
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
    ];

    const addStarWithDelay = () => {
      if (currentCount < count) {
        currentCount++;
        stars.push("⭐");
        setCountingStars([...stars]);

        const text = numberWords.slice(0, currentCount).join(", ") + "!";
        setCountingText(text);

        // Speak the current number
        speakFallback(numberWords[currentCount - 1]);

        speechTimeoutRef.current = setTimeout(addStarWithDelay, 800);
      }
    };

    addStarWithDelay();
  };

  if (!item) {
    return (
      <div className="bg-white border border-[#cce0f2] border-solid flex flex-col gap-[12px] items-center justify-center p-[24px] rounded-[14px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] w-full min-h-[300px]">
        <p className="text-[#668099] text-[18px] font-bold text-center">
          👈 Tap a card to start playing!
        </p>
      </div>
    );
  }

  const emoji = EMOJI_MAP[item.value] || "✨";

  return (
    <div
      className="bg-white border border-[#cce0f2] border-solid flex flex-col gap-[12px] items-start overflow-clip p-[24px] relative rounded-[14px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] shrink-0 w-full"
      data-node-id="1:88"
      data-name="PreviewContainer"
    >
      <p className="font-bold leading-[normal] not-italic relative shrink-0 text-[#1a2640] text-[18px] whitespace-nowrap">
        Interactive Play Area
      </p>

      <div
        className={`content-stretch flex flex-col gap-[16px] items-center overflow-clip p-[24px] relative rounded-[14px] shrink-0 w-full transition-all duration-300 ${
          type === "alphabet" ? "bg-[#e5f2ff]" : "bg-[#f2ffe5]"
        }`}
        data-node-id="1:87"
        data-name="BigPreview"
      >
        <p className="font-bold leading-[normal] not-italic relative shrink-0 text-[#ff6e00] text-[18px] whitespace-nowrap animate-bounce">
          ⭐ Explored! +1 Star
        </p>

        <p className="font-bold leading-[normal] not-italic relative shrink-0 text-[#1a2640] text-[96px] whitespace-nowrap">
          {type === "alphabet"
            ? `${item.value}${item.value.toLowerCase()}`
            : item.value}
        </p>

        {type === "alphabet" ? (
          <p className="font-bold leading-[normal] not-italic relative shrink-0 text-[#1a2640] text-[32px] whitespace-nowrap">
            {emoji} {item.word_association}
          </p>
        ) : (
          <div className="flex flex-col items-center gap-[12px]">
            <div
              className="bg-white border border-[#cce0f2] border-solid flex font-normal gap-[16px] items-start leading-[normal] not-italic overflow-clip p-[12px] relative rounded-[10px] shrink-0 text-[#1a2640] text-[48px] whitespace-nowrap min-h-[80px] justify-center"
              data-node-id="2:64"
              data-name="StarsArea"
            >
              {countingStars.map((star, idx) => (
                <span key={idx} className="inline-block animate-bounce-custom">
                  {star}
                </span>
              ))}
            </div>
            <p className="font-bold leading-[normal] not-italic relative shrink-0 text-[#1a2640] text-[24px] whitespace-nowrap">
              {countingText}
            </p>
          </div>
        )}

        <div
          className="flex gap-[12px] items-start overflow-clip relative shrink-0"
          data-node-id="1:85"
          data-name="AudioControls"
        >
          <button
            onClick={playSound}
            className="bg-[#ff6e00] hover:bg-[#e05c00] active:scale-95 transition-all content-stretch flex items-center justify-center overflow-clip px-[16px] py-[12px] relative rounded-[10px] shrink-0 text-white font-medium text-[14px]"
            data-node-id="1:81"
            data-name="Button"
          >
            🔊 Play Sound
          </button>
          <button
            onClick={playSound}
            className="bg-white border border-[#cce0f2] border-solid hover:bg-[#f2faff] active:scale-95 transition-all content-stretch flex items-center justify-center overflow-clip px-[16px] py-[12px] relative rounded-[10px] shrink-0 text-[#1a2640] font-medium text-[14px]"
            data-node-id="1:83"
            data-name="Button"
          >
            🔄 Replay
          </button>
        </div>

        {isFallbackActive && (
          <p className="font-normal leading-[normal] not-italic relative shrink-0 text-[#668099] text-[12px] whitespace-nowrap">
            Fallback: Web Speech API Active
          </p>
        )}
      </div>
    </div>
  );
}
