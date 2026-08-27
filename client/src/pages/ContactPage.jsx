import React from "react";
import { Link } from "react-router-dom";
import LeadCaptureForm from "../components/leads/LeadCaptureForm.jsx";
import {
  ArrowLeft,
  Mail,
  Clock,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Sparkles,
} from "lucide-react";

export default function ContactPage() {
  const highlights = [
    {
      icon: Clock,
      title: "Fast Response",
      description:
        "Guaranteed reply to all qualified inquiries within 24 business hours.",
    },
    {
      icon: ShieldCheck,
      title: "Confidentiality & NDA",
      description:
        "Your project ideas and proprietary codebases are protected under mutual NDA.",
    },
    {
      icon: MessageCircle,
      title: "Direct Engineer Access",
      description:
        "Communicate directly with the engineer architecting and building your solution.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back Link */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Client Lead Inquiry</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171C29] tracking-tight">
          Start Your Project Consultation
        </h1>
        <p className="text-sm text-[#707A8C]">
          Provide details about your project scope, budget, and timeline to
          receive a structured proposal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Guarantees & Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E3E8F0] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-[#171C29]">
              Engagement Process
            </h3>

            <div className="space-y-4">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#171C29]">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#707A8C] mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Services Offered
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    Full-Stack Web App Development (React &amp; FastAPI)
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Database Architecture &amp; API Integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cloud Deployment &amp; CI/CD Setup (GCP / Docker)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Code Review &amp; Performance Optimization</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-600 text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-blue-100 text-xs font-semibold uppercase tracking-wider">
              <Mail className="w-4 h-4 text-white" />
              <span>Direct Email</span>
            </div>
            <h3 className="text-lg font-bold">Prefer direct email?</h3>
            <p className="text-xs text-blue-100 leading-relaxed">
              You can also reach out directly with RFPs or architecture specs
              at:
            </p>
            <p className="font-mono text-sm font-semibold text-white bg-blue-700/50 px-3 py-1.5 rounded-lg inline-block">
              freelancer@devportfolio.local
            </p>
          </div>
        </div>

        {/* Right Side: Lead Capture Form */}
        <div className="lg:col-span-7">
          <LeadCaptureForm />
        </div>
      </div>
    </div>
  );
}
