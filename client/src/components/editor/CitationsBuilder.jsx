import React, { useState } from "react";
import { Plus, Trash2, Link2, ExternalLink, FileText } from "lucide-react";

export function CitationsBuilder({ citations = [], onChange }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [citationType, setCitationType] = useState("EXTERNAL");
  const [error, setError] = useState("");

  const handleAddCitation = () => {
    setError("");
    if (!title.trim() || !url.trim()) {
      setError("Title and URL are required.");
      return;
    }

    const newCitation = {
      title: title.trim(),
      url: url.trim(),
      citation_type: citationType,
    };

    onChange([...citations, newCitation]);
    setTitle("");
    setUrl("");
  };

  const handleRemove = (index) => {
    const updated = citations.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-4">
      <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
        <Link2 className="h-4 w-4 text-emerald-600" />
        <span>Reference Citations & Benchmark Links</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Citation title (e.g. Redis Benchmark Report)"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="sm:col-span-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL (https://... or Confluence RFC link)"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="sm:col-span-2">
          <select
            value={citationType}
            onChange={(e) => setCitationType(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="EXTERNAL">External URL</option>
            <option value="CONFLUENCE">Internal RFC</option>
          </select>
        </div>

        <div className="sm:col-span-1">
          <button
            type="button"
            onClick={handleAddCitation}
            className="w-full h-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center justify-center transition shadow-sm"
            title="Add Citation"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

      {citations.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500">
            Attached Citations ({citations.length}):
          </p>
          <ul className="space-y-1.5">
            {citations.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs"
              >
                <div className="flex items-center space-x-2 truncate mr-2">
                  {item.citation_type === "CONFLUENCE" ? (
                    <FileText className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <ExternalLink className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                  )}
                  <span className="font-semibold text-slate-800 truncate">
                    {item.title}
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-emerald-600 underline truncate text-[11px]"
                  >
                    {item.url}
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="text-slate-400 hover:text-red-600 p-1 flex-shrink-0"
                  title="Remove Citation"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CitationsBuilder;
