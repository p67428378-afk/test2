import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Globe,
  Briefcase,
  GraduationCap,
  Wrench,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  CheckCircle2,
  ListPlus,
  RotateCcw,
} from "lucide-react";

export const SAMPLE_RESUME_DATA = {
  user_name: "Jane Doe",
  email: "jane.doe@example.com",
  phone: "+1 (555) 234-5678",
  portfolio_url: "https://linkedin.com/in/janedoe",
  template_id: "classic",
  experiences: [
    {
      company: "Tech Corp Solutions",
      role: "Senior Software Engineer",
      start_date: "Jan 2022",
      end_date: "Present",
      bullet_points: [
        "Architected scalable microservices handling 10M+ daily API requests with 99.99% uptime.",
        "Engineered real-time collaboration tools in React and WebSocket, boosting user engagement by 35%.",
        "Mentored a team of 6 junior and mid-level software engineers across frontend and backend best practices.",
      ],
    },
    {
      company: "Innovate Labs",
      role: "Full Stack Developer",
      start_date: "Jun 2019",
      end_date: "Dec 2021",
      bullet_points: [
        "Developed customer-facing dashboard using React 18, Vite, and Tailwind CSS.",
        "Integrated secure payment processing pipeline via Stripe API with automated reconciliation.",
      ],
    },
  ],
  education: [
    {
      institution: "Stanford University",
      degree: "B.S. in Computer Science",
      completion_year: "2019",
    },
  ],
  skills: [
    "JavaScript",
    "React",
    "Python",
    "FastAPI",
    "Tailwind CSS",
    "PostgreSQL",
    "Docker",
    "Git",
    "REST APIs",
  ],
};

