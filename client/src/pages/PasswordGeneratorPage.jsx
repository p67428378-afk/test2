import React, { useState } from "react";
import { vaultService } from "../services/api";

const PasswordGeneratorPage = ({ onCopy }) => {
  const [length, setLength] = useState(16);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError("");
    setGeneratedPassword("");

    if (
      !includeLowercase &&
      !includeUppercase &&
      !includeNumbers &&
      !includeSymbols
    ) {
      setError("At least one character type must be selected.");
      return;
    }

    setLoading(true);
    try {
      const res = await vaultService.generatePassword(
        length,
        includeLowercase,
        includeUppercase,
        includeNumbers,
        includeSymbols,
      );
      setGeneratedPassword(res.password);
    } catch (err) {
      console.error(err);
      setError("Failed to generate password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#4edea3]">
          Secure Password Generator
        </h2>
        <p className="text-sm text-[#bbcabf]">
          Generate strong, random passwords to keep your online accounts secure.
        </p>
      </div>

      {error && (
        <div className="bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 text-[#ffb4ab] p-3 rounded-lg text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">error</span>
          {error}
        </div>
      )}

      <div className="bg-[#171f33] border border-[#3c4a42] rounded-lg p-6 space-y-6">
        {/* Result Display */}
        <div className="bg-[#0b1326] border border-[#3c4a42] rounded-lg p-4 flex items-center justify-between gap-4 group focus-within:border-[#4edea3] transition-all">
          <input
            type="text"
            readOnly
            value={generatedPassword}
            className="bg-transparent border-none p-0 flex-1 font-mono text-lg text-[#dae2fd] focus:ring-0 tracking-wider"
            placeholder="Click Generate below..."
          />
          {generatedPassword && (
            <button
              onClick={() => onCopy(generatedPassword, "Generated Password")}
              className="text-[#bbcabf] hover:text-[#4edea3] transition-colors p-1"
              title="Copy Password"
            >
              <span className="material-symbols-outlined text-2xl">
                content_copy
              </span>
            </button>
          )}
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Length Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold text-[#bbcabf]">
              <span>Password Length</span>
              <span className="text-[#4edea3] font-mono">
                {length} characters
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full accent-[#4edea3] bg-[#0b1326] h-2 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 bg-[#0b1326] border border-[#3c4a42] rounded-lg p-3 cursor-pointer hover:bg-[#131b2e] transition-colors">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="rounded border-[#3c4a42] text-[#4edea3] focus:ring-[#4edea3] bg-[#0b1326]"
              />
              <span className="text-sm text-[#dae2fd]">Lowercase (a-z)</span>
            </label>

            <label className="flex items-center gap-3 bg-[#0b1326] border border-[#3c4a42] rounded-lg p-3 cursor-pointer hover:bg-[#131b2e] transition-colors">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="rounded border-[#3c4a42] text-[#4edea3] focus:ring-[#4edea3] bg-[#0b1326]"
              />
              <span className="text-sm text-[#dae2fd]">Uppercase (A-Z)</span>
            </label>

            <label className="flex items-center gap-3 bg-[#0b1326] border border-[#3c4a42] rounded-lg p-3 cursor-pointer hover:bg-[#131b2e] transition-colors">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="rounded border-[#3c4a42] text-[#4edea3] focus:ring-[#4edea3] bg-[#0b1326]"
              />
              <span className="text-sm text-[#dae2fd]">Numbers (0-9)</span>
            </label>

            <label className="flex items-center gap-3 bg-[#0b1326] border border-[#3c4a42] rounded-lg p-3 cursor-pointer hover:bg-[#131b2e] transition-colors">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="rounded border-[#3c4a42] text-[#4edea3] focus:ring-[#4edea3] bg-[#0b1326]"
              />
              <span className="text-sm text-[#dae2fd]">Symbols (!@#$%)</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4edea3] text-[#003824] font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">
                  sync
                </span>
                Generating...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">
                  autorenew
                </span>
                Generate Password
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordGeneratorPage;
