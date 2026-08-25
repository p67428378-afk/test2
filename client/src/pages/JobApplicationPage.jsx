import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { jobsService, applicationsService } from "../services/api";
import {
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function JobApplicationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setLoadingSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeName, setResumeName] = useState("");

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const data = await jobsService.getJob(id);
        setJob(data);
      } catch (err) {
        setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Only PDF files are allowed.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds the 5MB limit.");
        return;
      }
      setResumeFile(file);
      setResumeName(file.name);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!resumeFile) {
      setError("Please upload your resume (PDF format).");
      return;
    }

    setLoadingSubmitting(true);
    try {
      await applicationsService.applyForJob(id, coverLetter, resumeFile);
      setSuccess("Your application has been submitted successfully!");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to submit application. Please try again.",
      );
    } finally {
      setLoadingSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2663eb]"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-[14px] border border-[#e3e8f0] text-center shadow-sm">
        <AlertCircle className="w-12 h-12 text-[#db2626] mx-auto mb-4" />
        <h3 className="text-lg font-bold text-[#171c29] mb-2">
          Job Posting Not Found
        </h3>
        <p className="text-[#707a8c] mb-4">
          The job posting you are trying to apply for does not exist or has been
          removed.
        </p>
        <Link
          to="/"
          className="text-[#2663eb] hover:underline flex items-center justify-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Job Board
        </Link>
      </div>
    );
  }

  return (
    <div
      className="bg-[#f7fafc] content-stretch flex flex-col gap-[24px] items-start p-[32px] relative size-full"
      data-node-id="2:69"
      data-name="Job Application Page"
    >
      <div
        className="content-stretch flex items-start overflow-clip relative shrink-0 w-full"
        data-node-id="2:81"
        data-name="Box"
      >
        <p className="[word-break:break-word] font-normal leading-[normal] not-italic relative shrink-0 text-[#707a8c] text-[12px] whitespace-pre">
          Find Jobs › {job.title} › Apply
        </p>
      </div>

      {success && (
        <div className="bg-green-50 border-l-4 border-[#17a34a] p-4 rounded-md w-full flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-[#17a34a]" />
          <p className="text-sm text-[#17a34a] font-medium">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-[#db2626] p-4 rounded-md w-full flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-[#db2626]" />
          <p className="text-sm text-[#db2626] font-medium">{error}</p>
        </div>
      )}

      <div
        className="content-stretch flex flex-col lg:flex-row gap-[24px] items-start overflow-clip relative shrink-0 w-full"
        data-node-id="2:118"
        data-name="SplitLayout"
      >
        {/* Left Column: Job Details */}
        <div
          className="content-stretch flex flex-col lg:w-1/2 w-full items-start min-w-px overflow-clip relative self-stretch"
          data-node-id="2:119"
          data-name="MainColumn"
        >
          <div
            className="bg-white border border-[#e3e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[24px] relative rounded-[14px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] shrink-0 w-full"
            data-node-id="2:91"
            data-name="JobDetailsCard"
          >
            <p
              className="[word-break:break-word] font-bold leading-[normal] not-italic relative shrink-0 text-[#171c29] text-[18px] whitespace-nowrap"
              data-node-id="2:92"
            >
              Job Details
            </p>
            <p
              className="[word-break:break-word] font-bold leading-[normal] min-w-full not-italic relative shrink-0 text-[#171c29] text-[24px] w-[min-content]"
              data-node-id="2:83"
            >
              {job.title}
            </p>
            <p className="[word-break:break-word] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[#707a8c] text-[14px] w-[min-content] whitespace-pre-wrap">
              {job.location} • {job.job_type}
            </p>
            <p
              className="[word-break:break-word] font-bold leading-[normal] min-w-full not-italic relative shrink-0 text-[#2663eb] text-[16px] w-[min-content]"
              data-node-id="2:85"
            >
              {job.salary_range || "Salary not specified"}
            </p>
            <div
              className="bg-[#e3e8f0] h-px relative shrink-0 w-full"
              data-node-id="2:86"
              data-name="Divider"
            />
            <p
              className="[word-break:break-word] font-bold leading-[normal] min-w-full not-italic relative shrink-0 text-[#171c29] text-[16px] w-[min-content]"
              data-node-id="2:87"
            >
              About the Role
            </p>
            <p
              className="[word-break:break-word] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[#171c29] text-[14px] w-[min-content] whitespace-pre-wrap"
              data-node-id="2:88"
            >
              {job.description}
            </p>
            <p
              className="[word-break:break-word] font-bold leading-[normal] min-w-full not-italic relative shrink-0 text-[#171c29] text-[16px] w-[min-content]"
              data-node-id="2:89"
            >
              Requirements
            </p>
            <p
              className="[word-break:break-word] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[#171c29] text-[14px] w-[min-content] whitespace-pre-wrap"
              data-node-id="2:90"
            >
              {job.requirements}
            </p>
          </div>
        </div>

        {/* Right Column: Application Form */}
        <div
          className="content-stretch flex flex-col lg:w-1/2 w-full items-start min-w-px overflow-clip relative self-stretch"
          data-node-id="2:120"
          data-name="SideColumn"
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#e3e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[24px] relative rounded-[14px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] shrink-0 w-full"
            data-node-id="2:116"
            data-name="ApplicationFormCard"
          >
            <p
              className="[word-break:break-word] font-bold leading-[normal] not-italic relative shrink-0 text-[#171c29] text-[18px] whitespace-nowrap"
              data-node-id="2:117"
            >
              Submit Your Application
            </p>

            <div
              className="content-stretch flex flex-col gap-[4px] items-start overflow-clip relative shrink-0 w-full"
              data-node-id="2:93"
              data-name="Field"
            >
              <p
                className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[#707a8c] text-[12px] whitespace-nowrap"
                data-node-id="2:94"
              >
                Full Name
              </p>
              <div
                className="bg-[#f2f5fa] border border-[#e3e8f0] border-solid content-stretch flex items-start overflow-clip p-[12px] relative rounded-[10px] shrink-0 w-full"
                data-node-id="2:95"
                data-name="Input"
              >
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-transparent border-none outline-none text-[#171c29] text-[14px] w-full placeholder-[#707a8c]"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            <div
              className="content-stretch flex flex-col gap-[4px] items-start overflow-clip relative shrink-0 w-full"
              data-node-id="2:97"
              data-name="Field"
            >
              <p
                className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[#707a8c] text-[12px] whitespace-nowrap"
                data-node-id="2:98"
              >
                Email Address
              </p>
              <div
                className="bg-[#f2f5fa] border border-[#e3e8f0] border-solid content-stretch flex items-start overflow-clip p-[12px] relative rounded-[10px] shrink-0 w-full"
                data-node-id="2:99"
                data-name="Input"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-none outline-none text-[#171c29] text-[14px] w-full placeholder-[#707a8c]"
                  placeholder="jane.doe@example.com"
                />
              </div>
            </div>

            <div
              className="content-stretch flex flex-col gap-[4px] items-start overflow-clip relative shrink-0 w-full"
              data-node-id="2:101"
              data-name="Field"
            >
              <p
                className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[#707a8c] text-[12px] whitespace-nowrap"
                data-node-id="2:102"
              >
                Cover Letter
              </p>
              <div
                className="bg-[#f2f5fa] border border-[#e3e8f0] border-solid content-stretch flex items-start overflow-clip p-[12px] relative rounded-[10px] shrink-0 w-full"
                data-node-id="2:103"
                data-name="Input"
              >
                <textarea
                  required
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="bg-transparent border-none outline-none text-[#171c29] text-[14px] w-full placeholder-[#707a8c] resize-none"
                  placeholder="I am highly interested in this role because..."
                />
              </div>
            </div>

            <div
              className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic overflow-clip relative shrink-0 w-full whitespace-nowrap"
              data-node-id="2:105"
              data-name="ResumeUploadField"
            >
              <p
                className="font-medium relative shrink-0 text-[#707a8c] text-[12px]"
                data-node-id="2:106"
              >
                Upload Resume (PDF format, max 5MB)
              </p>
              <div
                className="bg-[#f2f5fa] border border-[#e3e8f0] border-dashed border-2 content-stretch flex flex-col gap-[8px] items-center justify-center overflow-clip p-[24px] relative rounded-[10px] shrink-0 w-full cursor-pointer hover:bg-blue-50 transition-colors"
                data-node-id="2:107"
                data-name="UploadArea"
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload"
                />
                <label
                  htmlFor="resume-upload"
                  className="flex flex-col items-center cursor-pointer w-full"
                >
                  <Upload className="h-8 w-8 text-[#2663eb] mb-2" />
                  <p
                    className="font-medium relative shrink-0 text-[#2663eb] text-[14px]"
                    data-node-id="2:109"
                  >
                    {resumeName
                      ? "Change Resume"
                      : "Click to upload or drag and drop"}
                  </p>
                  <p
                    className="font-normal relative shrink-0 text-[#707a8c] text-[12px]"
                    data-node-id="2:110"
                  >
                    {resumeName
                      ? `Selected: ${resumeName}`
                      : "PDF files only (Max 5MB)"}
                  </p>
                </label>
              </div>
            </div>

            <div
              className="content-stretch flex gap-[12px] items-start justify-end overflow-clip relative shrink-0 w-full"
              data-node-id="2:115"
              data-name="Box"
            >
              <button
                type="button"
                onClick={() => navigate("/")}
                className="bg-white border border-[#e3e8f0] border-solid content-stretch flex items-center justify-center overflow-clip px-[16px] py-[12px] relative rounded-[10px] shrink-0 text-[#171c29] font-medium text-[14px] hover:bg-gray-50 transition-colors"
                data-node-id="2:111"
                data-name="Button"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#2663eb] hover:bg-blue-700 transition-colors content-stretch flex items-center justify-center overflow-clip px-[16px] py-[12px] relative rounded-[10px] shrink-0 text-white font-medium text-[14px] disabled:bg-blue-300"
                data-node-id="2:113"
                data-name="Button"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
