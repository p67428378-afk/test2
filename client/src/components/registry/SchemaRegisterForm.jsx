import React, { useState } from "react";
import {
  PlusSquare,
  CheckSquare,
  UploadCloud,
  AlertCircle,
} from "lucide-react";

export default function SchemaRegisterForm({
  currentSubject,
  currentCompatibility,
  onRegisterSuccess,
}) {
  const [schemaJson, setSchemaJson] = useState(
    JSON.stringify(
      {
        type: "record",
        name: "UserEvent",
        namespace: "com.example",
        fields: [
          { name: "event_id", type: "string" },
          { name: "user_id", type: "string" },
          { name: "timestamp", type: "long" },
          { name: "session_id", type: ["null", "string"], default: null },
        ],
      },
      null,
      2,
    ),
  );

  const [status, setStatus] = useState({ type: "", message: "" });
  const [isValidating, setIsValidating] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleValidate = async () => {
    setStatus({ type: "", message: "" });
    setIsValidating(true);
    try {
      // Parse JSON first to ensure it is valid JSON
      const parsed = JSON.parse(schemaJson);

      // We can simulate validation or call a dry-run if backend supports it.
      // Since backend POST /api/v1/schemas/{subject}/versions does actual validation and registers,
      // we can do a local JSON validation check, and let the user know it's syntactically valid.
      setStatus({
        type: "success",
        message:
          "JSON syntax is valid. Click Register to verify backward compatibility and save.",
      });
    } catch (err) {
      setStatus({
        type: "error",
        message: `Invalid JSON: ${err.message}`,
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleRegister = async () => {
    setStatus({ type: "", message: "" });
    setIsRegistering(true);
    try {
      // Ensure valid JSON syntax first
      JSON.parse(schemaJson);

      await onRegisterSuccess(schemaJson);
      setStatus({
        type: "success",
        message: "Schema version registered successfully!",
      });
    } catch (err) {
      const errMsg =
        err.response?.data?.detail || err.message || "Registration failed";
      setStatus({
        type: "error",
        message: typeof errMsg === "object" ? JSON.stringify(errMsg) : errMsg,
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded flex flex-col h-[500px]">
      <div className="p-4 border-b border-[#334155] bg-[#171f33] rounded-t">
        <h2 className="text-sm font-semibold text-[#F8FAFC] flex items-center gap-2">
          <PlusSquare className="w-5 h-5 text-[#10b981]" />
          <span>Register New Version</span>
        </h2>
      </div>
      <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          {/* Subject (Disabled) */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#94A3B8] mb-1.5 font-semibold">
              Subject
            </label>
            <input
              className="w-full bg-[#0F172A] border border-[#334155] rounded py-1.5 px-3 text-sm text-[#94A3B8] opacity-70 cursor-not-allowed"
              disabled
              type="text"
              value={currentSubject}
            />
          </div>
          {/* Compatibility (Disabled) */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#94A3B8] mb-1.5 font-semibold">
              Compatibility
            </label>
            <input
              className="w-full bg-[#0F172A] border border-[#334155] rounded py-1.5 px-3 text-sm text-[#94A3B8] opacity-70 cursor-not-allowed"
              disabled
              type="text"
              value={currentCompatibility}
            />
          </div>
        </div>

        {/* JSON Editor Area */}
        <div className="flex-1 flex flex-col min-h-[200px]">
          <label className="block text-[11px] uppercase tracking-wider text-[#94A3B8] mb-1.5 font-semibold">
            Schema Definition (Avro JSON)
          </label>
          <textarea
            className="flex-1 w-full bg-[#0F172A] border border-[#334155] rounded p-3 text-xs font-mono text-[#E2E8F0] focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all resize-none leading-relaxed"
            spellCheck="false"
            value={schemaJson}
            onChange={(e) => setSchemaJson(e.target.value)}
          />
        </div>

        {/* Status Message */}
        {status.message && (
          <div
            className={`p-3 rounded text-xs flex items-start gap-2 ${
              status.type === "success"
                ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20"
                : "bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/20"
            }`}
          >
            {status.type === "error" && (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <span>{status.message}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2 mt-auto">
          <button
            onClick={handleValidate}
            disabled={isValidating || isRegistering}
            className="flex-1 py-2 px-4 rounded border border-[#334155] bg-transparent text-[#E2E8F0] text-sm font-medium hover:bg-[#334155]/50 transition-colors flex justify-center items-center gap-2"
          >
            <CheckSquare className="w-4 h-4" />
            <span>{isValidating ? "Validating..." : "Validate"}</span>
          </button>
          <button
            onClick={handleRegister}
            disabled={isValidating || isRegistering}
            className="flex-1 py-2 px-4 rounded border border-transparent bg-[#10b981] text-white text-sm font-medium hover:bg-[#059669] transition-colors flex justify-center items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isRegistering ? "Registering..." : "Register"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
