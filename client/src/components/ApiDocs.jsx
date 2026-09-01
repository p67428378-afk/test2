import React, { useState, useEffect } from "react";
import { Send, Shield, Activity, Lock, Terminal } from "lucide-react";
import { passwordService, healthService } from "../services/api";

const ApiDocs = () => {
  const [reqLength, setReqLength] = useState(16);
  const [reqUpper, setReqUpper] = useState(true);
  const [reqLower, setReqLower] = useState(true);
  const [reqDigits, setReqDigits] = useState(true);
  const [reqSymbols, setReqSymbols] = useState(true);

  const [responseJson, setResponseJson] = useState(null);
  const [statusCode, setStatusCode] = useState(200);
  const [loading, setLoading] = useState(false);

  const [healthData, setHealthData] = useState(null);
  const [healthStatus, setHealthStatus] = useState("Checking...");

  const requestPayload = {
    length: Number(reqLength),
    include_uppercase: reqUpper,
    include_lowercase: reqLower,
    include_digits: reqDigits,
    include_symbols: reqSymbols,
  };

  const handleSendTest = async () => {
    setLoading(true);
    try {
      const data = await passwordService.generatePassword(requestPayload);
      setResponseJson(data);
      setStatusCode(200);
    } catch (err) {
      console.error("Test request error:", err);
      setStatusCode(err.response?.status || 422);
      setResponseJson(
        err.response?.data || {
          detail: "Validation or server error occurred.",
        },
      );
    } finally {
      setLoading(false);
    }
  };

  const handleHealthProbe = async () => {
    try {
      const res = await healthService.checkHealth();
      setHealthData(res);
      setHealthStatus(res.status || "healthy");
    } catch (err) {
      setHealthStatus("unhealthy");
      setHealthData({ status: "unhealthy", error: "Service unreachable" });
    }
  };

  useEffect(() => {
    handleSendTest();
    handleHealthProbe();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Endpoint Tester */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-blue-600" />
              <span>API Endpoint Tester</span>
            </h2>
            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-mono font-bold rounded">
              POST /api/v1/passwords/generate
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Interactive request builder for testing the cryptographically secure
            password generator API.
          </p>

          {/* Test Controls */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-medium text-slate-700">
              <span>Length: {reqLength}</span>
              <input
                type="range"
                min="8"
                max="128"
                value={reqLength}
                onChange={(e) => setReqLength(Number(e.target.value))}
                className="w-36 accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reqUpper}
                  onChange={(e) => setReqUpper(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Uppercase (A-Z)</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reqLower}
                  onChange={(e) => setReqLower(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Lowercase (a-z)</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reqDigits}
                  onChange={(e) => setReqDigits(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Digits (0-9)</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reqSymbols}
                  onChange={(e) => setReqSymbols(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Symbols (!@#$)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">
              Request Payload
            </label>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto">
              {JSON.stringify(requestPayload, null, 2)}
            </pre>
          </div>

          <button
            onClick={handleSendTest}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm text-sm flex items-center justify-center space-x-2 transition"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? "Sending..." : "Send Test Request"}</span>
          </button>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-700">
                Response Payload
              </label>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  statusCode === 200
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {statusCode} {statusCode === 200 ? "OK" : "Error"}
              </span>
            </div>
            <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto">
              {responseJson
                ? JSON.stringify(responseJson, null, 2)
                : "// Response will appear here"}
            </pre>
          </div>
        </div>
      </div>

      {/* Security Principles & Health */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span>Security Principles</span>
          </h3>

          <ul className="space-y-3 text-xs text-slate-600">
            <li className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <strong className="text-slate-800 block mb-1 flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-blue-600 mr-1" />
                <span>Cryptographic CSPRNG</span>
              </strong>
              Powered by Python&apos;s <code>secrets</code> module guaranteeing
              unbiased character distribution and security.
            </li>

            <li className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <strong className="text-slate-800 block mb-1 flex items-center space-x-1">
                <Shield className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                <span>Zero Data Retention</span>
              </strong>
              Stateless in-memory execution. Passwords are generated on the fly
              and never stored or logged.
            </li>

            <li className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <strong className="text-slate-800 block mb-1 flex items-center space-x-1">
                <Activity className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                <span>Health Check Probe</span>
              </strong>
              Endpoint <code>GET /api/v1/health</code> returns operational state
              for monitoring and SLA tracking.
            </li>
          </ul>
        </div>

        {/* Health Check Live Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-slate-900">
              Health Check Status
            </h4>
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                healthStatus === "healthy" || healthStatus === "ok"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              API: {healthStatus}
            </span>
          </div>

          <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono overflow-x-auto">
            {healthData
              ? JSON.stringify(healthData, null, 2)
              : "Probing /api/v1/health..."}
          </pre>

          <button
            onClick={handleHealthProbe}
            className="w-full text-xs text-blue-600 font-semibold hover:underline text-center block pt-1"
          >
            Re-probe Health Endpoint
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;
