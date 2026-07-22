import React from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";

const AppLayout = ({
  children,
  isConnected = true,
  searchQuery = "",
  setSearchQuery = () => {},
}) => {
  return (
    <div className="bg-background text-on-surface h-screen overflow-hidden flex">
      <Sidebar />
      <div className="flex-1 flex flex-col pl-[260px] h-screen">
        <Header
          isConnected={isConnected}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <main className="flex-1 mt-[64px] p-margin-desktop overflow-x-hidden overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
