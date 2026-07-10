import React, { useState, useEffect } from "react";
import CredentialTable from "../components/vault/CredentialTable";
import CredentialDetailCard from "../components/vault/CredentialDetailCard";
import { credentialService } from "../services/api";

// Simple base64 helper to simulate encryption/decryption
const encryptData = (data) => {
  try {
    return btoa(JSON.stringify(data));
  } catch (err) {
    console.error(err);
    return "";
  }
};

const decryptData = (encryptedStr) => {
  try {
    const decoded = atob(encryptedStr);
    return JSON.parse(decoded);
  } catch (err) {
    console.error(err);
    return null;
  }
};

const checkPasswordStrength = (pwd) => {
  if (!pwd) return "Weak";
  if (
    pwd.length >= 12 &&
    /[A-Z]/.test(pwd) &&
    /[0-9]/.test(pwd) &&
    /[^A-Za-z0-9]/.test(pwd)
  ) {
    return "Strong";
  }
  if (pwd.length >= 8) {
    return "Good";
  }
  return "Weak";
};

const DashboardPage = ({ onCopy }) => {
  const [credentials, setCredentials] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCred, setSelectedCred] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCredentials = async () => {
    try {
      setLoading(true);
      const data = await credentialService.list();
      const decrypted = data.map((item) => {
        const decryptedPayload = decryptData(item.encrypted_data) || {};
        return {
          id: item.id,
          title: decryptedPayload.title || "Untitled",
          url: decryptedPayload.url || "",
          username: decryptedPayload.username || "",
          password: decryptedPayload.password || "",
          notes: decryptedPayload.notes || "",
          passwordStrength: checkPasswordStrength(decryptedPayload.password),
          created_at: item.created_at,
          updated_at: item.updated_at,
        };
      });
      setCredentials(decrypted);
      if (decrypted.length > 0 && !selectedCred) {
        setSelectedCred(decrypted[0]);
      }
    } catch (err) {
      console.error("Failed to load credentials from vault.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredentials();
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (!query.trim()) {
      fetchCredentials();
      return;
    }
    try {
      const data = await credentialService.search(query);
      const decrypted = data.map((item) => {
        const decryptedPayload = decryptData(item.encrypted_data) || {};
        return {
          id: item.id,
          title: decryptedPayload.title || "Untitled",
          url: decryptedPayload.url || "",
          username: decryptedPayload.username || "",
          password: decryptedPayload.password || "",
          notes: decryptedPayload.notes || "",
          passwordStrength: checkPasswordStrength(decryptedPayload.password),
          created_at: item.created_at,
          updated_at: item.updated_at,
        };
      });
      // Client-side filter to be precise
      const filtered = decrypted.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.url.toLowerCase().includes(query.toLowerCase()),
      );
      setCredentials(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNew = () => {
    const newCred = {
      id: "temp-" + Date.now(),
      title: "",
      url: "",
      username: "",
      password: "",
      notes: "",
      isNew: true,
    };
    setSelectedCred(newCred);
  };

  const handleSave = async (updated) => {
    try {
      const payload = {
        title: updated.title,
        url: updated.url,
        username: updated.username,
        password: updated.password,
        notes: updated.notes,
      };
      const encrypted_data = encryptData(payload);

      if (updated.isNew) {
        const res = await credentialService.create(encrypted_data);
        const saved = {
          id: res.id,
          ...payload,
          passwordStrength: checkPasswordStrength(payload.password),
          created_at: res.created_at,
          updated_at: res.updated_at,
        };
        setCredentials((prev) => [saved, ...prev]);
        setSelectedCred(saved);
      } else {
        const res = await credentialService.update(updated.id, encrypted_data);
        const saved = {
          id: res.id,
          ...payload,
          passwordStrength: checkPasswordStrength(payload.password),
          created_at: res.created_at,
          updated_at: res.updated_at,
        };
        setCredentials((prev) =>
          prev.map((c) => (c.id === updated.id ? saved : c)),
        );
        setSelectedCred(saved);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save credential.");
    }
  };

  const handleDelete = async (id) => {
    if (id.toString().startsWith("temp-")) {
      setSelectedCred(credentials[0] || null);
      return;
    }
    if (!window.confirm("Are you sure you want to delete this credential?")) {
      return;
    }
    try {
      await credentialService.delete(id);
      const filtered = credentials.filter((c) => c.id !== id);
      setCredentials(filtered);
      setSelectedCred(filtered[0] || null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete credential.");
    }
  };

  const totalCredentials = credentials.length;
  const strongCredentials = credentials.filter(
    (c) => c.passwordStrength === "Strong",
  ).length;
  const weakCredentials = credentials.filter(
    (c) => c.passwordStrength === "Weak",
  ).length;
  const securityScore =
    totalCredentials > 0
      ? Math.round((strongCredentials / totalCredentials) * 100)
      : 100;

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Search and Add Header */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center w-96 relative group">
          <span className="material-symbols-outlined absolute left-3 text-[#bbcabf] group-focus-within:text-[#4edea3] transition-colors">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full bg-[#131b2e] border border-[#3c4a42] rounded-lg pl-10 pr-4 py-2 text-sm text-[#dae2fd] placeholder:text-[#bbcabf] focus:outline-none focus:border-[#4edea3] focus:ring-1 focus:ring-[#4edea3] transition-all"
            placeholder="Search entries by title or URL..."
          />
        </div>
        <button
          onClick={handleAddNew}
          className="bg-[#4edea3] text-[#003824] font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add New Credential
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#171f33] border border-[#3c4a42] rounded-lg p-4 flex flex-col justify-between hover:border-[#2d3449] transition-colors">
          <div className="flex items-center justify-between text-[#bbcabf] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Credentials
            </span>
            <span className="material-symbols-outlined text-lg">
              folder_open
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-[#dae2fd]">
              {totalCredentials}
            </span>
            <span className="text-xs text-[#bbcabf] mb-1">entries</span>
          </div>
        </div>

        <div className="bg-[#171f33] border border-[#3c4a42] rounded-lg p-4 flex flex-col justify-between hover:border-[#2d3449] transition-colors">
          <div className="flex items-center justify-between text-[#bbcabf] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Security Score
            </span>
            <span className="material-symbols-outlined text-lg">
              verified_user
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg
                className="w-full h-full -rotate-90"
                viewBox="0 0 36 36"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="stroke-[#2d3449]"
                  cx="18"
                  cy="18"
                  fill="none"
                  r="16"
                  strokeWidth="3"
                ></circle>
                <circle
                  className="stroke-[#4edea3]"
                  cx="18"
                  cy="18"
                  fill="none"
                  r="16"
                  strokeDasharray="100, 100"
                  strokeDashoffset={100 - securityScore}
                  strokeLinecap="round"
                  strokeWidth="3"
                ></circle>
              </svg>
              <span className="absolute text-xs font-bold text-[#4edea3]">
                {securityScore}
              </span>
            </div>
            <span className="text-sm text-[#bbcabf]">
              {securityScore >= 80
                ? "Excellent"
                : securityScore >= 50
                  ? "Good"
                  : "Needs Improvement"}
            </span>
          </div>
        </div>

        <div className="bg-[#171f33] border border-[#3c4a42] rounded-lg p-4 flex flex-col justify-between hover:border-[#2d3449] transition-colors">
          <div className="flex items-center justify-between text-[#bbcabf] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Weak Passwords
            </span>
            <span className="material-symbols-outlined text-lg">warning</span>
          </div>
          <div className="flex items-end gap-2">
            <span
              className={`text-3xl font-bold ${weakCredentials > 0 ? "text-[#ffb4ab]" : "text-[#4edea3]"}`}
            >
              {weakCredentials}
            </span>
            <span className="text-xs text-[#bbcabf] mb-1">entries</span>
          </div>
        </div>
      </div>

      {/* Main Split Panel */}
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-320px)] min-h-[400px]">
        {/* Left Table */}
        <div className="lg:w-3/5 bg-[#171f33] border border-[#3c4a42] rounded-lg flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-[#3c4a42] bg-[#131b2e] flex justify-between items-center">
            <h2 className="text-sm font-semibold text-[#dae2fd]">
              Vault Items
            </h2>
          </div>
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-[#bbcabf]">
              <span className="material-symbols-outlined animate-spin mr-2">
                sync
              </span>
              Loading vault...
            </div>
          ) : (
            <CredentialTable
              credentials={credentials}
              onSelect={setSelectedCred}
              selectedId={selectedCred?.id}
              onCopy={onCopy}
            />
          )}
        </div>

        {/* Right Detail Card */}
        <div className="lg:w-2/5 bg-[#171f33] border border-[#3c4a42] rounded-lg p-6 flex flex-col overflow-y-auto">
          <CredentialDetailCard
            credential={selectedCred}
            onSave={handleSave}
            onDelete={handleDelete}
            onCopy={onCopy}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
