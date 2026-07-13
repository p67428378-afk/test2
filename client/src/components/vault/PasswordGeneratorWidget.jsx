import React, { useState, useEffect } from "react";
import { Copy, RefreshCw, Check, ShieldCheck } from "lucide-react";
import { passwordService } from "../../services/api";

export default function PasswordGeneratorWidget() {
  const [password, setPassword] = useState("A5!b&^2@dE$fG*h#");
  const [strength, setStrength] = useState("Strong");
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const generatePassword = async () => {
    setLoading(true);
    try {
      const data = await passwordService.generate({
        length,
        ...options,
      });
      setPassword(data.password);
      setStrength(data.strength);
    } catch (err) {
      console.error("Failed to generate password", err);
      // Fallback local generator if API fails
      generateLocalFallback();
    } finally {
      setLoading(false);
    }
  };

  const generateLocalFallback = () => {
    let chars = "";
    if (options.lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (options.uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (options.numbers) chars += "0123456789";
    if (options.symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!chars) {
      setPassword("Select at least one option");
      setStrength("Weak");
      return;
    }

    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);

    if (length < 10) setStrength("Weak");
    else if (length < 14) setStrength("Medium");
    else setStrength("Strong");
  };

  useEffect(() => {
    generatePassword();
  }, [
    length,
    options.uppercase,
    options.lowercase,
    options.numbers,
    options.symbols,
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrengthColor = () => {
    switch (strength.toLowerCase()) {
      case "strong":
      case "very strong":
        return "bg-[#10b981]";
      case "medium":
        return "bg-[#ffb95f]";
      default:
        return "bg-[#ffb4ab]";
    }
  };

  const getStrengthTextClass = () => {
    switch (strength.toLowerCase()) {
      case "strong":
      case "very strong":
        return "text-[#4edea3]";
      case "medium":
        return "text-[#ffb95f]";
      default:
        return "text-[#ffb4ab]";
    }
  };

  return (
    <div className="bg-[#1E293B] border border-[#3c4a42] rounded-lg p-6 flex flex-col gap-4 sticky top-6">
      <div className="flex items-center gap-2 border-b border-[#3c4a42] pb-3 mb-1">
        <ShieldCheck className="w-5 h-5 text-[#4edea3]" />
        <h3 className="text-lg font-semibold text-[#dae2fd]">
          Quick Generator
        </h3>
      </div>

      {/* Generated Display */}
      <div className="bg-[#0b1326] border border-[#3c4a42] rounded-lg p-3 flex items-center justify-between">
        <span className="font-mono text-sm text-[#dae2fd] tracking-wider select-all overflow-hidden text-ellipsis mr-2">
          {password}
        </span>
        <button
          onClick={handleCopy}
          className="text-[#4edea3] hover:text-[#10b981] transition-colors shrink-0 p-1.5 bg-[#4edea3]/10 rounded"
          title="Copy Password"
        >
          {copied ? (
            <Check className="w-5 h-5" />
          ) : (
            <Copy className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Strength Meter */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-xs">
          <span className="text-[#bbcabf]">Strength</span>
          <span className={`font-semibold ${getStrengthTextClass()}`}>
            {strength}
          </span>
        </div>
        <div className="flex gap-1 h-1.5 w-full bg-[#0b1326] rounded-full overflow-hidden">
          <div
            className={`h-full ${getStrengthColor()} rounded-full`}
            style={{
              width: strength.toLowerCase().includes("strong")
                ? "100%"
                : strength.toLowerCase() === "medium"
                  ? "50%"
                  : "25%",
            }}
          ></div>
        </div>
      </div>

      {/* Length Slider */}
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-[#dae2fd]">Length</span>
          <span className="bg-[#0b1326] px-2 py-1 rounded text-[#4edea3] font-mono border border-[#3c4a42]">
            {length}
          </span>
        </div>
        <input
          type="range"
          min="8"
          max="64"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full accent-[#4edea3] h-1 bg-[#2d3449] rounded-full appearance-none outline-none cursor-pointer"
        />
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 mt-1">
        {Object.keys(options).map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={options[opt]}
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, [opt]: e.target.checked }))
              }
              className="form-checkbox text-[#4edea3] bg-[#0b1326] border-[#3c4a42] rounded focus:ring-[#4edea3] focus:ring-offset-[#0b1326] focus:ring-offset-2 w-4 h-4"
            />
            <span className="text-xs text-[#bbcabf] group-hover:text-[#dae2fd] transition-colors capitalize">
              {opt}
            </span>
          </label>
        ))}
      </div>

      {/* Action */}
      <button
        onClick={generatePassword}
        disabled={loading}
        className="w-full mt-2 bg-transparent border border-[#3c4a42] hover:border-[#4edea3] text-[#dae2fd] hover:text-[#4edea3] font-semibold py-2 rounded-lg flex justify-center items-center gap-2 transition-all disabled:opacity-50"
      >
        <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
        Generate New
      </button>
    </div>
  );
}
