import React from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";

const AppLayout = ({ children }) => {
  return (
    <div className="w-full h-full flex overflow-hidden bg-surface text-on-surface font-body-md">
      <Sidebar />
      <div className="flex-1 ml-[260px] flex flex-col h-full overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-container-margin space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
