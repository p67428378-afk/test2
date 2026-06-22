import React, { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import WorkspacePage from "./pages/WorkspacePage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("workspace");
  const [activeTag, setActiveTag] = useState(null);
  const [newNoteTrigger, setNewNoteTrigger] = useState(0);
  const [refreshStatsTrigger, setRefreshStatsTrigger] = useState(0);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleNewNote = () => {
    setCurrentPage("workspace");
    setActiveTag(null);
    setNewNoteTrigger((prev) => prev + 1);
  };

  const handleRefreshStats = () => {
    setRefreshStatsTrigger((prev) => prev + 1);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-background text-on-background font-body">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        activeTag={activeTag}
        onTagSelect={setActiveTag}
        onNewNote={handleNewNote}
      />

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 w-[260px] bg-surface-container-low z-40 transform transition-transform duration-300 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          currentPage={currentPage}
          onPageChange={(page) => {
            setCurrentPage(page);
            setIsMobileSidebarOpen(false);
          }}
          activeTag={activeTag}
          onTagSelect={(tag) => {
            setActiveTag(tag);
            setIsMobileSidebarOpen(false);
          }}
          onNewNote={() => {
            handleNewNote();
            setIsMobileSidebarOpen(false);
          }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header
          onMenuClick={() => setIsMobileSidebarOpen(true)}
          onSave={() => {}} // Handled inside NoteEditor
          onDelete={() => {}} // Handled inside NoteEditor
          isSaving={false}
          hasSelectedNote={currentPage === "workspace"}
        />

        <div className="flex-1 overflow-hidden">
          {currentPage === "workspace" ? (
            <WorkspacePage
              activeTag={activeTag}
              onTagSelect={setActiveTag}
              newNoteTrigger={newNoteTrigger}
              onRefreshStats={handleRefreshStats}
            />
          ) : (
            <DashboardPage
              refreshTrigger={refreshStatsTrigger}
              onRefreshStats={handleRefreshStats}
            />
          )}
        </div>
      </div>
    </div>
  );
}
