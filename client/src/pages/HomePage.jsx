import React from "react";
import { Link } from "react-router-dom";
import ProjectGallery from "../components/portfolio/ProjectGallery.jsx";
import {
  Code2,
  Sparkles,
  ArrowRight,
  Award,
  CheckCircle2,
  Star,
  Users,
  Briefcase,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const metrics = [
    {
      label: "Completed Projects",
      value: "35+",
      icon: Briefcase,
      color: "text-blue-600",
    },
    {
      label: "Client Satisfaction",
      value: "100%",
      icon: Star,
      color: "text-amber-500",
    },
    {
      label: "Enterprise Clients",
      value: "18+",
      icon: Users,
      color: "text-emerald-600",
    },
    {
      label: "Average Delivery",
      value: "2 Weeks",
      icon: Zap,
      color: "text-indigo-600",
    },
  ];

  const skills = [
    {
      category: "Frontend",
      items: [
        "React 18",
        "TypeScript",
        "Tailwind CSS",
        "Vite",
        "Next.js",
        "Redux",
      ],
    },
    {
      category: "Backend & APIs",
      items: [
        "Python 3.11",
        "FastAPI",
        "Node.js",
        "PostgreSQL",
        "SQLAlchemy",
        "Redis",
      ],
    },
    {
      category: "DevOps & Cloud",
      items: [
        "Docker",
        "Google Cloud (GCP)",
        "CI/CD Pipelines",
        "Kubernetes",
        "Harness",
      ],
    },
  ];

  const reviews = [
    {
      name: "Sarah Jenkins",
      role: "VP of Product at FinTech Global",
      content:
        "Delivered our client-facing dashboard ahead of schedule with zero defects. Outstanding attention to detail and responsive design.",
      rating: 5,
    },
    {
      name: "Marcus Vance",
      role: "Founder & CEO, HealthHub AI",
      content:
        "The end-to-end API integration and slick UI elevated our product pitch. Highly recommended for full-stack web applications.",
      rating: 5,
    },
    {
      name: "Elena Rostova",
      role: "Head of Engineering, RetailSphere",
      content:
        "Exceptional code quality, high test coverage, and clear documentation. One of the best freelance engineers we have collaborated with.",
      rating: 5,
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-white to-[#F7FAFC] border-b border-[#E3E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Available for Freelance &amp; Contract Roles</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#171C29] tracking-tight leading-tight">
              Full-Stack Engineer Building{" "}
              <span className="text-blue-600 bg-clip-text">
                Modern Web Products
              </span>
            </h1>

            <p className="text-lg text-[#707A8C] max-w-2xl mx-auto leading-relaxed">
              Specializing in high-performance React frontend interfaces,
              scalable FastAPI backends, and robust cloud deployments for
              startups and enterprises.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="#projects"
                className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all inline-flex items-center justify-center gap-2"
              >
                <span>View Featured Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to="/contact"
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-xl border border-[#E3E8F0] shadow-sm transition-all inline-flex items-center justify-center gap-2"
              >
                <span>Request Project Quote</span>
              </Link>
            </div>
          </div>

          {/* Metric Group */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.label}
                  className="bg-white border border-[#E3E8F0] rounded-xl p-5 shadow-sm text-center flex flex-col items-center justify-center"
                >
                  <Icon className={`w-6 h-6 ${metric.color} mb-2`} />
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#171C29]">
                    {metric.value}
                  </span>
                  <span className="text-xs font-medium text-[#707A8C] mt-1">
                    {metric.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Showcase Project Gallery */}
      <ProjectGallery />

      {/* Skills & Tech Stack Section */}
      <section id="skills" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#E3E8F0] rounded-2xl p-8 sm:p-12 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-2">
              <Code2 className="w-4 h-4" />
              <span>Core Expertise</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#171C29]">
              Technical Skills &amp; Stack
            </h2>
            <p className="text-[#707A8C] text-sm mt-1">
              Production-proven architectures and tools used across client
              engagements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skills.map((skillGroup) => (
              <div
                key={skillGroup.category}
                className="bg-[#F7FAFC] border border-[#E3E8F0] rounded-xl p-6"
              >
                <h3 className="text-base font-bold text-[#171C29] mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>{skillGroup.category}</span>
                </h3>
                <ul className="space-y-2.5">
                  {skillGroup.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Reviews / Testimonials */}
      <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-amber-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <Star className="w-4 h-4 fill-amber-500" />
            <span>Client Feedback</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#171C29]">
            What Clients Say
          </h2>
          <p className="text-[#707A8C] text-sm mt-1">
            Real feedback from engineering leaders, product founders, and
            project managers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.name}
              className="bg-white border border-[#E3E8F0] rounded-xl p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-700 italic mb-6 leading-relaxed">
                  &ldquo;{rev.content}&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <p className="font-bold text-sm text-[#171C29]">{rev.name}</p>
                <p className="text-xs text-[#707A8C]">{rev.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call To Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to bring your next project to life?
            </h2>
            <p className="text-blue-100 text-sm max-w-xl">
              Get in touch today for technical architecture, full-stack
              development, or code review.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3.5 bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm rounded-xl shadow-md transition-all whitespace-nowrap inline-flex items-center gap-2"
          >
            <span>Start a Conversation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
