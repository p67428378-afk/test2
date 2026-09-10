import React from "react";
import TopNavBar from "../components/layout/TopNavBar";

export default function ResumeBuilderPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopNavBar />
      <div className="grid grid-cols-12 gap-6 p-6">
        <div className="col-span-6 bg-white rounded-xl border border-slate-200 p-6">
          Form Editor
        </div>
        <div className="col-span-6 bg-slate-100 rounded-xl p-6">
          Live A4 Paper Preview
        </div>
      </div>
    </div>
  );
}
