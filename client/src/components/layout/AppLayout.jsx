import React from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";

const AppLayout = ({ children, searchVal, onSearchChange }) => {
  return (
    <div className="w-full h-full flex overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col ml-[280px] h-full overflow-hidden bg-background">
        <Header searchVal={searchVal} onSearchChange={onSearchChange} />
        <div className="flex-1 overflow-y-auto p-gutter pb-xl">
          <div className="max-w-container-max mx-auto space-y-lg">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
