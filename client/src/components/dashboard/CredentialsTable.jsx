import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  Edit2,
  Trash2,
  ExternalLink,
} from "lucide-react";

export default function CredentialsTable({ credentials, onEdit, onDelete }) {
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getPasswordStrength = (password) => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return Math.min(score, 4);
  };

  const renderStrengthBars = (password) => {
    const strength = getPasswordStrength(password);
    const bars = [];
    for (let i = 0; i < 4; i++) {
      const isFilled = i < strength;
      bars.push(
        <div
          key={i}
          className={`h-1.5 w-4 rounded-sm transition-all ${
            isFilled
              ? strength >= 3
                ? "bg-secondary-container shadow-[0_0_4px_rgba(16,185,129,0.5)]"
                : "bg-primary shadow-[0_0_4px_rgba(6,182,212,0.5)]"
              : "bg-surface-variant"
          }`}
        />,
      );
    }
    return <div className="flex gap-1">{bars}</div>;
  };

  return (
    <div className="cyber-card rounded-xl overflow-hidden flex flex-col">
      <div className="p-md border-b border-outline-variant/10 flex justify-between items-center bg-surface-container/30">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">
          Recent Credentials
        </h2>
        <span className="text-primary font-label-md text-label-md">
          {credentials.length} Entries
        </span>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/10 bg-surface-container/10">
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-medium">
                Title
              </th>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-medium">
                Username
              </th>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-medium">
                Password
              </th>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-medium">
                Strength
              </th>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="font-mono-data text-mono-data">
            {credentials.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="py-8 text-center text-on-surface-variant"
                >
                  No credentials found. Click "Add Credential" to create one.
                </td>
              </tr>
            ) : (
              credentials.map((cred) => (
                <tr
                  key={cred.id}
                  className="border-b border-outline-variant/5 hover:bg-surface-container/40 transition-colors group"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {cred.title ? cred.title.charAt(0).toUpperCase() : "P"}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-on-surface font-medium">
                          {cred.title}
                        </span>
                        {cred.url && (
                          <a
                            href={
                              cred.url.startsWith("http")
                                ? cred.url
                                : `https://${cred.url}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-primary hover:underline flex items-center gap-0.5"
                          >
                            {cred.url} <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant">
                    {cred.username}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-on-surface-variant tracking-[0.2em] text-[10px] mt-1">
                        {visiblePasswords[cred.id]
                          ? cred.password
                          : "••••••••••"}
                      </span>
                      <button
                        onClick={() => togglePasswordVisibility(cred.id)}
                        className="text-outline-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                        title={
                          visiblePasswords[cred.id]
                            ? "Hide Password"
                            : "Show Password"
                        }
                      >
                        {visiblePasswords[cred.id] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(cred.password, cred.id)}
                        className="text-outline-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                        title="Copy Password"
                      >
                        {copiedId === cred.id ? (
                          <Check className="w-4 h-4 text-secondary" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {renderStrengthBars(cred.password)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(cred)}
                        className="p-1 text-outline-variant hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(cred.id)}
                        className="p-1 text-outline-variant hover:text-error transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
