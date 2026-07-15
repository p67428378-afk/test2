import React, { useState } from "react";
import { RefreshCw, Copy, Check, ShieldAlert, ShieldCheck } from "lucide-react";
import { passwordService } from "../../services/api";

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (
      !includeUppercase &&
      !includeLowercase &&
      !includeNumbers &&
      !includeSymbols
    ) {
      setError("Please select at least one character type.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await passwordService.generate({
        length,
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols,
      });
      setGeneratedPassword(result.password);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to generate password.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedPassword) return;
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrengthLabel = () => {
    if (!generatedPassword) return null;
    let score = 0;
    if (generatedPassword.length >= 12) score++;
    if (generatedPassword.length >= 16) score++;
    if (/[A-Z]/.test(generatedPassword)) score++;
    if (/[0-9]/.test(generatedPassword)) score++;
    if (/[^A-Za-z0-9]/.test(generatedPassword)) score++;

    if (score <= 2)
      return {
        label: "Weak",
        color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
        icon: ShieldAlert,
      };
    if (score <= 4)
      return {
        label: "Medium",
        color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        icon: ShieldAlert,
      };
    return {
      label: "Strong",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      icon: ShieldCheck,
    };
  };

  const strength = getStrengthLabel();
  const StrengthIcon = strength?.icon;

  return (
    <div className="max-w-2xl mx-auto bg-slate-900/50 border border-slate-800 rounded-xl p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">
          Password Generator
        </h2>
        <p className="text-slate-400 text-sm">
          Create strong, random passwords to secure your accounts.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Password Display */}
      <div className="mb-8">
        <div className="flex gap-2">
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3.5 font-mono text-lg text-slate-200 tracking-wider break-all min-h-[56px] flex items-center">
            {generatedPassword || (
              <span className="text-slate-600 select-none">
                Click generate below...
              </span>
            )}
          </div>
          <button
            onClick={handleCopy}
            disabled={!generatedPassword}
            className="px-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-slate-800 text-slate-200 rounded-lg border border-slate-700 transition-colors flex items-center justify-center"
            title="Copy to Clipboard"
          >
            {copied ? (
              <Check className="w-5 h-5 text-emerald-400" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        </div>

        {strength && (
          <div
            className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${strength.color}`}
          >
            <StrengthIcon className="w-3.5 h-3.5" />
            <span>{strength.label} Password</span>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-slate-300">
              Password Length
            </label>
            <span className="text-sm font-mono font-bold text-blue-400">
              {length} characters
            </span>
          </div>
          <input
            type="range"
            min="6"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <label className="flex items-center gap-3 p-3 bg-slate-950/40 border border-slate-800/60 rounded-lg cursor-pointer hover:bg-slate-800/10 transition-colors">
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
              className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
            />
            <div>
              <p className="text-sm font-medium text-slate-200">
                Uppercase Letters
              </p>
              <p className="text-xs text-slate-500">A-Z</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 bg-slate-950/40 border border-slate-800/60 rounded-lg cursor-pointer hover:bg-slate-800/10 transition-colors">
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={(e) => setIncludeLowercase(e.target.checked)}
              className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
            />
            <div>
              <p className="text-sm font-medium text-slate-200">
                Lowercase Letters
              </p>
              <p className="text-xs text-slate-500">a-z</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 bg-slate-950/40 border border-slate-800/60 rounded-lg cursor-pointer hover:bg-slate-800/10 transition-colors">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
            />
            <div>
              <p className="text-sm font-medium text-slate-200">Numbers</p>
              <p className="text-xs text-slate-500">0-9</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 bg-slate-950/40 border border-slate-800/60 rounded-lg cursor-pointer hover:bg-slate-800/10 transition-colors">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
            />
            <div>
              <p className="text-sm font-medium text-slate-200">Symbols</p>
              <p className="text-xs text-slate-500">!@#$%^&*</p>
            </div>
          </label>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Generating..." : "Generate Password"}
        </button>
      </div>
    </div>
  );
}
