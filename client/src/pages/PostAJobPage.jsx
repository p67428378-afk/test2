import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jobsService } from "../services/api";
import { CheckCircle, AlertCircle, Eye } from "lucide-react";

export default function PostAJobPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [salaryRange, setSalaryRange] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await jobsService.createJob({
        title,
        location,
        job_type: jobType,
        salary_range: salaryRange,
        description,
        requirements,
      });
      setSuccess("Job posting created and published successfully!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to create job posting. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-[#f7fafc] content-stretch flex flex-col gap-[24px] items-start p-[32px] relative size-full"
      data-node-id="3:2"
      data-name="Post a Job Page"
    >
      <div
        className="content-stretch flex items-start overflow-clip relative shrink-0 w-full"
        data-node-id="3:14"
        data-name="Box"
      >
        <p className="[word-break:break-word] font-normal leading-[normal] not-italic relative shrink-0 text-[#707a8c] text-[12px] whitespace-pre">
          Employer Dashboard › Post a Job
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
        data-node-id="3:62"
        data-name="SplitLayout"
      >
        {/* Left Column: Form */}
        <div
          className="content-stretch flex flex-col lg:w-1/2 w-full items-start min-w-px overflow-clip relative self-stretch"
          data-node-id="3:63"
          data-name="MainColumn"
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#e3e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[24px] relative rounded-[14px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] shrink-0 w-full"
            data-node-id="3:50"
            data-name="PostJobFormCard"
          >
            <p
              className="[word-break:break-word] font-bold leading-[normal] not-italic relative shrink-0 text-[#171c29] text-[18px] whitespace-nowrap"
              data-node-id="3:51"
            >
              Create a Job Posting
            </p>

            <div
              className="content-stretch flex flex-col gap-[16px] items-start overflow-clip relative shrink-0 w-full"
              data-node-id="3:41"
              data-name="FormGrid"
            >
              <div
                className="content-stretch flex flex-col sm:flex-row gap-[16px] items-start overflow-clip relative shrink-0 w-full"
                data-node-id="3:42"
                data-name="FormRow"
              >
                <div
                  className="content-stretch flex flex-col gap-[4px] items-start min-w-px overflow-clip relative self-stretch w-full"
                  data-node-id="3:16"
                  data-name="Field"
                >
                  <p
                    className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[#707a8c] text-[12px] whitespace-nowrap"
                    data-node-id="3:17"
                  >
                    Job Title
                  </p>
                  <div
                    className="bg-[#f2f5fa] border border-[#e3e8f0] border-solid content-stretch flex items-start overflow-clip p-[12px] relative rounded-[10px] shrink-0 w-full"
                    data-node-id="3:18"
                    data-name="Input"
                  >
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-transparent border-none outline-none text-[#171c29] text-[14px] w-full placeholder-[#707a8c]"
                      placeholder="e.g. Senior Python Developer"
                    />
                  </div>
                </div>

                <div
                  className="content-stretch flex flex-col gap-[4px] items-start min-w-px overflow-clip relative self-stretch w-full"
                  data-node-id="3:20"
                  data-name="Field"
                >
                  <p
                    className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[#707a8c] text-[12px] whitespace-nowrap"
                    data-node-id="3:21"
                  >
                    Location
                  </p>
                  <div
                    className="bg-[#f2f5fa] border border-[#e3e8f0] border-solid content-stretch flex items-start overflow-clip p-[12px] relative rounded-[10px] shrink-0 w-full"
                    data-node-id="3:22"
                    data-name="Input"
                  >
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="bg-transparent border-none outline-none text-[#171c29] text-[14px] w-full placeholder-[#707a8c]"
                      placeholder="e.g. Remote, New York, NY"
                    />
                  </div>
                </div>
              </div>

              <div
                className="content-stretch flex flex-col sm:flex-row gap-[16px] items-start overflow-clip relative shrink-0 w-full"
                data-node-id="3:43"
                data-name="FormRow"
              >
                <div
                  className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] min-w-px not-italic overflow-clip relative self-stretch whitespace-nowrap w-full"
                  data-node-id="3:24"
                  data-name="Dropdown"
                >
                  <p
                    className="font-medium relative shrink-0 text-[#707a8c] text-[12px]"
                    data-node-id="3:25"
                  >
                    Job Type
                  </p>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="bg-[#f2f5fa] border border-[#e3e8f0] border-solid content-stretch flex items-center justify-between overflow-clip p-[12px] relative rounded-[10px] shrink-0 w-full text-[#171c29] text-[14px] outline-none"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div
                  className="content-stretch flex flex-col gap-[4px] items-start min-w-px overflow-clip relative self-stretch w-full"
                  data-node-id="3:29"
                  data-name="Field"
                >
                  <p
                    className="[word-break:break-word] font-medium leading-[normal] min-w-full not-italic relative shrink-0 text-[#707a8c] text-[12px] w-[min-content]"
                    data-node-id="3:30"
                  >
                    Salary Range
                  </p>
                  <div
                    className="bg-[#f2f5fa] border border-[#e3e8f0] border-solid content-stretch flex items-start overflow-clip p-[12px] relative rounded-[10px] shrink-0 w-full"
                    data-node-id="3:31"
                    data-name="Input"
                  >
                    <input
                      type="text"
                      required
                      value={salaryRange}
                      onChange={(e) => setSalaryRange(e.target.value)}
                      className="bg-transparent border-none outline-none text-[#171c29] text-[14px] w-full placeholder-[#707a8c]"
                      placeholder="e.g. $120,000 - $150,000 / year"
                    />
                  </div>
                </div>
              </div>

              <div
                className="content-stretch flex flex-col gap-[16px] items-start overflow-clip relative shrink-0 w-full"
                data-node-id="3:44"
                data-name="FormRow"
              >
                <div
                  className="content-stretch flex flex-col gap-[4px] items-start min-w-px overflow-clip relative self-stretch w-full"
                  data-node-id="3:33"
                  data-name="Field"
                >
                  <p
                    className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[#707a8c] text-[12px] whitespace-nowrap"
                    data-node-id="3:34"
                  >
                    Job Description
                  </p>
                  <div
                    className="bg-[#f2f5fa] border border-[#e3e8f0] border-solid content-stretch flex items-start overflow-clip p-[12px] relative rounded-[10px] shrink-0 w-full"
                    data-node-id="3:35"
                    data-name="Input"
                  >
                    <textarea
                      required
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="bg-transparent border-none outline-none text-[#171c29] text-[14px] w-full placeholder-[#707a8c] resize-none"
                      placeholder="Describe the role, responsibilities, and team..."
                    />
                  </div>
                </div>

                <div
                  className="content-stretch flex flex-col gap-[4px] items-start min-w-px overflow-clip relative self-stretch w-full"
                  data-node-id="3:37"
                  data-name="Field"
                >
                  <p
                    className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[#707a8c] text-[12px] whitespace-nowrap"
                    data-node-id="3:38"
                  >
                    Requirements
                  </p>
                  <div
                    className="bg-[#f2f5fa] border border-[#e3e8f0] border-solid content-stretch flex items-start overflow-clip p-[12px] relative rounded-[10px] shrink-0 w-full"
                    data-node-id="3:39"
                    data-name="Input"
                  >
                    <textarea
                      required
                      rows={5}
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      className="bg-transparent border-none outline-none text-[#171c29] text-[14px] w-full placeholder-[#707a8c] resize-none"
                      placeholder="List required skills, experience, and qualifications..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              className="content-stretch flex gap-[12px] items-start justify-end overflow-clip relative shrink-0 w-full"
              data-node-id="3:49"
              data-name="Box"
            >
              <button
                type="button"
                onClick={() => navigate("/")}
                className="bg-white border border-[#e3e8f0] border-solid content-stretch flex items-center justify-center overflow-clip px-[16px] py-[12px] relative rounded-[10px] shrink-0 text-[#171c29] font-medium text-[14px] hover:bg-gray-50 transition-colors"
                data-node-id="3:45"
                data-name="Button"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#2663eb] hover:bg-blue-700 transition-colors content-stretch flex items-center justify-center overflow-clip px-[16px] py-[12px] relative rounded-[10px] shrink-0 text-white font-medium text-[14px] disabled:bg-blue-300"
                data-node-id="3:47"
                data-name="Button"
              >
                {loading ? "Publishing..." : "Publish Job Posting"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Preview */}
        <div
          className="content-stretch flex flex-col lg:w-1/2 w-full items-start min-w-px overflow-clip relative self-stretch"
          data-node-id="3:64"
          data-name="SideColumn"
        >
          <div
            className="bg-white border border-[#e3e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[24px] relative rounded-[14px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] shrink-0 w-full"
            data-node-id="3:60"
            data-name="JobPreviewCard"
          >
            <p
              className="[word-break:break-word] font-bold leading-[normal] not-italic relative shrink-0 text-[#171c29] text-[18px] whitespace-nowrap flex items-center gap-2"
              data-node-id="3:61"
            >
              <Eye className="w-5 h-5 text-[#2663eb]" /> Live Preview
            </p>
            <p
              className="[word-break:break-word] font-bold leading-[normal] min-w-full not-italic relative shrink-0 text-[#171c29] text-[20px] w-[min-content]"
              data-node-id="3:52"
            >
              {title || "Senior Python Developer"}
            </p>
            <p className="[word-break:break-word] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[#707a8c] text-[14px] w-[min-content] whitespace-pre-wrap">
              {location || "Remote"} • {jobType}
            </p>
            <p
              className="[word-break:break-word] font-bold leading-[normal] min-w-full not-italic relative shrink-0 text-[#2663eb] text-[16px] w-[min-content]"
              data-node-id="3:54"
            >
              {salaryRange || "$120,000 - $150,000 / year"}
            </p>
            <div
              className="bg-[#e3e8f0] h-px relative shrink-0 w-full"
              data-node-id="3:55"
              data-name="Divider"
            />
            <p
              className="[word-break:break-word] font-bold leading-[normal] min-w-full not-italic relative shrink-0 text-[#171c29] text-[14px] w-[min-content]"
              data-node-id="3:56"
            >
              Description Preview
            </p>
            <p
              className="[word-break:break-word] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[#707a8c] text-[13px] w-[min-content] whitespace-pre-wrap"
              data-node-id="3:57"
            >
              {description ||
                "Your job description will appear here as you type. Make sure to include key responsibilities and day-to-day tasks."}
            </p>
            <p
              className="[word-break:break-word] font-bold leading-[normal] min-w-full not-italic relative shrink-0 text-[#171c29] text-[14px] w-[min-content]"
              data-node-id="3:58"
            >
              Requirements Preview
            </p>
            <p
              className="[word-break:break-word] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[#707a8c] text-[13px] w-[min-content] whitespace-pre-wrap"
              data-node-id="3:59"
            >
              {requirements ||
                "Your requirements will appear here. Be clear about must-have skills and experience levels."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
