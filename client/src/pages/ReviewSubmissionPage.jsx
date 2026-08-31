import React from "react";
import { Star, ShieldCheck, Award, MessageCircle } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import ReviewForm from "../components/ReviewForm";

export default function ReviewSubmissionPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-5xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-700/60 text-blue-200 text-xs font-semibold backdrop-blur-sm">
            <Star className="w-3.5 h-3.5 fill-blue-300 text-blue-300" />
            <span>Visitor Feedback & Quality Assurance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Rate Your Museum Guided Tour
          </h1>
          <p className="text-blue-100 text-sm max-w-2xl leading-relaxed">
            Your feedback directly helps us evaluate tour pacing, exhibit
            quality, and guide excellence. Please submit your review using your
            booking reservation ID.
          </p>
        </div>
      </section>

      {/* Content Layout */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-7">
            <ReviewForm />
          </div>

          <div className="md:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-blue-600" />
                <span>Eligibility Requirements</span>
              </h3>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span>
                    <strong>Completed Attendance:</strong> Only visitors with an
                    attended check-in status (
                    <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">
                      ATTENDED
                    </code>
                    ) can submit feedback.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span>
                    <strong>Single Submission:</strong> Each booking reservation
                    ID can only be reviewed once to ensure statistical
                    integrity.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span>
                    <strong>Star Ratings:</strong> Select a rating from 1 (Poor)
                    to 5 (Outstanding) stars.
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 rounded-2xl p-6 text-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Guide Evaluation Program</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reviews automatically contribute to guide performance metrics
                and museum tour quality reports reviewed by department
                administrators.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>
            © {new Date().getFullYear()} Museum Tour Management System. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
