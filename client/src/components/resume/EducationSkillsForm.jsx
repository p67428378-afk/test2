import React, { useState } from "react";
import {
  GraduationCap,
  Plus,
  Trash2,
  Calendar,
  School,
  Wrench,
  X,
  Tag,
} from "lucide-react";

export default function EducationSkillsForm({
  education = [],
  setEducation,
  skills = [],
  setSkills,
  errors = {},
}) {
  const [skillInput, setSkillInput] = useState("");

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      start_date: "",
      end_date: "",
    };
    setEducation([...education, newEdu]);
  };

  const removeEducation = (index) => {
    setEducation(education.filter((_, idx) => idx !== index));
  };

  const updateEducationField = (index, field, value) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  const handleAddSkill = (e) => {
    e?.preventDefault();
    const trimmed = skillInput.trim();
    if (!trimmed) return;

    // Check if skill already exists
    const exists = skills.some(
      (s) =>
        (typeof s === "string"
          ? s.toLowerCase()
          : s?.skill_name?.toLowerCase()) === trimmed.toLowerCase(),
    );

    if (!exists) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (indexToRemove) => {
    setSkills(skills.filter((_, idx) => idx !== indexToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const suggestedSkills = [
    "JavaScript",
    "React",
    "TypeScript",
    "Python",
    "FastAPI",
    "SQL",
    "Tailwind CSS",
    "Docker",
    "Git",
    "REST APIs",
  ];

  return (
    <div className="space-y-6">
      {/* Education Section */}
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Education &amp; Degrees
              </h2>
              <p className="text-xs text-gray-500">
                Academic background, universities, and certificates
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={addEducation}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Education</span>
          </button>
        </div>

        {education.length === 0 ? (
          <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
            <GraduationCap className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">
              No education entries added yet.
            </p>
            <button
              type="button"
              onClick={addEducation}
              className="mt-3 px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Add Degree / Institution
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div
                key={edu.id || index}
                className="p-4 border border-gray-200 rounded-xl bg-[#fafcff] relative hover:border-blue-300 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Degree #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    aria-label={`Remove degree ${index + 1}`}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Institution / School *
                    </label>
                    <div className="relative">
                      <School className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={edu.institution || ""}
                        onChange={(e) =>
                          updateEducationField(
                            index,
                            "institution",
                            e.target.value,
                          )
                        }
                        placeholder="e.g. Stanford University"
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Degree / Major *
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={edu.degree || ""}
                        onChange={(e) =>
                          updateEducationField(index, "degree", e.target.value)
                        }
                        placeholder="e.g. B.S. in Computer Science"
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Start Date *
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="date"
                        value={
                          edu.start_date ? edu.start_date.substring(0, 10) : ""
                        }
                        onChange={(e) =>
                          updateEducationField(
                            index,
                            "start_date",
                            e.target.value,
                          )
                        }
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      End Date (or Expected)
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="date"
                        value={
                          edu.end_date ? edu.end_date.substring(0, 10) : ""
                        }
                        onChange={(e) =>
                          updateEducationField(
                            index,
                            "end_date",
                            e.target.value,
                          )
                        }
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm">
        <div className="flex items-center space-x-2 border-b border-gray-100 pb-4 mb-4">
          <Wrench className="w-5 h-5 text-blue-600" />
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Key Skills &amp; Competencies
            </h2>
            <p className="text-xs text-gray-500">
              Add technical skills, tools, and domain proficiencies
            </p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a skill (e.g. React, Python) and press Enter"
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              Add
            </button>
          </div>
        </div>

        {/* Selected skills */}
        <div className="min-h-12 p-3 border border-gray-200 rounded-lg bg-gray-50 flex flex-wrap gap-2 items-center">
          {skills.length === 0 ? (
            <span className="text-xs text-gray-400 italic">
              No skills added yet.
            </span>
          ) : (
            skills.map((skill, idx) => {
              const skillName =
                typeof skill === "string" ? skill : skill?.skill_name || "";
              return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 shadow-2xs"
                >
                  {skillName}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(idx)}
                    aria-label={`Remove skill ${skillName}`}
                    className="hover:text-red-600 focus:outline-none"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              );
            })
          )}
        </div>

        {/* Quick suggestions */}
        <div className="mt-3">
          <p className="text-xs font-medium text-gray-500 mb-1.5">
            Quick add suggestions:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {suggestedSkills.map((s) => {
              const alreadyAdded = skills.some(
                (item) =>
                  (typeof item === "string" ? item : item?.skill_name) === s,
              );
              if (alreadyAdded) return null;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSkills([...skills, s])}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-md transition-colors border border-gray-200"
                >
                  + {s}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
