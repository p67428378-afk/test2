import React from "react";
import PropTypes from "prop-types";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background text-on-background font-sans antialiased overflow-x-hidden">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Wrapper */}
      <main className="flex-1 ml-[260px] flex flex-col min-h-screen">
        {/* Top Navigation */}
        <Header />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">{children}</div>
      </main>
    </div>
  );
}

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
