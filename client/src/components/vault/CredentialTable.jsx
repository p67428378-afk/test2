import React from "react";

const CredentialTable = ({ credentials, onSelect, selectedId, onCopy }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <table className="w-full text-left border-collapse">
        <thead className="sticky top-0 bg-[#131b2e] border-b border-[#3c4a42] z-10">
          <tr>
            <th className="px-4 py-3 text-xs font-semibold text-[#bbcabf] uppercase tracking-wider">
              Title
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-[#bbcabf] uppercase tracking-wider">
              Username
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-[#bbcabf] uppercase tracking-wider">
              Strength
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-[#bbcabf] uppercase tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {credentials.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-4 py-8 text-center text-[#bbcabf]">
                No credentials found. Click "Add New Credential" to get started.
              </td>
            </tr>
          ) : (
            credentials.map((cred) => {
              const isSelected = selectedId === cred.id;
              const strength = cred.passwordStrength || "Weak";
              const strengthColor =
                strength === "Strong"
                  ? "text-[#4edea3] bg-[#4edea3]/10 border-[#4edea3]/20"
                  : strength === "Good"
                    ? "text-amber-500 bg-amber-500/10 border-amber-500/20"
                    : "text-[#ffb4ab] bg-[#ffb4ab]/10 border-[#ffb4ab]/20";

              const strengthDot =
                strength === "Strong"
                  ? "bg-[#4edea3]"
                  : strength === "Good"
                    ? "bg-amber-500"
                    : "bg-[#ffb4ab]";

              return (
                <tr
                  key={cred.id}
                  onClick={() => onSelect(cred)}
                  className={`border-b border-[#3c4a42]/50 hover:bg-[#222a3d] transition-colors cursor-pointer ${
                    isSelected ? "bg-[#222a3d]" : ""
                  }`}
                >
                  <td className="px-4 py-4 flex items-center gap-2 text-[#dae2fd] font-medium">
                    <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-[#4edea3] font-bold text-xs shrink-0">
                      {cred.title ? cred.title.charAt(0).toUpperCase() : "P"}
                    </div>
                    <span className="truncate max-w-[180px]">
                      {cred.title || "Untitled"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[#bbcabf] truncate max-w-[150px]">
                    {cred.username || "—"}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-wider ${strengthColor}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${strengthDot}`}
                      ></span>
                      {strength}
                    </span>
                  </td>
                  <td
                    className="px-4 py-4 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onCopy(cred.password, "Password")}
                      className="text-[#bbcabf] hover:text-[#4edea3] transition-colors p-1"
                      title="Copy Password"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        content_copy
                      </span>
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CredentialTable;