export default function ResumeForm({
  resumeData,
  onChange,
  templates = [],
  onLoadSample,
  onReset,
}) {
  const [activeTab, setActiveTab] = useState("contact");
  const [newSkill, setNewSkill] = useState("");

  const handleFieldChange = (field, value) => {
    onChange({ ...resumeData, [field]: value });
  };

  // Experience handlers
  const handleAddExperience = () => {
    const updated = [
      ...resumeData.experiences,
      {
        company: "",
        role: "",
        start_date: "",
        end_date: "Present",
        bullet_points: [""],
      },
    ];
    handleFieldChange("experiences", updated);
  };

  const handleUpdateExperience = (index, field, value) => {
    const updated = [...resumeData.experiences];
    updated[index] = { ...updated[index], [field]: value };
    handleFieldChange("experiences", updated);
  };

  const handleRemoveExperience = (index) => {
    const updated = resumeData.experiences.filter((_, i) => i !== index);
    handleFieldChange("experiences", updated);
  };

  const handleAddBulletPoint = (expIndex) => {
    const updated = [...resumeData.experiences];
    updated[expIndex].bullet_points = [...updated[expIndex].bullet_points, ""];
    handleFieldChange("experiences", updated);
  };

  const handleUpdateBulletPoint = (expIndex, bulletIndex, value) => {
    const updated = [...resumeData.experiences];
    const updatedBullets = [...updated[expIndex].bullet_points];
    updatedBullets[bulletIndex] = value;
    updated[expIndex].bullet_points = updatedBullets;
    handleFieldChange("experiences", updated);
  };

  const handleRemoveBulletPoint = (expIndex, bulletIndex) => {
    const updated = [...resumeData.experiences];
    updated[expIndex].bullet_points = updated[expIndex].bullet_points.filter(
      (_, i) => i !== bulletIndex,
    );
    handleFieldChange("experiences", updated);
  };

  // Education handlers
  const handleAddEducation = () => {
    const updated = [
      ...resumeData.education,
      {
        institution: "",
        degree: "",
        completion_year: "",
      },
    ];
    handleFieldChange("education", updated);
  };

  const handleUpdateEducation = (index, field, value) => {
    const updated = [...resumeData.education];
    updated[index] = { ...updated[index], [field]: value };
    handleFieldChange("education", updated);
  };

  const handleRemoveEducation = (index) => {
    const updated = resumeData.education.filter((_, i) => i !== index);
    handleFieldChange("education", updated);
  };

  // Skills handlers
  const handleAddSkill = (e) => {
    if (e) e.preventDefault();
    const trimmed = newSkill.trim();
    if (trimmed && !resumeData.skills.includes(trimmed)) {
      handleFieldChange("skills", [...resumeData.skills, trimmed]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    handleFieldChange(
      "skills",
      resumeData.skills.filter((s) => s !== skillToRemove),
    );
  };

  const suggestedSkills = [
    "React",
    "Node.js",
    "Python",
    "FastAPI",
    "TypeScript",
    "SQL",
    "Tailwind CSS",
    "Docker",
    "AWS",
    "GraphQL",
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header with Quick Actions */}
      <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Resume Editor
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fill in your experience and watch your CV update in real time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLoadSample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Load Sample
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white overflow-x-auto text-sm font-medium">
        <button
          type="button"
          onClick={() => setActiveTab("contact")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === "contact"
              ? "border-indigo-600 text-indigo-600 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <User className="w-4 h-4" />
          Contact Info
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("experience")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === "experience"
              ? "border-indigo-600 text-indigo-600 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Experience ({resumeData.experiences?.length || 0})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("education")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === "education"
              ? "border-indigo-600 text-indigo-600 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Education ({resumeData.education?.length || 0})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("skills")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === "skills"
              ? "border-indigo-600 text-indigo-600 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Wrench className="w-4 h-4" />
          Skills ({resumeData.skills?.length || 0})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("template")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === "template"
              ? "border-indigo-600 text-indigo-600 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers className="w-4 h-4" />
          Template
        </button>
      </div>

      {/* Form Content */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Contact Tab */}
        {activeTab === "contact" && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Personal & Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="user_name"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="user_name"
                    type="text"
                    required
                    value={resumeData.user_name}
                    onChange={(e) =>
                      handleFieldChange("user_name", e.target.value)
                    }
                    placeholder="e.g. Jane Doe"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={resumeData.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    placeholder="e.g. jane.doe@example.com"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    value={resumeData.phone || ""}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                    placeholder="e.g. +1 (555) 234-5678"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="portfolio_url"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Portfolio / LinkedIn URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <input
                    id="portfolio_url"
                    type="url"
                    value={resumeData.portfolio_url || ""}
                    onChange={(e) =>
                      handleFieldChange("portfolio_url", e.target.value)
                    }
                    placeholder="e.g. https://linkedin.com/in/janedoe"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === "experience" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Work Experience
              </h3>
              <button
                type="button"
                onClick={handleAddExperience}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Position
              </button>
            </div>

            {resumeData.experiences?.length === 0 ? (
              <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 rounded-lg">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">
                  No work experience added yet
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Click "Add Position" above to add your job history.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {resumeData.experiences.map((exp, expIdx) => (
                  <div
                    key={expIdx}
                    className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-4 relative"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs font-bold text-slate-700 uppercase">
                        Position #{expIdx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExperience(expIdx)}
                        className="text-red-500 hover:text-red-700 p-1 text-xs inline-flex items-center gap-1 rounded transition"
                        title="Remove Position"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Job Title / Role{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={exp.role}
                          onChange={(e) =>
                            handleUpdateExperience(
                              expIdx,
                              "role",
                              e.target.value,
                            )
                          }
                          placeholder="e.g. Senior Software Engineer"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Company / Organization{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={exp.company}
                          onChange={(e) =>
                            handleUpdateExperience(
                              expIdx,
                              "company",
                              e.target.value,
                            )
                          }
                          placeholder="e.g. Tech Corp"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Start Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={exp.start_date}
                          onChange={(e) =>
                            handleUpdateExperience(
                              expIdx,
                              "start_date",
                              e.target.value,
                            )
                          }
                          placeholder="e.g. Jan 2022"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          End Date <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={exp.end_date}
                            onChange={(e) =>
                              handleUpdateExperience(
                                expIdx,
                                "end_date",
                                e.target.value,
                              )
                            }
                            placeholder="e.g. Present or Dec 2023"
                            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateExperience(
                                expIdx,
                                "end_date",
                                "Present",
                              )
                            }
                            className="px-2.5 py-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg"
                          >
                            Present
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bullet Points */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-700">
                          Responsibilities & Achievements
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAddBulletPoint(expIdx)}
                          className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          <Plus className="w-3 h-3" />
                          Add Bullet
                        </button>
                      </div>

                      {exp.bullet_points?.map((bullet, bulletIdx) => (
                        <div key={bulletIdx} className="flex items-start gap-2">
                          <span className="text-slate-400 mt-2 text-xs">•</span>
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={(e) =>
                              handleUpdateBulletPoint(
                                expIdx,
                                bulletIdx,
                                e.target.value,
                              )
                            }
                            placeholder="Describe your achievement or responsibility..."
                            className="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveBulletPoint(expIdx, bulletIdx)
                            }
                            className="text-slate-400 hover:text-red-500 p-1 mt-1 transition"
                            title="Delete Bullet"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Education Tab */}
        {activeTab === "education" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Education
              </h3>
              <button
                type="button"
                onClick={handleAddEducation}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Education
              </button>
            </div>

            {resumeData.education?.length === 0 ? (
              <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 rounded-lg">
                <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">
                  No education entries added
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Click "Add Education" to include your academic background.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {resumeData.education.map((edu, eduIdx) => (
                  <div
                    key={eduIdx}
                    className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs font-bold text-slate-700 uppercase">
                        Degree #{eduIdx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEducation(eduIdx)}
                        className="text-red-500 hover:text-red-700 p-1 text-xs inline-flex items-center gap-1 rounded transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Institution <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={edu.institution}
                          onChange={(e) =>
                            handleUpdateEducation(
                              eduIdx,
                              "institution",
                              e.target.value,
                            )
                          }
                          placeholder="e.g. Stanford University"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Degree / Field <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={edu.degree}
                          onChange={(e) =>
                            handleUpdateEducation(
                              eduIdx,
                              "degree",
                              e.target.value,
                            )
                          }
                          placeholder="e.g. B.S. in Computer Science"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Graduation Year{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={edu.completion_year}
                          onChange={(e) =>
                            handleUpdateEducation(
                              eduIdx,
                              "completion_year",
                              e.target.value,
                            )
                          }
                          placeholder="e.g. 2021"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === "skills" && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Key Skills & Technologies
            </h3>

            {/* Add Skill Input */}
            <form onSubmit={handleAddSkill} className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Type a skill (e.g. TypeScript, React) and press Enter"
                className="flex-1 px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </form>

            {/* Selected Skills Chips */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Selected Skills ({resumeData.skills?.length || 0})
              </label>
              <div className="flex flex-wrap gap-2 min-h-[48px] p-3 bg-slate-50 border border-slate-200 rounded-lg">
                {resumeData.skills?.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">
                    No skills added yet. Type above or click suggestions below.
                  </span>
                ) : (
                  resumeData.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-semibold shadow-xs"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-indigo-400 hover:text-indigo-700 p-0.5 rounded-full"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Quick Suggestions */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Suggested Skills
              </label>
              <div className="flex flex-wrap gap-1.5">
                {suggestedSkills.map((suggestion) => {
                  const alreadySelected =
                    resumeData.skills.includes(suggestion);
                  return (
                    <button
                      key={suggestion}
                      type="button"
                      disabled={alreadySelected}
                      onClick={() => {
                        if (!alreadySelected) {
                          handleFieldChange("skills", [
                            ...resumeData.skills,
                            suggestion,
                          ]);
                        }
                      }}
                      className={`text-xs px-2.5 py-1 rounded-md border transition ${
                        alreadySelected
                          ? "bg-slate-100 text-slate-400 border-slate-200 cursor-default"
                          : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400 hover:text-indigo-600"
                      }`}
                    >
                      + {suggestion}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Template Tab */}
        {activeTab === "template" && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Select Resume Template
            </h3>
            <p className="text-xs text-slate-600">
              Choose the layout and aesthetic style for your resume. The live
              preview updates instantly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Classic Template Card */}
              <div
                onClick={() => handleFieldChange("template_id", "classic")}
                className={`cursor-pointer rounded-xl p-4 border-2 transition relative ${
                  resumeData.template_id === "classic"
                    ? "border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-sm font-bold text-slate-900">
                      Classic Template
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      Traditional, serif-accented layout with clean horizontal
                      rules and centered header. Ideal for academic, corporate,
                      and law roles.
                    </p>
                  </div>
                  {resumeData.template_id === "classic" && (
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 ml-2" />
                  )}
                </div>
                <div className="mt-3 p-2 bg-white rounded border border-slate-200 font-serif text-[9px] text-slate-700 leading-tight">
                  <div className="text-center font-bold border-b pb-1">
                    JOHN DOE
                  </div>
                  <div className="text-center text-[7px] text-slate-500 mb-1">
                    john@example.com | (555) 000-0000
                  </div>
                  <div className="font-bold uppercase text-[7px] border-b mb-0.5">
                    Experience
                  </div>
                  <div>• Senior Engineer - ABC Corp</div>
                </div>
              </div>

              {/* Modern Template Card */}
              <div
                onClick={() => handleFieldChange("template_id", "modern")}
                className={`cursor-pointer rounded-xl p-4 border-2 transition relative ${
                  resumeData.template_id === "modern"
                    ? "border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-sm font-bold text-slate-900">
                      Modern Template
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      Contemporary layout with indigo accent headings, sleek
                      timeline markers, and pill badge skills. Ideal for tech,
                      creative, and startups.
                    </p>
                  </div>
                  {resumeData.template_id === "modern" && (
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 ml-2" />
                  )}
                </div>
                <div className="mt-3 p-2 bg-white rounded border border-slate-200 font-sans text-[9px] text-slate-700 leading-tight">
                  <div className="bg-indigo-600 text-white p-1 rounded-sm text-center font-bold">
                    JANE DOE
                  </div>
                  <div className="text-center text-[7px] text-slate-500 my-0.5">
                    jane@example.com • Portfolio
                  </div>
                  <div className="font-bold text-indigo-700 text-[7px] border-b border-indigo-200 mt-1">
                    EXPERIENCE
                  </div>
                  <div>• Tech Lead - XYZ Labs</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
