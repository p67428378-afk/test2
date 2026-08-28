import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Save,
  ArrowRight,
  ArrowLeft,
  Download,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FileCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import Stepper from "../components/common/Stepper";
import ProfileForm from "../components/resume/ProfileForm";
import ExperienceForm from "../components/resume/ExperienceForm";
import EducationSkillsForm from "../components/resume/EducationSkillsForm";
import LiveResumePreview from "../components/resume/LiveResumePreview";
import { getResumeById, createResume, updateResume } from "../services/api";

export default function ResumeEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [currentStep, setCurrentStep] = useState(1);
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [savedResumeId, setSavedResumeId] = useState(id || null);

  const [formData, setFormData] = useState({
    title: "",
    full_name: "",
    email: "",
    phone: "",
    summary: "",
  });

  const [experiences, setExperiences] = useState([
    {
      id: "init-1",
      company_name: "Acme Corp",
      role: "Software Engineer",
      start_date: "2021-01-01",
      end_date: "2023-12-31",
      is_current: false,
      description:
        "• Developed scalable microservices using Python and FastAPI\n• Built modern user interfaces with React and Tailwind CSS",
    },
  ]);

  const [education, setEducation] = useState([
    {
      id: "init-edu-1",
      institution: "State University",
      degree: "B.S. in Computer Science",
      start_date: "2016-09-01",
      end_date: "2020-05-30",
    },
  ]);

  const [skills, setSkills] = useState([
    "React",
    "FastAPI",
    "Python",
    "JavaScript",
    "SQL",
    "Tailwind CSS",
  ]);

  useEffect(() => {
    if (id) {
      loadResume(id);
    }
  }, [id]);

  const loadResume = async (resumeId) => {
    setIsLoading(true);
    try {
      const data = await getResumeById(resumeId);
      setFormData({
        title: data.title || "",
        full_name: data.full_name || "",
        email: data.email || "",
        phone: data.phone || "",
        summary: data.summary || "",
      });
      if (Array.isArray(data.experiences)) {
        setExperiences(
          data.experiences.map((exp) => ({
            ...exp,
            id: exp.id || Math.random().toString(),
          })),
        );
      }
      if (Array.isArray(data.education)) {
        setEducation(
          data.education.map((edu) => ({
            ...edu,
            id: edu.id || Math.random().toString(),
          })),
        );
      }
      if (Array.isArray(data.skills)) {
        setSkills(data.skills);
      }
      setSavedResumeId(data.id);
    } catch (err) {
      console.error("Failed to load resume:", err);
      setNotification({
        type: "error",
        message: err.response?.data?.detail || "Could not load resume profile.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfileData = (fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
    // Clear field-level error
    const fieldName = Object.keys(fields)[0];
    if (errors[fieldName]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  const validate = () => {
    const errs = {};

    if (!formData.title?.trim()) {
      errs.title = "Resume title is required";
    }
    if (!formData.full_name?.trim()) {
      errs.full_name = "Full name is required";
    }
    if (!formData.email?.trim()) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Invalid email format";
    }

    // Validate experience date ranges
    experiences.forEach((exp, idx) => {
      if (!exp.company_name?.trim()) {
        errs[`experience_${idx}`] =
          `Position #${idx + 1}: Company name is required`;
      }
      if (!exp.role?.trim()) {
        errs[`experience_${idx}`] =
          `Position #${idx + 1}: Role title is required`;
      }
      if (!exp.start_date) {
        errs[`experience_${idx}`] =
          `Position #${idx + 1}: Start date is required`;
      }
      if (
        exp.start_date &&
        exp.end_date &&
        !exp.is_current &&
        exp.end_date < exp.start_date
      ) {
        errs[`experience_${idx}`] =
          `Position #${idx + 1}: End date must not precede start date`;
      }
    });

    // Validate education entries
    education.forEach((edu, idx) => {
      if (!edu.institution?.trim()) {
        errs[`education_${idx}`] =
          `Degree #${idx + 1}: Institution is required`;
      }
      if (!edu.degree?.trim()) {
        errs[`education_${idx}`] = `Degree #${idx + 1}: Degree is required`;
      }
      if (!edu.start_date) {
        errs[`education_${idx}`] = `Degree #${idx + 1}: Start date is required`;
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (autoNavigateToExport = false) => {
    if (!validate()) {
      setNotification({
        type: "error",
        message: "Please correct the highlighted errors before saving.",
      });
      return null;
    }

    setIsSaving(true);
    setNotification(null);

    // Format payload matching schema
    const payload = {
      title: formData.title.trim(),
      full_name: formData.full_name.trim(),
      email: formData.email.trim(),
      phone: formData.phone?.trim() || null,
      summary: formData.summary?.trim() || null,
      experiences: experiences.map((exp) => ({
        company_name: exp.company_name.trim(),
        role: exp.role.trim(),
        start_date: exp.start_date ? exp.start_date.substring(0, 10) : "",
        end_date:
          !exp.is_current && exp.end_date
            ? exp.end_date.substring(0, 10)
            : null,
        is_current: Boolean(exp.is_current),
        description: exp.description?.trim() || null,
      })),
      education: education.map((edu) => ({
        institution: edu.institution.trim(),
        degree: edu.degree.trim(),
        start_date: edu.start_date ? edu.start_date.substring(0, 10) : "",
        end_date: edu.end_date ? edu.end_date.substring(0, 10) : null,
      })),
      skills: skills
        .map((s) => (typeof s === "string" ? s.trim() : s?.skill_name?.trim()))
        .filter(Boolean),
    };

    try {
      let result;
      if (savedResumeId) {
        result = await updateResume(savedResumeId, payload);
      } else {
        result = await createResume(payload);
      }

      setSavedResumeId(result.id);
      setNotification({
        type: "success",
        message: "Resume saved successfully!",
      });

      if (autoNavigateToExport && result.id) {
        navigate(`/export/${result.id}`);
      }

      return result;
    } catch (err) {
      console.error("Save failed:", err);
      const detail = err.response?.data?.detail;
      const errorMsg =
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
            ? detail
                .map((d) => d.msg || d.message || JSON.stringify(d))
                .join(", ")
            : err.message ||
              "Failed to save resume. Ensure backend is running.";

      setNotification({
        type: "error",
        message: errorMsg,
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const currentResumeData = {
    ...formData,
    experiences,
    education,
    skills,
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
        <p className="text-gray-600 font-medium">Loading resume builder...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <Link
            to="/"
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {isEditMode ? "Edit Resume" : "Create New Resume"}
            </h1>
            <p className="text-xs text-gray-500">
              {formData.title || "Untitled Resume Draft"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="hidden lg:flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-2xs"
          >
            {showLivePreview ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            <span>{showLivePreview ? "Hide Preview" : "Show Preview"}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 font-semibold text-sm rounded-lg shadow-2xs transition-all disabled:opacity-60"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="flex items-center space-x-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-all disabled:opacity-60"
          >
            <Download className="w-4 h-4" />
            <span>Proceed to Export</span>
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center justify-between border shadow-sm ${
            notification.type === "success"
              ? "bg-green-50 text-green-800 border-green-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <div className="flex items-center space-x-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-gray-400 hover:text-gray-600 text-sm font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Stepper */}
      <Stepper currentStep={currentStep} setStep={setCurrentStep} />

      {/* Main Grid: Left form / Right preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div
          className={
            showLivePreview
              ? "lg:col-span-6 space-y-6"
              : "lg:col-span-12 space-y-6"
          }
        >
          {currentStep === 1 && (
            <ProfileForm
              formData={formData}
              updateFormData={updateProfileData}
              errors={errors}
            />
          )}

          {currentStep === 2 && (
            <ExperienceForm
              experiences={experiences}
              setExperiences={setExperiences}
              errors={errors}
            />
          )}

          {currentStep === 3 && (
            <EducationSkillsForm
              education={education}
              setEducation={setEducation}
              skills={skills}
              setSkills={setSkills}
              errors={errors}
            />
          )}

          {currentStep === 4 && (
            <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm space-y-6">
              <div className="flex items-center space-x-2 border-b border-gray-100 pb-4">
                <FileCheck className="w-5 h-5 text-green-600" />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Review &amp; Finalize
                  </h2>
                  <p className="text-xs text-gray-500">
                    Verify your resume information and export to PDF.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-xs text-gray-500 font-medium">
                    Full Name
                  </span>
                  <p className="text-sm font-bold text-gray-900">
                    {formData.full_name || "—"}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-xs text-gray-500 font-medium">
                    Work History
                  </span>
                  <p className="text-sm font-bold text-gray-900">
                    {experiences.length} positions
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-xs text-gray-500 font-medium">
                    Skills
                  </span>
                  <p className="text-sm font-bold text-gray-900">
                    {skills.length} skills
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-sm">
                <p className="font-semibold mb-1">Ready to create your PDF?</p>
                <p className="text-xs text-blue-700">
                  Click "Proceed to Export" to save your profile to the backend
                  and generate a downloadable PDF CV file.
                </p>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center space-x-1.5 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center space-x-1.5 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSave(true)}
                disabled={isSaving}
                className="flex items-center space-x-2 px-6 py-2.5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm disabled:opacity-60"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>Save &amp; Export PDF</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Preview Column */}
        {showLivePreview && (
          <div className="lg:col-span-6 sticky top-24">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Live Document Preview
              </span>
              <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Real-Time Sync
              </span>
            </div>

            <LiveResumePreview resumeData={currentResumeData} />
          </div>
        )}
      </div>
    </div>
  );
}
