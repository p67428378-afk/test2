import React, { useState, useEffect } from "react";
import { Bolt, RefreshCw, Copy, Check, Save } from "lucide-react";

export default function PasswordGenerator({ onSaveAsCredential }) {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let allowedChars = "";
    if (options.uppercase) allowedChars += uppercaseChars;
    if (options.lowercase) allowedChars += lowercaseChars;
    if (options.numbers) allowedChars += numberChars;
    if (options.symbols) allowedChars += symbolChars;

    if (!allowedChars) {
      setPassword("");
      return;
    }

    let generated = "";
    // Ensure at least one of each selected type is included
    const guaranteed = [];
    if (options.uppercase)
      guaranteed.push(
        uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)],
      );
    if (options.lowercase)
      guaranteed.push(
        lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)],
      );
    if (options.numbers)
      guaranteed.push(
        numberChars[Math.floor(Math.random() * numberChars.length)],
      );
    if (options.symbols)
      guaranteed.push(
        symbolChars[Math.floor(Math.random() * symbolChars.length)],
      );

    for (let i = guaranteed.length; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allowedChars.length);
      generated += allowedChars[randomIndex];
    }

    // Mix in guaranteed characters
    const finalArray = (generated + guaranteed.join("")).split("");
    for (let i = finalArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [finalArray[i], finalArray[j]] = [finalArray[j], finalArray[i]];
    }

    setPassword(finalArray.join("").substring(0, length));
  };

  useEffect(() => {
    generatePassword();
  }, [length, options]);

  const handleOptionChange = (key) => {
    setOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const calculateEntropy = () => {
    if (!password) return 0;
    let poolSize = 0;
    if (options.uppercase) poolSize += 26;
    if (options.lowercase) poolSize += 26;
    if (options.numbers) poolSize += 10;
    if (options.symbols) poolSize += 26;

    if (poolSize === 0) return 0;
    return Math.round(password.length * Math.log2(poolSize));
  };

  const entropy = calculateEntropy();
  const getEntropyLabel = () => {
    if (entropy < 40)
      return {
        text: "Weak",
        color: "text-error",
        border: "border-error/20",
        bg: "bg-error/10",
      };
    if (entropy < 60)
      return {
        text: "Moderate",
        color: "text-primary",
        border: "border-primary/20",
        bg: "bg-primary/10",
      };
    if (entropy < 80)
      return {
        text: "Strong",
        color: "text-secondary-container",
        border: "border-secondary-container/20",
        bg: "bg-secondary-container/10",
      };
    return {
      text: "Ultra Secure",
      color: "text-secondary-container",
      border: "border-secondary-container/20",
      bg: "bg-secondary-container/10",
    };
  };

  const entropyLabel = getEntropyLabel();

  return (
    <div className="cyber-card rounded-xl p-md flex flex-col gap-4 relative overflow-hidden">
      {/* Decorative background grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      ></div>

      <div className="flex justify-between items-center relative z-10">
        <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
          <Bolt className="text-primary w-[20px] h-[20px]" />
          Generator
        </h2>
        <button
          onClick={generatePassword}
          className="text-on-surface-variant hover:text-primary transition-colors"
        >
          <RefreshCw className="w-[20px] h-[20px]" />
        </button>
      </div>

      {/* Generated Output */}
      <div className="relative z-10 bg-[#050810] border border-primary/30 rounded-lg p-3 flex justify-between items-center group cyber-glow-primary">
        <span className="font-mono-data text-mono-data text-xl tracking-wider text-primary break-all">
          {password || "Select options..."}
        </span>
        <button
          onClick={copyToClipboard}
          className="bg-surface-variant/50 hover:bg-primary/20 text-on-surface-variant hover:text-primary p-1.5 rounded transition-colors"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="w-[18px] h-[18px] text-secondary" />
          ) : (
            <Copy className="w-[18px] h-[18px]" />
          )}
        </button>
      </div>

      {/* Entropy Meter */}
      {password && (
        <div
          className={`relative z-10 flex items-center justify-between ${entropyLabel.bg} border ${entropyLabel.border} rounded px-3 py-1.5 mt-1`}
        >
          <span
            className={`font-label-md text-label-md ${entropyLabel.color} flex items-center gap-1.5`}
            style={{ textShadow: "0 0 8px rgba(16,185,129,0.4)" }}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${entropyLabel.color === "text-error" ? "bg-error" : "bg-secondary-container"} animate-pulse`}
            ></div>
            {entropy}-bit Entropy ({entropyLabel.text})
          </span>
        </div>
      )}

      <hr className="border-outline-variant/10 relative z-10 my-1" />

      {/* Length Slider */}
      <div className="relative z-10 space-y-3">
        <div className="flex justify-between items-center">
          <label className="font-label-md text-label-md text-on-surface-variant">
            Length
          </label>
          <span className="font-mono-data text-mono-data text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">
            {length}
          </span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full relative z-20"
          />
          {/* Fake filled track */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-l pointer-events-none"
            style={{
              width: `${((length - 8) / 56) * 100}%`,
              boxShadow: "0 0 8px rgba(6,182,212,0.5)",
            }}
          ></div>
        </div>
      </div>

      {/* Options Grid */}
      <div className="relative z-10 grid grid-cols-2 gap-3 mt-2">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={options.uppercase}
            onChange={() => handleOptionChange("uppercase")}
            className="cyber-checkbox"
          />
          <span className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">
            Uppercase
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={options.lowercase}
            onChange={() => handleOptionChange("lowercase")}
            className="cyber-checkbox"
          />
          <span className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">
            Lowercase
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={options.numbers}
            onChange={() => handleOptionChange("numbers")}
            className="cyber-checkbox"
          />
          <span className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">
            Numbers
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={options.symbols}
            onChange={() => handleOptionChange("symbols")}
            className="cyber-checkbox"
          />
          <span className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">
            Symbols
          </span>
        </label>
      </div>

      <button
        onClick={() => onSaveAsCredential(password)}
        disabled={!password}
        className="relative z-10 mt-2 w-full py-2.5 bg-primary/10 border border-primary text-primary rounded-lg font-label-md text-label-md font-bold hover:bg-primary hover:text-[#0F172A] hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save className="w-[18px] h-[18px]" />
        Save as Credential
      </button>
    </div>
  );
}
