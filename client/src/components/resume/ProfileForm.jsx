import React from "react";
import { User, Mail, Phone, FileText, Bookmark } from "lucide-react";

export default function ProfileForm({ formData, updateFormData, errors = {} }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm">
      <div className="flex items-center space-x-2 border-b border-gray-100 pb-4 mb-6">
        <User className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-bold text-gray-900">
          Personal &amp; Profile Details
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label
            htmlFor="resume-title"
            className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1"
          >
            Resume / Document Title *
          </label>
          <div className="relative">
            <Bookmark className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              id="resume-title"
              type="text"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              placeholder="e.g. Senior Software Engineer CV"
              className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.title ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
              required
            />
          </div>
          {errors.title && (
            <p className="text-xs text-red-500 mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="full-name"
            className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1"
          >
            Full Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              id="full-name"
              type="text"
              name="full_name"
              value={formData.full_name || ""}
              onChange={handleChange}
              placeholder="e.g. Alex Johnson"
              className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.full_name
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
              required
            />
          </div>
          {errors.full_name && (
            <p className="text-xs text-red-500 mt-1">{errors.full_name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1"
          >
            Email Address *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="e.g. alex.johnson@example.com"
              className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
              required
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="phone"
            className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1"
          >
            Phone Number
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              placeholder="e.g. +1 (555) 234-5678"
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="summary"
            className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1"
          >
            Professional Summary
          </label>
          <div className="relative">
            <textarea
              id="summary"
              name="summary"
              rows={4}
              value={formData.summary || ""}
              onChange={handleChange}
              placeholder="Write a concise overview of your professional background, core accomplishments, and key strengths..."
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Tip: Keep it 2-4 sentences highlighting your strongest domain
            expertise.
          </p>
        </div>
      </div>
    </div>
  );
}
