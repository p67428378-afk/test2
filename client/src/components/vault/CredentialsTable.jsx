import React, { useState } from "react";
import {
  Copy,
  Key,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";

export default function CredentialsTable({ credentials, onEdit, onDelete }) {
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopy = (text, id, field) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setCopiedField(field);
    setTimeout(() => {
      setCopiedId(null);
      setCopiedField(null);
    }, 2000);
  };

  const getServiceInitial = (title) => {
    return title ? title.charAt(0).toUpperCase() : "S";
  };

  if (credentials.length === 0) {
    return (
      <div className="p-8 text-center text-[#bbcabf]">
        <p className="text-lg font-semibold mb-2">No credentials found</p>
        <p className="text-sm">
          Click "Add Credential" to save your first secret.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="border-b border-[#3c4a42] bg-[#0F172A]/50">
          <tr>
            <th className="p-4 text-xs font-semibold text-[#bbcabf] uppercase tracking-wider">
              Service
            </th>
            <th className="p-4 text-xs font-semibold text-[#bbcabf] uppercase tracking-wider">
              Username
            </th>
            <th className="p-4 text-xs font-semibold text-[#bbcabf] uppercase tracking-wider">
              Password
            </th>
            <th className="p-4 text-xs font-semibold text-[#bbcabf] uppercase tracking-wider hidden sm:table-cell">
              URL
            </th>
            <th className="p-4 text-xs font-semibold text-[#bbcabf] uppercase tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {credentials.map((cred) => {
            const isPasswordVisible = visiblePasswords[cred.id];
            return (
              <tr
                key={cred.id}
                className="border-b border-[#3c4a42] hover:bg-[#2D3748] transition-colors group"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#0b1326] flex items-center justify-center shrink-0 border border-[#3c4a42] text-[#4edea3] font-bold">
                      {getServiceInitial(cred.title)}
                    </div>
                    <span className="text-sm font-semibold text-[#dae2fd]">
                      {cred.title}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-sm text-[#bbcabf]">{cred.username}</td>
                <td className="p-4 text-sm text-[#bbcabf]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono">
                      {isPasswordVisible ? cred.password : "••••••••"}
                    </span>
                    <button
                      onClick={() => togglePasswordVisibility(cred.id)}
                      className="text-[#bbcabf] hover:text-[#4edea3] p-1"
                      title={
                        isPasswordVisible ? "Hide Password" : "Show Password"
                      }
                    >
                      {isPasswordVisible ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="p-4 text-sm text-[#bbcabf] hidden sm:table-cell">
                  {cred.url ? (
                    <a
                      href={
                        cred.url.startsWith("http")
                          ? cred.url
                          : `https://${cred.url}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-[#4edea3] transition-colors"
                    >
                      {cred.url}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-gray-600">—</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    <button
                      onClick={() =>
                        handleCopy(cred.username, cred.id, "username")
                      }
                      className="text-[#bbcabf] hover:text-[#4edea3] p-1"
                      title="Copy Username"
                    >
                      {copiedId === cred.id && copiedField === "username" ? (
                        <Check className="w-4 h-4 text-[#4edea3]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() =>
                        handleCopy(cred.password, cred.id, "password")
                      }
                      className="text-[#bbcabf] hover:text-[#4edea3] p-1"
                      title="Copy Password"
                    >
                      {copiedId === cred.id && copiedField === "password" ? (
                        <Check className="w-4 h-4 text-[#4edea3]" />
                      ) : (
                        <Key className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => onEdit(cred)}
                      className="text-[#bbcabf] hover:text-[#4edea3] p-1"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(cred.id)}
                      className="text-[#bbcabf] hover:text-[#ffb4ab] p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
