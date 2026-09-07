import React from "react";
import { MessageSquare, BarChart3, Sparkles, Shield, Bell } from "lucide-react";
import FeedbackSubmissionForm from "../components/FeedbackSubmissionForm";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-white">
            Customer Feedback Hub
          </span>
        </div>

        <nav className="flex items-center gap-4">
          <a
            href="/admin"
            className="text-xs font-semibold px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 rounded-xl transition flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Admin Portal &rarr;
          </a>
        </nav>
      </header>

      <section className="bg-slate-950/60 border-b border-slate-800/80 py-12 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered Sentiment Analysis
            Pipeline
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            We Value Your Feedback
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Share your experience to help us continuously analyze customer
            satisfaction, categorize common issues, and improve our services.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10">
        <FeedbackSubmissionForm />
      </main>

      <footer className="border-t border-slate-800 py-6 px-6 text-center text-xs text-slate-500">
        <div className="flex justify-center items-center gap-6 mb-2">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-indigo-400" /> RBAC Protected
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> AI
            Classification
          </span>
          <span className="flex items-center gap-1">
            <Bell className="w-3.5 h-3.5 text-amber-400" /> Real-Time Alerts
          </span>
        </div>
        <div>Customer Feedback Analyzer &copy; 2026. All rights reserved.</div>
      </footer>
    </div>
  );
}
