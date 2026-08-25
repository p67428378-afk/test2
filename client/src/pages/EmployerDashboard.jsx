import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jobsService, applicationsService, authService } from "../services/api";
import { Plus, FileText, Check, X, RefreshCw, AlertCircle } from "lucide-react";

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Metrics
  const [metrics, setMetrics] = useState({
    activeJobs: 0,
    totalApps: 0,
    pendingReview: 0,
    interviews: 0,
  });

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      // Get current user
      const user = await authService.getMe();
      setCurrentUser(user);

      if (user.role !== "employer") {
        setError("Access denied. Only employers can view this dashboard.");
        setLoading(false);
        return;
      }

      // Fetch all jobs
      const jobsData = await jobsService.listJobs({ limit: 100 });
      const allJobs = jobsData.items || [];

      // Filter jobs owned by this employer (or try to fetch applications for all and catch 403s)
      // Since the backend doesn't have an explicit "my jobs" endpoint, we can try to fetch applications
      // for each job. If it succeeds, it's our job!
      const myJobs = [];
      const allApps = [];

      for (const job of allJobs) {
        try {
          const apps = await applicationsService.listApplications(job.id);
          myJobs.push(job);
          // Add job title to each application for display
          const appsWithJobTitle = apps.map((app) => ({
            ...app,
            jobTitle: job.title,
          }));
          allApps.push(...appsWithJobTitle);
        } catch (err) {
          // 403 Forbidden means it's not our job, so we skip it
        }
      }

      setJobs(myJobs);
      setApplications(allApps);

      // Calculate metrics
      const pending = allApps.filter(
        (app) => app.status === "Applied" || app.status === "Reviewed",
      ).length;
      const interviewing = allApps.filter(
        (app) => app.status === "Interviewing",
      ).length;

      setMetrics({
        activeJobs: myJobs.length,
        totalApps: allApps.length,
        pendingReview: pending,
        interviews: interviewing,
      });
    } catch (err) {
      setError(
        "Failed to load dashboard data. Please make sure you are logged in as an employer.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await applicationsService.updateStatus(appId, newStatus);
      // Reload data to update UI
      await loadDashboardData();
    } catch (err) {
      setError("Failed to update application status.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2663eb]"></div>
      </div>
    );
  }

  return (
    <div
      className="bg-[#f7fafc] content-stretch flex flex-col gap-[24px] items-start p-[32px] relative size-full"
      data-node-id="3:65"
      data-name="Employer Dashboard"
    >
      <div
        className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full"
        data-node-id="3:77"
        data-name="HeaderSection"
      >
        <div
          className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic overflow-clip relative shrink-0 whitespace-nowrap"
          data-node-id="3:78"
          data-name="Box"
        >
          <p
            className="font-bold relative shrink-0 text-[#171c29] text-[32px]"
            data-node-id="3:79"
          >
            Employer Dashboard
          </p>
          <p
            className="font-normal relative shrink-0 text-[#707a8c] text-[16px]"
            data-node-id="3:80"
          >
            Manage your job postings and track applicant progress.
          </p>
        </div>
        <button
          onClick={() => navigate("/post-job")}
          className="bg-[#2663eb] hover:bg-blue-700 transition-colors content-stretch flex items-center justify-center gap-2 overflow-clip px-[16px] py-[12px] relative rounded-[10px] shrink-0 text-white font-medium text-[14px]"
          data-node-id="3:81"
          data-name="Button"
        >
          <Plus className="w-4 h-4" /> Post a New Job
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-[#db2626] p-4 rounded-md w-full flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-[#db2626]" />
          <p className="text-sm text-[#db2626] font-medium">{error}</p>
        </div>
      )}

      {/* Metrics Row */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] w-full"
        data-node-id="3:83"
        data-name="MetricGroup"
      >
        <div
          className="bg-white border border-[#e3e8f0] border-solid content-stretch flex flex-col gap-[4px] items-start min-w-px overflow-clip p-[16px] relative rounded-[14px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)]"
          data-node-id="3:84"
          data-name="Stat"
        >
          <p
            className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[#707a8c] text-[12px] whitespace-nowrap"
            data-node-id="3:85"
          >
            Active Job Postings
          </p>
          <div
            className="content-stretch flex gap-[8px] items-baseline overflow-clip relative shrink-0"
            data-node-id="3:86"
            data-name="ValueRow"
          >
            <p
              className="[word-break:break-word] font-bold leading-[normal] not-italic relative shrink-0 text-[#171c29] text-[24px] whitespace-nowrap"
              data-node-id="3:87"
            >
              {metrics.activeJobs}
            </p>
          </div>
        </div>

        <div
          className="bg-white border border-[#e3e8f0] border-solid content-stretch flex flex-col gap-[4px] items-start min-w-px overflow-clip p-[16px] relative rounded-[14px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)]"
          data-node-id="3:90"
          data-name="Stat"
        >
          <p
            className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[#707a8c] text-[12px] whitespace-nowrap"
            data-node-id="3:91"
          >
            Total Applications
          </p>
          <div
            className="content-stretch flex gap-[8px] items-baseline overflow-clip relative shrink-0"
            data-node-id="3:92"
            data-name="ValueRow"
          >
            <p
              className="[word-break:break-word] font-bold leading-[normal] not-italic relative shrink-0 text-[#171c29] text-[24px] whitespace-nowrap"
              data-node-id="3:93"
            >
              {metrics.totalApps}
            </p>
          </div>
        </div>

        <div
          className="bg-white border border-[#e3e8f0] border-solid content-stretch flex flex-col gap-[4px] items-start min-w-px overflow-clip p-[16px] relative rounded-[14px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)]"
          data-node-id="3:96"
          data-name="Stat"
        >
          <p
            className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[#707a8c] text-[12px] whitespace-nowrap"
            data-node-id="3:97"
          >
            Pending Review
          </p>
          <div
            className="content-stretch flex gap-[8px] items-baseline overflow-clip relative shrink-0"
            data-node-id="3:98"
            data-name="ValueRow"
          >
            <p
              className="[word-break:break-word] font-bold leading-[normal] not-italic relative shrink-0 text-[#171c29] text-[24px] whitespace-nowrap"
              data-node-id="3:99"
            >
              {metrics.pendingReview}
            </p>
          </div>
        </div>

        <div
          className="bg-white border border-[#e3e8f0] border-solid content-stretch flex flex-col gap-[4px] items-start min-w-px overflow-clip p-[16px] relative rounded-[14px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)]"
          data-node-id="3:102"
          data-name="Stat"
        >
          <p
            className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[#707a8c] text-[12px] whitespace-nowrap"
            data-node-id="3:103"
          >
            Interviews Scheduled
          </p>
          <div
            className="content-stretch flex gap-[8px] items-baseline overflow-clip relative shrink-0"
            data-node-id="3:104"
            data-name="ValueRow"
          >
            <p
              className="[word-break:break-word] font-bold leading-[normal] not-italic relative shrink-0 text-[#171c29] text-[24px] whitespace-nowrap"
              data-node-id="3:105"
            >
              {metrics.interviews}
            </p>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div
        className="[word-break:break-word] bg-white border border-[#e3e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start leading-[normal] not-italic overflow-clip p-[24px] relative rounded-[14px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] shrink-0 w-full"
        data-node-id="3:144"
        data-name="Card"
      >
        <p
          className="font-bold relative shrink-0 text-[#171c29] text-[18px] whitespace-nowrap"
          data-node-id="3:145"
        >
          Recent Applications
        </p>

        <div
          className="bg-white border border-[#e3e8f0] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[10px] shrink-0 text-[13px] w-full"
          data-node-id="3:108"
          data-name="Table"
        >
          {/* Table Header */}
          <div
            className="bg-[#f7fafc] content-stretch flex font-medium gap-[12px] items-start overflow-clip p-[12px] relative shrink-0 text-[#707a8c] w-full border-b border-[#e3e8f0]"
            data-node-id="3:109"
            data-name="Header"
          >
            <p
              className="flex-[1.5_1_0%] min-w-px relative"
              data-node-id="3:110"
            >
              Applicant Email
            </p>
            <p
              className="flex-[1.5_1_0%] min-w-px relative self-stretch"
              data-node-id="3:111"
            >
              Job Title
            </p>
            <p className="flex-[2_1_0%] min-w-px relative self-stretch">
              Cover Letter
            </p>
            <p
              className="flex-[1_1_0%] min-w-px relative self-stretch"
              data-node-id="3:113"
            >
              Resume
            </p>
            <p
              className="flex-[1_1_0%] min-w-px relative self-stretch"
              data-node-id="3:114"
            >
              Status
            </p>
            <p
              className="flex-[1.5_1_0%] min-w-px relative self-stretch"
              data-node-id="3:115"
            >
              Actions
            </p>
          </div>

          {/* Table Body */}
          {applications.length === 0 ? (
            <div className="p-8 text-center w-full text-[#707a8c]">
              No applications received yet.
            </div>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className="bg-white content-stretch flex font-normal gap-[12px] items-start overflow-clip p-[12px] relative shrink-0 text-[#171c29] w-full border-b border-[#e3e8f0] last:border-none hover:bg-gray-50 transition-colors"
                data-node-id="3:116"
                data-name="Row"
              >
                <p
                  className="flex-[1.5_1_0%] min-w-px relative font-medium"
                  data-node-id="3:117"
                >
                  {app.job_seeker?.email || "Unknown"}
                </p>
                <p
                  className="flex-[1.5_1_0%] min-w-px relative"
                  data-node-id="3:118"
                >
                  {app.jobTitle}
                </p>
                <p
                  className="flex-[2_1_0%] min-w-px relative text-xs text-[#707a8c] line-clamp-2"
                  title={app.cover_letter}
                >
                  {app.cover_letter || "No cover letter provided."}
                </p>
                <div
                  className="flex-[1_1_0%] min-w-px relative self-stretch"
                  data-node-id="3:113"
                >
                  <a
                    href={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}${app.resume_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2663eb] hover:underline flex items-center gap-1"
                  >
                    <FileText className="w-4 h-4" /> Resume
                  </a>
                </div>
                <div
                  className="flex-[1_1_0%] min-w-px relative self-stretch"
                  data-node-id="3:114"
                >
                  <span
                    className={`px-2 py-1 rounded-full text-[11px] font-semibold ${
                      app.status === "Applied"
                        ? "bg-blue-50 text-[#2663eb]"
                        : app.status === "Reviewed"
                          ? "bg-yellow-50 text-[#eb9917]"
                          : app.status === "Interviewing"
                            ? "bg-green-50 text-[#17a34a]"
                            : "bg-red-50 text-[#db2626]"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
                <div
                  className="flex-[1.5_1_0%] min-w-px relative self-stretch flex flex-wrap gap-1"
                  data-node-id="3:115"
                >
                  {app.status === "Applied" && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(app.id, "Reviewed")}
                        className="bg-yellow-50 text-[#eb9917] hover:bg-yellow-100 px-2 py-1 rounded text-[11px] font-medium transition-colors"
                      >
                        Review
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(app.id, "Rejected")}
                        className="bg-red-50 text-[#db2626] hover:bg-red-100 px-2 py-1 rounded text-[11px] font-medium transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {app.status === "Reviewed" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusUpdate(app.id, "Interviewing")
                        }
                        className="bg-green-50 text-[#17a34a] hover:bg-green-100 px-2 py-1 rounded text-[11px] font-medium transition-colors"
                      >
                        Interview
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(app.id, "Rejected")}
                        className="bg-red-50 text-[#db2626] hover:bg-red-100 px-2 py-1 rounded text-[11px] font-medium transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {app.status === "Interviewing" && (
                    <button
                      onClick={() => handleStatusUpdate(app.id, "Rejected")}
                      className="bg-red-50 text-[#db2626] hover:bg-red-100 px-2 py-1 rounded text-[11px] font-medium transition-colors"
                    >
                      Reject
                    </button>
                  )}
                  {app.status === "Rejected" && (
                    <button
                      onClick={() => handleStatusUpdate(app.id, "Applied")}
                      className="bg-blue-50 text-[#2663eb] hover:bg-blue-100 px-2 py-1 rounded text-[11px] font-medium transition-colors"
                    >
                      Reconsider
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
