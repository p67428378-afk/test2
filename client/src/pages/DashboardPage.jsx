import React, { useState, useEffect } from "react";
import AppLayout from "../components/layout/AppLayout.jsx";
import KPICards from "../components/registry/KPICards.jsx";
import VersionHistory from "../components/registry/VersionHistory.jsx";
import SchemaRegisterForm from "../components/registry/SchemaRegisterForm.jsx";
import ValidationLogsTable from "../components/registry/ValidationLogsTable.jsx";
import {
  getSubjects,
  getVersions,
  getValidationLogs,
  registerVersion,
} from "../services/api.js";

export default function DashboardPage() {
  const [subjects, setSubjects] = useState([]);
  const [currentSubject, setCurrentSubject] = useState("");
  const [versions, setVersions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const subjectsData = await getSubjects();
      setSubjects(subjectsData);

      if (subjectsData.length > 0) {
        // Default to user-events if present, otherwise first subject
        const defaultSub =
          subjectsData.find((s) => s.name === "user-events") || subjectsData[0];
        setCurrentSubject(defaultSub.name);
      }
    } catch (err) {
      console.error("Error loading subjects:", err);
      setError("Failed to load schema subjects from backend.");
    } finally {
      setLoading(false);
    }
  };

  const loadSubjectDetails = async (subjectName) => {
    if (!subjectName) return;
    try {
      const [versionsData, logsData] = await Promise.all([
        getVersions(subjectName),
        getValidationLogs(),
      ]);
      // Sort versions descending (latest first)
      const sortedVersions = [...versionsData].sort(
        (a, b) => b.version - a.version,
      );
      setVersions(sortedVersions);

      // Filter logs for current subject or show all
      setLogs(logsData);
    } catch (err) {
      console.error("Error loading subject details:", err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (currentSubject) {
      loadSubjectDetails(currentSubject);
    }
  }, [currentSubject]);

  const handleRegisterSuccess = async (schemaJson) => {
    // Call API to register
    await registerVersion(currentSubject, schemaJson);
    // Reload details
    await loadSubjectDetails(currentSubject);
  };

  const currentSubObj = subjects.find((s) => s.name === currentSubject);
  const currentCompatibility = currentSubObj?.compatibility_level || "BACKWARD";

  // Calculate validation pass rate
  const totalLogs = logs.length;
  const passedLogs = logs.filter((l) => l.status === "PASSED").length;
  const passRate =
    totalLogs > 0 ? ((passedLogs / totalLogs) * 100).toFixed(1) : "100.0";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#10b981] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-[#94A3B8]">
            Loading Schema Registry Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout
      currentSubject={currentSubject}
      onSubjectChange={setCurrentSubject}
      subjects={subjects}
    >
      {error && (
        <div className="p-4 bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 text-[#ffb4ab] rounded text-sm">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <KPICards
        subjectsCount={subjects.length}
        versionsCount={versions.length}
        currentCompatibility={currentCompatibility}
        validationPassRate={passRate}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Version History */}
        <div className="lg:col-span-8">
          <VersionHistory versions={versions} currentSubject={currentSubject} />
        </div>

        {/* Right Column: Register Form */}
        <div className="lg:col-span-4">
          <SchemaRegisterForm
            currentSubject={currentSubject}
            currentCompatibility={currentCompatibility}
            onRegisterSuccess={handleRegisterSuccess}
          />
        </div>
      </div>

      {/* Validation Logs Table */}
      <ValidationLogsTable logs={logs} />
    </AppLayout>
  );
}
