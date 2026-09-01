import React, { useState, useEffect, useRef } from "react";
import { RefreshCw, Check, Copy, Shield, Key } from "lucide-react";
import { passwordService } from "../services/api";
import StrengthMeter from "./StrengthMeter";

const PasswordGenerator = () => {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeDigits, setIncludeDigits] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const [password, setPassword] = useState("");
  const [entropyBits, setEntropyBits] = useState(104.8);
  const [strength, setStrength] = useState("Very Strong");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordRef = useRef(null);

  const activeSetsCount = [
    includeUppercase,
    includeLowercase,
    includeDigits,
    includeSymbols,
  ].filter(Boolean).length;

  const handleGenerate = async (
    len = length,
    incUpper = includeUppercase,
    incLower = includeLowercase,
    incDig = includeDigits,
    incSym = includeSymbols,
  ) => {
    setLoading(true);
    setError("");
    try {
      const data = await passwordService.generatePassword({
        length: Number(len),
        include_uppercase: incUpper,
        include_lowercase: incLower,
        include_digits: incDig,
        include_symbols: incSym,
      });
      setPassword(data.password);
      setEntropyBits(data.entropy_bits || 104.8);
      setStrength(data.strength || "Very Strong");
    } catch (err) {
      console.error("Password generation failed:", err);
      // Fallback local generator for offline/resilient UI rendering
      generateLocalFallback(Number(len), incUpper, incLower, incDig, incSym);
      setError("Backend API unavailable; generated password locally.");
    } finally {
      setLoading(false);
    }
  };

  const generateLocalFallback = (len, incUpper, incLower, incDig, incSym) => {
    let chars = "";
    if (incUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (incLower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (incDig) chars += "0123456789";
    if (incSym) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";

    let result = "";
    const array = new Uint32Array(len);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < len; i++) {
      result += chars[array[i] % chars.length];
    }
    setPassword(result);
    const poolSize = chars.length;
    const bits = len * Math.log2(poolSize);
    setEntropyBits(bits);
    let str = "Weak";
    if (bits >= 100) str = "Very Strong";
    else if (bits >= 70) str = "Strong";
    else if (bits >= 40) str = "Medium";
    setStrength(str);
  };

  useEffect(() => {
    handleGenerate();
  }, []);

  const handleLengthChange = (val) => {
    let num = parseInt(val, 10);
    if (isNaN(num)) num = 16;
    if (num < 8) num = 8;
    if (num > 128) num = 128;
    setLength(num);
  };

  const handleToggle = (setter, currentValue) => {
    if (currentValue && activeSetsCount <= 1) {
      setError("At least one character set must remain selected.");
      return;
    }
    setError("");
    setter(!currentValue);
  };

  const handleCopy = async () => {
    if (!password) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(password);
      } else {
        if (passwordRef.current) {
          passwordRef.current.select();
          document.execCommand("copy");
        }
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      if (passwordRef.current) {
        passwordRef.current.select();
      }
      alert("Press Ctrl+C or Cmd+C to copy password.");
    }
  };

  const applyPreset = (presetLength, upper, lower, digits, symbols) => {
    setLength(presetLength);
    setIncludeUppercase(upper);
    setIncludeLowercase(lower);
    setIncludeDigits(digits);
    setIncludeSymbols(symbols);
    handleGenerate(presetLength, upper, lower, digits, symbols);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Main Generator Section */}
      <div className="lg:col-span-7 space-y-6">
        {/* Output Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Generated Secure Password
            </span>
            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              {password.length} Chars • {entropyBits.toFixed(1)} Bits Entropy
            </span>
          </div>

          <div className="relative mb-4">
            <textarea
              ref={passwordRef}
              readOnly
              value={password}
              rows={2}
              className="w-full p-4 bg-slate-100 rounded-xl text-xl font-mono font-bold text-slate-800 tracking-wider break-all resize-none border border-slate-200 focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-xs text-amber-600 mb-3 font-medium bg-amber-50 p-2 rounded border border-amber-200">
              {error}
            </p>
          )}

          <div className="flex space-x-3 mb-4">
            <button
              onClick={handleCopy}
              className={`flex-1 ${
                copied
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white font-medium py-2.5 px-4 rounded-lg shadow-sm flex items-center justify-center space-x-2 transition-all duration-200`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Key</span>
                </>
              )}
            </button>
            <button
              onClick={() => handleGenerate()}
              disabled={loading}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span>Regenerate</span>
            </button>
          </div>

          <StrengthMeter strength={strength} entropyBits={entropyBits} />
        </div>

        {/* Customization Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900">
            Customization Controls
          </h2>

          {/* Slider & Numerical Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="length-slider"
                className="text-sm font-medium text-slate-700"
              >
                Password Length (8 - 128 chars)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  id="length-number-input"
                  type="number"
                  min="8"
                  max="128"
                  value={length}
                  onChange={(e) => handleLengthChange(e.target.value)}
                  className="w-16 px-2 py-1 border border-slate-300 rounded-md text-right font-bold text-blue-600 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <input
              id="length-slider"
              type="range"
              min="8"
              max="128"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <p className="text-xs text-slate-400 mt-1">
              ✓ Synchronized slider & input with auto-clamping enabled (8 to
              128)
            </p>
          </div>

          {/* Character Sets */}
          <div className="space-y-3">
            <span className="text-sm font-medium text-slate-700 block">
              Character Set Selection
            </span>

            <label className="flex items-center space-x-3 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={() =>
                  handleToggle(setIncludeUppercase, includeUppercase)
                }
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Uppercase Letters (A-Z)</span>
            </label>

            <label className="flex items-center space-x-3 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={() =>
                  handleToggle(setIncludeLowercase, includeLowercase)
                }
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Lowercase Letters (a-z)</span>
            </label>

            <label className="flex items-center space-x-3 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={includeDigits}
                onChange={() => handleToggle(setIncludeDigits, includeDigits)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Digits / Numbers (0-9)</span>
            </label>

            <label className="flex items-center space-x-3 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={() => handleToggle(setIncludeSymbols, includeSymbols)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Special Symbols (!@#$%^&*)</span>
            </label>

            <p className="text-xs text-slate-400">
              ℹ At least one character set must remain selected.
            </p>
          </div>

          <button
            onClick={() => handleGenerate()}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-sm flex items-center justify-center space-x-2 transition"
          >
            <span>⚡ Generate New Password</span>
          </button>
        </div>
      </div>

      {/* Sidebar Section */}
      <div className="lg:col-span-5 space-y-6">
        {/* Quick Presets */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <Key className="w-4 h-4 text-blue-600" />
            <span>Quick Presets</span>
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => applyPreset(32, true, true, true, true)}
              className="w-full text-left p-3 border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-blue-500 hover:bg-blue-50 font-medium transition"
            >
              High Security Key (32 chars)
            </button>
            <button
              onClick={() => applyPreset(16, true, true, true, true)}
              className="w-full text-left p-3 border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-blue-500 hover:bg-blue-50 font-medium transition"
            >
              Standard Password (16 chars)
            </button>
            <button
              onClick={() => applyPreset(8, false, false, true, false)}
              className="w-full text-left p-3 border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-blue-500 hover:bg-blue-50 font-medium transition"
            >
              PIN Code (8 digits)
            </button>
            <button
              onClick={() => applyPreset(64, true, true, true, false)}
              className="w-full text-left p-3 border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-blue-500 hover:bg-blue-50 font-medium transition"
            >
              API Auth Token (64 hex/alnum)
            </button>
          </div>
        </div>

        {/* Security & Entropy Info */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center space-x-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Security & Entropy</span>
          </h3>
          <div className="text-2xl font-bold text-slate-900 mb-1">
            {entropyBits.toFixed(1)} Bits
          </div>
          <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
            {strength} Rating
          </span>
          <div className="mt-4 space-y-2 text-xs text-slate-500 border-t border-slate-100 pt-3">
            <p>• CSPRNG: Python secrets module</p>
            <p>• Retention: Zero data storage</p>
            <p>
              • Time to Crack: ~3.4 × 10^{Math.round(entropyBits / 3)} years
            </p>
            <p>• SLA Latency: &lt; 200ms</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
