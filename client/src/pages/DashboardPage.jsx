import React, { useState, useEffect } from "react";
import { Key, Layers, FileCode, CheckCircle, AlertCircle } from "lucide-react";
import PasswordGenerator from "../components/PasswordGenerator";
import BatchGenerator from "../components/BatchGenerator";
import ApiDocs from "../components/ApiDocs";
import { healthService } from "../services/api";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("generator");
  const [healthStatus, setHealthStatus] = useState("Healthy");
  const [isHealthy, setIsHealthy] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await healthService.checkHealth();
        if (data && (data.status === "healthy" || data.status === "ok")) {
          setHealthStatus("API: Healthy");
          setIsHealthy(true);
        } else {
          setHealthStatus("API: Degrading");
          setIsHealthy(false);
        }
      } catch (err) {
        setHealthStatus("API: Offline Mode");
        setIsHealthy(false);
      }
    };
    fetchHealth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Header Navigation */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex flex-wrap items-center space-x-3 sm:space-x-6">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setActiveTab("generator")}
            >
              <span className="text-2xl">🔑</span>
              <h1 className="text-xl font-bold text-blue-600 tracking-tight">
                KeyCraft
              </h1>
            </div>

            <nav className="flex space-x-2 sm:space-x-4 text-sm font-medium text-slate-500">
              <button
                onClick={() => setActiveTab("generator")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "generator"
                    ? "text-blue-600 font-semibold bg-blue-50"
                    : "hover:text-slate-900"
                }`}
              >
                Generator
              </button>

              <button
                onClick={() => setActiveTab("batch")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "batch"
                    ? "text-blue-600 font-semibold bg-blue-50"
                    : "hover:text-slate-900"
                }`}
              >
                Batch Keys
              </button>

              <button
                onClick={() => setActiveTab("apidocs")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "apidocs"
                    ? "text-blue-600 font-semibold bg-blue-50"
                    : "hover:text-slate-900"
                }`}
              >
                API Docs
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center space-x-1.5 ${
                isHealthy
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {isHealthy ? (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 inline mr-1" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 inline mr-1" />
              )}
              <span>{healthStatus}</span>
            </span>
          </div>
        </header>

        {/* Tab Content */}
        <main>
          {activeTab === "generator" && <PasswordGenerator />}
          {activeTab === "batch" && <BatchGenerator />}
          {activeTab === "apidocs" && <ApiDocs />}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
