import React, { useState, useEffect } from "react";
import { Copy, Download, Trash2, Check, RefreshCw } from "lucide-react";
import { passwordService } from "../services/api";

const BatchGenerator = () => {
  const [batchSize, setBatchSize] = useState(10);
  const [length, setLength] = useState(24);
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleGenerateBatch = async () => {
    setLoading(true);
    setCopiedAll(false);
    try {
      const results = await passwordService.generateBatch(batchSize, {
        length,
        include_uppercase: true,
        include_lowercase: true,
        include_digits: true,
        include_symbols: true,
      });
      setPasswords(results);
    } catch (err) {
      console.error("Batch generation failed:", err);
      // Local fallback
      const localResults = Array.from({ length: batchSize }, () => {
        let chars =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
        let res = "";
        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);
        for (let i = 0; i < length; i++) {
          res += chars[array[i] % chars.length];
        }
        return {
          password: res,
          length,
          entropy_bits: length * 6.5,
          strength: "Very Strong",
        };
      });
      setPasswords(localResults);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGenerateBatch();
  }, []);

  const handleCopySingle = async (pw, index) => {
    try {
      await navigator.clipboard.writeText(pw);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      alert("Failed to copy to clipboard.");
    }
  };

  const handleCopyAll = async () => {
    if (passwords.length === 0) return;
    const allText = passwords.map((p) => p.password).join("\n");
    try {
      await navigator.clipboard.writeText(allText);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (err) {
      alert("Failed to copy all keys.");
    }
  };

  const handleExportCSV = () => {
    if (passwords.length === 0) return;
    const headers = "Index,Password,Length,EntropyBits,Strength\n";
    const rows = passwords
      .map(
        (p, i) =>
          `${i + 1},"${p.password}",${p.length},${(p.entropy_bits || 0).toFixed(1)},"${p.strength || ""}"`,
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `batch_keys_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setPasswords([]);
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6 w-full md:w-auto">
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">
              Batch Size
            </label>
            <div className="flex space-x-2">
              {[5, 10, 20, 50].map((size) => (
                <button
                  key={size}
                  onClick={() => setBatchSize(size)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    batchSize === size
                      ? "bg-blue-600 text-white"
                      : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">
              Key Length: {length}
            </label>
            <input
              type="range"
              min="8"
              max="128"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-48 accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        <button
          onClick={handleGenerateBatch}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm flex items-center space-x-2 w-full md:w-auto justify-center transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Generate {batchSize} Secure Keys</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Generated Password</th>
                <th className="p-4">Length</th>
                <th className="p-4">Entropy</th>
                <th className="p-4">Strength</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
              {passwords.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center text-slate-400 font-sans"
                  >
                    No keys generated yet. Click above to generate a batch.
                  </td>
                </tr>
              ) : (
                passwords.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-sans font-medium text-slate-400">
                      {String(index + 1).padStart(2, "0")}
                    </td>
                    <td className="p-4 font-bold text-slate-800 break-all max-w-md">
                      {item.password}
                    </td>
                    <td className="p-4 font-sans">{item.length}</td>
                    <td className="p-4 font-sans">
                      {(item.entropy_bits || 0).toFixed(1)} bits
                    </td>
                    <td className="p-4 font-sans">
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                        {item.strength || "Very Strong"}
                      </span>
                    </td>
                    <td className="p-4 text-right font-sans">
                      <button
                        onClick={() => handleCopySingle(item.password, index)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded inline-flex items-center space-x-1"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {passwords.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap justify-between items-center gap-4">
            <button
              onClick={handleCopyAll}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm inline-flex items-center space-x-2 transition"
            >
              {copiedAll ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span>
                {copiedAll
                  ? "All Keys Copied!"
                  : `Copy All ${passwords.length} Keys`}
              </span>
            </button>

            <div className="flex space-x-2">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-medium inline-flex items-center space-x-1 transition"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handleClear}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium inline-flex items-center space-x-1 transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear List</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchGenerator;
