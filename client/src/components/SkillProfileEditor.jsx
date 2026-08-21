import React, { useState } from "react";
import {
  Plus,
  Trash2,
  GraduationCap,
  BookOpen,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function SkillProfileEditor({
  profile,
  onSkillAdded,
  onSkillRemoved,
}) {
  const [skillName, setSkillName] = useState("");
  const [type, setType] = useState("TEACH");
  const [proficiency, setProficiency] = useState("INTERMEDIATE");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skillName.trim()) {
      setError("Skill name cannot be empty");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await onSkillAdded({
        skill_name: skillName.trim(),
        type,
        proficiency,
        category: category.trim() || undefined,
        description: description.trim() || undefined,
      });

      setSkillName("");
      setCategory("");
      setDescription("");
      setSuccessMsg(
        `Successfully added "${skillName}" to ${type === "TEACH" ? "Teach" : "Learn"} list!`,
      );
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Failed to add skill",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (skillId, name) => {
    setError(null);
    try {
      await onSkillRemoved(skillId);
      setSuccessMsg(`Removed "${name}" from profile.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Failed to remove skill",
      );
    }
  };

  const teachSkills = profile?.teach_skills || [];
  const learnSkills = profile?.learn_skills || [];

  return (
    <div className="space-y-8">
      {/* Add Skill Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-600" />
          Add New Skill
        </h2>
        <p className="text-xs text-slate-500 mb-5">
          Specify a skill you can teach to others or a skill you want to learn.
        </p>

        {error && (
          <div
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Skill Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="TEACH">Skill I Can Teach (Offer)</option>
                <option value="LEARN">Skill I Want to Learn (Desired)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Skill Name *
              </label>
              <input
                type="text"
                placeholder="e.g. React, Python, Spanish, Guitar"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Proficiency Level
              </label>
              <select
                value={proficiency}
                onChange={(e) => setProficiency(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Programming, Languages, Music"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Short Description (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 5+ years of production experience"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? "Adding..." : "Add Skill"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Skills Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teach Skills List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              <span>Skills I Can Teach ({teachSkills.length})</span>
            </h3>
          </div>

          {teachSkills.length === 0 ? (
            <p className="text-sm text-slate-500 italic text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No skills added to teach list yet.
            </p>
          ) : (
            <div className="space-y-3">
              {teachSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3 hover:border-emerald-200 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm">
                        {skill.skill_name}
                      </span>
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-emerald-100 text-emerald-800">
                        {skill.proficiency}
                      </span>
                      {skill.category && (
                        <span className="px-2 py-0.5 text-xs text-slate-600 bg-slate-200 rounded-md">
                          {skill.category}
                        </span>
                      )}
                    </div>
                    {skill.description && (
                      <p className="text-xs text-slate-600 mt-1">
                        {skill.description}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleRemove(skill.id, skill.skill_name)}
                    className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    title="Remove Skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Learn Skills List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Skills I Want to Learn ({learnSkills.length})</span>
            </h3>
          </div>

          {learnSkills.length === 0 ? (
            <p className="text-sm text-slate-500 italic text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No skills added to learn list yet.
            </p>
          ) : (
            <div className="space-y-3">
              {learnSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3 hover:border-blue-200 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm">
                        {skill.skill_name}
                      </span>
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-100 text-blue-800">
                        {skill.proficiency}
                      </span>
                      {skill.category && (
                        <span className="px-2 py-0.5 text-xs text-slate-600 bg-slate-200 rounded-md">
                          {skill.category}
                        </span>
                      )}
                    </div>
                    {skill.description && (
                      <p className="text-xs text-slate-600 mt-1">
                        {skill.description}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleRemove(skill.id, skill.skill_name)}
                    className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    title="Remove Skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
