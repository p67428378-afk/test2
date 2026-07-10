import React, { useState, useEffect } from "react";

const CredentialDetailCard = ({ credential, onSave, onDelete, onCopy }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (credential) {
      setTitle(credential.title || "");
      setUrl(credential.url || "");
      setUsername(credential.username || "");
      setPassword(credential.password || "");
      setNotes(credential.notes || "");
      setIsEditing(credential.isNew || false);
      setShowPassword(false);
    }
  }, [credential]);

  if (!credential) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-[#bbcabf] p-6 text-center">
        <span className="material-symbols-outlined text-4xl mb-2 text-[#3c4a42]">
          shield
        </span>
        <p>Select an item to view details or create a new one.</p>
      </div>
    );
  }

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    onSave({
      ...credential,
      title,
      url,
      username,
      password,
      notes,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (credential.isNew) {
      onDelete(credential.id);
    } else {
      setTitle(credential.title || "");
      setUrl(credential.url || "");
      setUsername(credential.username || "");
      setPassword(credential.password || "");
      setNotes(credential.notes || "");
      setIsEditing(false);
    }
  };

  const strength = credential.passwordStrength || "Weak";

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-[#4edea3] font-bold text-xl shadow-inner border border-[#3c4a42]/30 shrink-0">
            {title ? title.charAt(0).toUpperCase() : "P"}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-title-md text-lg text-[#dae2fd] leading-tight truncate">
              {title || "New Entry"}
            </h3>
            <p className="text-xs text-[#bbcabf]">
              {credential.updated_at
                ? `Updated: ${new Date(credential.updated_at).toLocaleDateString()}`
                : "Unsaved"}
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-4 flex-1 overflow-y-auto pr-1"
      >
        <div>
          <label className="block text-xs font-semibold text-[#bbcabf] mb-1 uppercase tracking-wider">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!isEditing}
            className="w-full bg-[#0b1326] border border-[#3c4a42] rounded-lg p-2.5 text-sm text-[#dae2fd] focus:outline-none focus:border-[#4edea3] focus:ring-1 focus:ring-[#4edea3] disabled:opacity-60"
            placeholder="e.g. Google Account"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#bbcabf] mb-1 uppercase tracking-wider">
            URL
          </label>
          <div className="flex items-center gap-2 bg-[#0b1326] border border-[#3c4a42] rounded-lg p-2.5 focus-within:border-[#4edea3] focus-within:ring-1 focus-within:ring-[#4edea3] transition-all">
            <span className="material-symbols-outlined text-[#bbcabf] text-[20px]">
              link
            </span>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={!isEditing}
              className="bg-transparent border-none p-0 flex-1 text-sm text-[#dae2fd] focus:ring-0 disabled:opacity-60"
              placeholder="https://example.com"
            />
            {!isEditing && url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#bbcabf] hover:text-[#4edea3] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  open_in_new
                </span>
              </a>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#bbcabf] mb-1 uppercase tracking-wider">
            Username / Email
          </label>
          <div className="flex items-center gap-2 bg-[#0b1326] border border-[#3c4a42] rounded-lg p-2.5 focus-within:border-[#4edea3] focus-within:ring-1 focus-within:ring-[#4edea3] transition-all">
            <span className="material-symbols-outlined text-[#bbcabf] text-[20px]">
              person
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={!isEditing}
              className="bg-transparent border-none p-0 flex-1 text-sm text-[#dae2fd] focus:ring-0 disabled:opacity-60"
              placeholder="username@email.com"
            />
            {!isEditing && username && (
              <button
                type="button"
                onClick={() => onCopy(username, "Username")}
                className="text-[#bbcabf] hover:text-[#4edea3] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  content_copy
                </span>
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#bbcabf] mb-1 uppercase tracking-wider">
            Password
          </label>
          <div className="flex items-center gap-2 bg-[#0b1326] border border-[#3c4a42] rounded-lg p-2.5 focus-within:border-[#4edea3] focus-within:ring-1 focus-within:ring-[#4edea3] transition-all">
            <span className="material-symbols-outlined text-[#bbcabf] text-[20px]">
              key
            </span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!isEditing}
              className="bg-transparent border-none p-0 flex-1 text-sm text-[#dae2fd] focus:ring-0 tracking-widest disabled:opacity-60"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#bbcabf] hover:text-[#dae2fd] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
            {!isEditing && password && (
              <button
                type="button"
                onClick={() => onCopy(password, "Password")}
                className="text-[#bbcabf] hover:text-[#4edea3] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  content_copy
                </span>
              </button>
            )}
          </div>
          {!isEditing && password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1 bg-[#2d3449] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${strength === "Strong" ? "w-full bg-[#4edea3]" : strength === "Good" ? "w-2/3 bg-amber-500" : "w-1/3 bg-[#ffb4ab]"}`}
                ></div>
              </div>
              <span className="text-[10px] text-[#bbcabf] uppercase tracking-wider">
                {strength}
              </span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#bbcabf] mb-1 uppercase tracking-wider">
            Secure Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={!isEditing}
            rows="3"
            className="w-full bg-[#0b1326] border border-[#3c4a42] rounded-lg p-2.5 text-sm text-[#dae2fd] focus:outline-none focus:border-[#4edea3] focus:ring-1 focus:ring-[#4edea3] disabled:opacity-60 resize-none"
            placeholder="Add secure notes here..."
          />
        </div>

        {isEditing && (
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-[#4edea3] text-[#003824] font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity text-sm"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 border border-[#3c4a42] text-[#dae2fd] font-semibold py-2 rounded-lg hover:bg-[#222a3d] transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </form>

      {!isEditing && (
        <div className="mt-6 pt-4 border-t border-[#3c4a42] flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 border border-[#3c4a42] text-[#dae2fd] font-semibold py-2 rounded-lg hover:bg-[#222a3d] transition-colors text-sm"
          >
            Edit Entry
          </button>
          <button
            onClick={() => onDelete(credential.id)}
            className="px-4 border border-[#ffb4ab]/30 text-[#ffb4ab] py-2 rounded-lg hover:bg-[#ffb4ab]/10 transition-colors flex items-center justify-center"
            title="Delete Entry"
          >
            <span className="material-symbols-outlined text-[20px]">
              delete
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CredentialDetailCard;
