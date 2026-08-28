import React from "react";
import {
  Briefcase,
  Plus,
  Trash2,
  Calendar,
  Building,
  Award,
} from "lucide-react";

export default function ExperienceForm({
  experiences = [],
  setExperiences,
  errors = {},
}) {
  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      company_name: "",
      role: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: "",
    };
    setExperiences([...experiences, newExp]);
  };

  const removeExperience = (index) => {
    const updated = experiences.filter((_, idx) => idx !== index);
    setExperiences(updated);
  };

  const updateExperienceField = (index, field, value) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };

    // If marked current, clear end date
    if (field === "is_current" && value === true) {
      updated[index].end_date = null;
    }

    setExperiences(updated);
  };

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
        <div className="flex items-center space-x-2">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <div>
            <h2 className="text-lg font-bold text-gray-900">Work Experience</h2>
            <p className="text-xs text-gray-500">
              Add past and current roles with key accomplishments
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={addExperience}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Position</span>
        </button>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
          <Briefcase className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-600">
            No work experience entries added yet.
          </p>
          <p className="text-xs text-gray-400 mb-4">
            Click below to add your first job role.
          </p>
          <button
            type="button"
            onClick={addExperience}
            className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Add Experience Entry
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {experiences.map((exp, index) => {
            const expError = errors[`experience_${index}`] || "";
            const isInvalidDateRange =
              exp.start_date &&
              exp.end_date &&
              !exp.is_current &&
              exp.end_date < exp.start_date;

            return (
              <div
                key={exp.id || index}
                className="p-5 border border-gray-200 rounded-xl bg-[#fafcff] relative hover:border-blue-300 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-100 text-blue-800">
                    Position #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    aria-label={`Remove position ${index + 1}`}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Company Name *
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={exp.company_name || ""}
                        onChange={(e) =>
                          updateExperienceField(
                            index,
                            "company_name",
                            e.target.value,
                          )
                        }
                        placeholder="e.g. Acme Corporation"
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Job Title / Role *
                    </label>
                    <div className="relative">
                      <Award className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={exp.role || ""}
                        onChange={(e) =>
                          updateExperienceField(index, "role", e.target.value)
                        }
                        placeholder="e.g. Senior Software Engineer"
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
                          exp.start_date ? exp.start_date.substring(0, 10) : ""
                        }
                        onChange={(e) =>
                          updateExperienceField(
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
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        End Date {exp.is_current ? "(Present)" : "*"}
                      </label>
                      <label className="flex items-center space-x-1.5 cursor-pointer text-xs text-blue-600 font-medium">
                        <input
                          type="checkbox"
                          checked={exp.is_current || false}
                          onChange={(e) =>
                            updateExperienceField(
                              index,
                              "is_current",
                              e.target.checked,
                            )
                          }
                          className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                        />
                        <span>Current Role</span>
                      </label>
                    </div>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="date"
                        disabled={exp.is_current}
                        value={
                          !exp.is_current && exp.end_date
                            ? exp.end_date.substring(0, 10)
                            : ""
                        }
                        onChange={(e) =>
                          updateExperienceField(
                            index,
                            "end_date",
                            e.target.value,
                          )
                        }
                        className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                          exp.is_current
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : isInvalidDateRange
                              ? "border-red-500 bg-red-50"
                              : "border-gray-300 bg-white"
                        }`}
                      />
                    </div>
                    {isInvalidDateRange && (
                      <p className="text-xs text-red-500 mt-1">
                        End date must not be prior to start date.
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Description &amp; Key Responsibilities
                    </label>
                    <textarea
                      rows={3}
                      value={exp.description || ""}
                      onChange={(e) =>
                        updateExperienceField(
                          index,
                          "description",
                          e.target.value,
                        )
                      }
                      placeholder="• Led architecture of microservices with 99.99% uptime&#10;• Mentored junior engineers and conducted code reviews"
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-sans"
                    />
                  </div>
                </div>

                {expError && (
                  <p className="text-xs text-red-500 mt-2">{expError}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
