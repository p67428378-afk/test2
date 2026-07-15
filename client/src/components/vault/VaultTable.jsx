import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  Edit2,
  Trash2,
  ExternalLink,
  Globe,
} from "lucide-react";

export default function VaultTable({ entries, onEdit, onDelete }) {
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopy = (id, text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setCopiedField(field);
    setTimeout(() => {
      setCopiedId(null);
      setCopiedField(null);
    }, 2000);
  };

  const formatUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `https://${url}`;
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-xl p-8">
        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <Globe className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-slate-200 mb-1">
          Your vault is empty
        </h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Store your first secure password entry by clicking the "Add Password"
          button above.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-slate-900/50 border border-slate-800 rounded-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-950/40">
            <th className="py-4 px-6">Title</th>
            <th className="py-4 px-6">Website URL</th>
            <th className="py-4 px-6">Username</th>
            <th className="py-4 px-6">Password</th>
            <th className="py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
          {entries.map((entry) => (
            <tr
              key={entry.id}
              className="hover:bg-slate-800/20 transition-colors group"
            >
              <td className="py-4 px-6 font-medium text-slate-200">
                {entry.title}
              </td>
              <td className="py-4 px-6">
                {entry.url ? (
                  <a
                    href={formatUrl(entry.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-1.5"
                  >
                    <span className="truncate max-w-[180px]">{entry.url}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ) : (
                  <span className="text-slate-500 italic">No URL</span>
                )}
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center gap-2">
                  <span className="font-mono">{entry.username}</span>
                  <button
                    onClick={() =>
                      handleCopy(entry.id, entry.username, "username")
                    }
                    className="p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded transition-colors"
                    title="Copy Username"
                  >
                    {copiedId === entry.id && copiedField === "username" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center gap-2">
                  <span className="font-mono tracking-wider">
                    {visiblePasswords[entry.id]
                      ? entry.password
                      : "••••••••••••"}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => togglePasswordVisibility(entry.id)}
                      className="p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded transition-colors"
                      title={
                        visiblePasswords[entry.id]
                          ? "Hide Password"
                          : "Show Password"
                      }
                    >
                      {visiblePasswords[entry.id] ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() =>
                        handleCopy(entry.id, entry.password, "password")
                      }
                      className="p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded transition-colors"
                      title="Copy Password"
                    >
                      {copiedId === entry.id && copiedField === "password" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onEdit(entry)}
                    className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                    title="Edit Entry"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(entry.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
