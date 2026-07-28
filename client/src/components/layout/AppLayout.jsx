import React from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";

export default function AppLayout({
  children,
  onNewCaseClick,
  onUploadEvidenceClick,
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0F172A] text-[#dae2fd]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Wrapper */}
      <div className="ml-[260px] flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <Header
          onNewCaseClick={onNewCaseClick}
          onUploadEvidenceClick={onUploadEvidenceClick}
        />

        {/* Scrollable Canvas */}
        <main className="flex-1 overflow-y-auto mt-16 p-6 bg-[#0F172A]">
          <div className="max-w-[1440px] mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
