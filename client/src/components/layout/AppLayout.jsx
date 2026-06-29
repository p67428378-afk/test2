import React from "react";
import PropTypes from "prop-types";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout({
  user,
  activeTab,
  setActiveTab,
  onLogout,
  isOnline,
  onToggleOnline,
  children,
}) {
  return (
    <div className="flex min-h-screen bg-background text-on-background">
      <Sidebar
        currentRole={user?.role || "customer"}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
      />
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <Header
          user={user}
          isOnline={isOnline}
          onToggleOnline={onToggleOnline}
        />
        <main className="flex-1 p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}

AppLayout.propTypes = {
  user: PropTypes.object,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  isOnline: PropTypes.bool,
  onToggleOnline: PropTypes.func,
  children: PropTypes.node.isRequired,
};
