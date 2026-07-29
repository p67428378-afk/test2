import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import Modal from "../common/Modal.jsx";
import ItemForm from "../items/ItemForm.jsx";

export default function AppLayout({ children, onSearchChange, searchValue }) {
  const [isQuickReportOpen, setIsQuickReportOpen] = useState(false);

  const handleQuickReportSuccess = () => {
    setIsQuickReportOpen(false);
    // Reload page or trigger state update if needed
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex bg-[#1E293B] text-[#dae2fd]">
      <Sidebar onQuickReport={() => setIsQuickReportOpen(true)} />

      <div className="flex-1 ml-[280px] min-h-screen flex flex-col bg-[#1E293B]">
        <Header onSearchChange={onSearchChange} searchValue={searchValue} />

        <main className="flex-1 mt-16 p-8 max-w-[1440px] mx-auto w-full">
          {children}
        </main>
      </div>

      <Modal
        isOpen={isQuickReportOpen}
        onClose={() => setIsQuickReportOpen(false)}
        title="Quick Report Item"
      >
        <ItemForm
          onSuccess={handleQuickReportSuccess}
          onCancel={() => setIsQuickReportOpen(false)}
        />
      </Modal>
    </div>
  );
}
