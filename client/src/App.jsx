import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import EmailInputForm from "./components/EmailInputForm";
import RecentHistorySidebar from "./components/RecentHistorySidebar";
import ClassificationDashboard from "./components/ClassificationDashboard";
import CategoryOverrideModal from "./components/CategoryOverrideModal";
import { getEmails, overrideCategory } from "./services/api";
import {
  Sparkles,
  ShieldCheck,
  Mail,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("studio"); // 'studio' | 'dashboard'
  const [recentEmails, setRecentEmails] = useState([]);
  const [totalEmailsCount, setTotalEmailsCount] = useState(0);
  const [selectedEmailForModal, setSelectedEmailForModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshDashboardTrigger, setRefreshDashboardTrigger] = useState(0);

  // Fetch recent stream of emails
  const loadRecentStream = useCallback(async () => {
    try {
      const data = await getEmails({ limit: 10 });
      setRecentEmails(data.items || []);
      setTotalEmailsCount(data.total || 0);
    } catch {
      // Non-blocking initial fetch
    }
  }, []);

  useEffect(() => {
    loadRecentStream();
  }, [loadRecentStream]);

  // When a new email is classified in Studio
  const handleClassifiedSuccess = (newEmail) => {
    setRecentEmails((prev) => [
      newEmail,
      ...prev.filter((e) => e.id !== newEmail.id),
    ]);
    setTotalEmailsCount((prev) => prev + 1);
    setRefreshDashboardTrigger((prev) => prev + 1);
  };

  const handleSelectFromSidebar = (email) => {
    setSelectedEmailForModal(email);
    setIsModalOpen(true);
  };

  const handleModalUpdated = (updatedEmail) => {
    setRecentEmails((prev) =>
      prev.map((e) => (e.id === updatedEmail.id ? updatedEmail : e)),
    );
    setSelectedEmailForModal(updatedEmail);
    setRefreshDashboardTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalCount={totalEmailsCount}
      />

      {/* Quick Status / Welcome Subheader Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white py-4 px-4 sm:px-6 lg:px-8 border-b border-indigo-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
              <Sparkles className="w-4 h-4" />
            </span>
            <span>
              <strong>AI Multi-Category Classifier:</strong> Automatically tags
              emails into{" "}
              <span className="text-blue-300 font-semibold">Work</span>,{" "}
              <span className="text-emerald-300 font-semibold">Personal</span>,{" "}
              <span className="text-rose-300 font-semibold">Urgent</span>, or{" "}
              <span className="text-purple-300 font-semibold">Promotional</span>{" "}
              categories.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-slate-300 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Human
              Override Supported
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
        {activeTab === "studio" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Studio Input Workspace (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <EmailInputForm
                onClassifiedSuccess={handleClassifiedSuccess}
                onViewDashboard={() => setActiveTab("dashboard")}
              />
            </div>

            {/* Right Realtime Stream & Sidebar (4 cols) */}
            <div className="lg:col-span-4">
              <RecentHistorySidebar
                recentEmails={recentEmails}
                onSelectEmail={handleSelectFromSidebar}
                onRefresh={loadRecentStream}
              />
            </div>
          </div>
        ) : (
          <ClassificationDashboard
            onSwitchToStudio={() => setActiveTab("studio")}
            refreshTrigger={refreshDashboardTrigger}
          />
        )}
      </main>

      {/* Inspection Modal for Sidebar quick click */}
      <CategoryOverrideModal
        email={selectedEmailForModal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdated={handleModalUpdated}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            © 2026 AI Email Classification System. Built for Enterprise Email
            Operations.
          </p>
          <p className="font-mono text-[11px]">
            API: http://localhost:8000/api/v1/emails
          </p>
        </div>
      </footer>
    </div>
  );
}
