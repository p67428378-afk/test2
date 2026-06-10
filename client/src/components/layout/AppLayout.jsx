import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

function AppLayout() {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md antialiased">
      <Sidebar />
      <div className="pl-[260px]">
        <Header />
        <main className="pt-[64px] p-margin-page">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
