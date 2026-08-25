import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jobsService } from "../services/api";
import { Search, MapPin, Briefcase, DollarSign, Calendar } from "lucide-react";

export default function JobBoardSearchPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter states
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState(""); // 'Full-time', 'Part-time', 'Contract'

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (search) params.search = search;
      if (location) params.location = location;
      if (jobType) params.job_type = jobType;

      const data = await jobsService.listJobs(params);
      setJobs(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError("Failed to load job postings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleJobTypeChange = (type) => {
    if (jobType === type) {
      setJobType(""); // Uncheck
    } else {
      setRoleAndType(type);
    }
  };

  const setRoleAndType = (type) => {
    setJobType(type);
  };

  return (
    <div
      className="bg-[#f7fafc] content-stretch flex flex-col gap-[24px] items-start p-[32px] relative size-full"
      data-node-id="2:2"
      data-name="Job Board Search Page"
    >
      <div
        className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic overflow-clip relative shrink-0 w-full whitespace-nowrap"
        data-node-id="2:14"
        data-name="HeaderSection"
      >
        <p
          className="font-bold relative shrink-0 text-[#171c29] text-[32px]"
          data-node-id="2:15"
        >
          Find Your Next Specialized Role
        </p>
        <p
          className="font-normal relative shrink-0 text-[#707a8c] text-[16px]"
          data-node-id="2:16"
        >
          Discover curated opportunities in high-tech and specialized
          industries.
        </p>
      </div>

      <div
        className="content-stretch flex flex-col lg:flex-row gap-[24px] items-start overflow-clip relative shrink-0 w-full"
        data-node-id="2:66"
        data-name="SplitLayout"
      >
        {/* Left Column: Filters */}
        <div
          className="content-stretch flex flex-col lg:w-1/3 w-full items-start min-w-px overflow-clip relative self-stretch"
          data-node-id="2:67"
          data-name="MainColumn"
        >
          <form
            onSubmit={handleApplyFilters}
            className="bg-white border border-[#e3e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[24px] relative rounded-[14px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] shrink-0 w-full"
            data-node-id="2:39"
            data-name="FiltersCard"
          >
            <p
              className="[word-break:break-word] font-bold leading-[normal] not-italic relative shrink-0 text-[#171c29] text-[18px] whitespace-nowrap"
              data-node-id="2:40"
            >
              Filters
            </p>

            <div
              className="content-stretch flex flex-col gap-[4px] items-start overflow-clip relative shrink-0 w-full"
              data-node-id="2:17"
              data-name="Field"
            >
              <p
                className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[#707a8c] text-[12px] whitespace-nowrap"
                data-node-id="2:18"
              >
                Keywords
              </p>
              <div
                className="bg-[#f2f5fa] border border-[#e3e8f0] border-solid content-stretch flex items-center overflow-clip px-[12px] py-[8px] relative rounded-[10px] shrink-0 w-full"
                data-node-id="2:19"
                data-name="Input"
              >
                <Search className="w-4 h-4 text-[#707a8c] mr-2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-[#171c29] text-[14px] w-full placeholder-[#707a8c]"
                  placeholder="e.g. Python, React, FastAPI"
                />
              </div>
            </div>

            <div
              className="content-stretch flex flex-col gap-[4px] items-start overflow-clip relative shrink-0 w-full"
              data-node-id="2:21"
              data-name="Field"
            >
              <p
                className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[#707a8c] text-[12px] whitespace-nowrap"
                data-node-id="2:22"
              >
                Location
              </p>
              <div
                className="bg-[#f2f5fa] border border-[#e3e8f0] border-solid content-stretch flex items-center overflow-clip px-[12px] py-[8px] relative rounded-[10px] shrink-0 w-full"
                data-node-id="2:23"
                data-name="Input"
              >
                <MapPin className="w-4 h-4 text-[#707a8c] mr-2" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent border-none outline-none text-[#171c29] text-[14px] w-full placeholder-[#707a8c]"
                  placeholder="e.g. Remote, New York, NY"
                />
              </div>
            </div>

            <p
              className="[word-break:break-word] font-medium leading-[normal] min-w-full not-italic relative shrink-0 text-[#707a8c] text-[12px] w-[min-content]"
              data-node-id="2:25"
            >
              Job Type
            </p>

            <div
              className="content-stretch flex gap-[8px] items-center overflow-clip relative shrink-0 w-full cursor-pointer"
              onClick={() => handleJobTypeChange("Full-time")}
              data-node-id="2:26"
              data-name="CheckboxRow"
            >
              <div
                className={`content-stretch flex items-center justify-center overflow-clip relative rounded-[6px] shrink-0 size-[18px] ${jobType === "Full-time" ? "bg-[#2663eb]" : "bg-[#f2f5fa] border border-[#e3e8f0] border-solid"}`}
                data-node-id="2:27"
                data-name="Check"
              >
                {jobType === "Full-time" && (
                  <p
                    className="[word-break:break-word] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap"
                    data-node-id="2:28"
                  >
                    ✓
                  </p>
                )}
              </div>
              <p
                className="[word-break:break-word] font-normal leading-[normal] not-italic relative shrink-0 text-[#171c29] text-[14px] whitespace-nowrap"
                data-node-id="2:29"
              >
                Full-time
              </p>
            </div>

            <div
              className="content-stretch flex gap-[8px] items-center overflow-clip relative shrink-0 w-full cursor-pointer"
              onClick={() => handleJobTypeChange("Part-time")}
              data-node-id="2:30"
              data-name="CheckboxRow"
            >
              <div
                className={`content-stretch flex items-center justify-center overflow-clip relative rounded-[6px] shrink-0 size-[18px] ${jobType === "Part-time" ? "bg-[#2663eb]" : "bg-[#f2f5fa] border border-[#e3e8f0] border-solid"}`}
                data-node-id="2:31"
                data-name="Check"
              >
                {jobType === "Part-time" && (
                  <p className="[word-break:break-word] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
                    ✓
                  </p>
                )}
              </div>
              <p
                className="[word-break:break-word] font-normal leading-[normal] not-italic relative shrink-0 text-[#171c29] text-[14px] whitespace-nowrap"
                data-node-id="2:32"
              >
                Part-time
              </p>
            </div>

            <div
              className="content-stretch flex gap-[8px] items-center overflow-clip relative shrink-0 w-full cursor-pointer"
              onClick={() => handleJobTypeChange("Contract")}
              data-node-id="2:33"
              data-name="CheckboxRow"
            >
              <div
                className={`content-stretch flex items-center justify-center overflow-clip relative rounded-[6px] shrink-0 size-[18px] ${jobType === "Contract" ? "bg-[#2663eb]" : "bg-[#f2f5fa] border border-[#e3e8f0] border-solid"}`}
                data-node-id="2:34"
                data-name="Check"
              >
                {jobType === "Contract" && (
                  <p
                    className="[word-break:break-word] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap"
                    data-node-id="2:35"
                  >
                    ✓
                  </p>
                )}
              </div>
              <p
                className="[word-break:break-word] font-normal leading-[normal] not-italic relative shrink-0 text-[#171c29] text-[14px] whitespace-nowrap"
                data-node-id="2:36"
              >
                Contract
              </p>
            </div>

            <button
              type="submit"
              className="bg-[#2663eb] hover:bg-blue-700 transition-colors content-stretch flex items-center justify-center overflow-clip px-[16px] py-[12px] relative rounded-[10px] shrink-0 w-full text-white font-medium text-[14px]"
              data-node-id="2:37"
              data-name="Button"
            >
              Apply Filters
            </button>
          </form>
        </div>

        {/* Right Column: Job Listings */}
        <div
          className="content-stretch flex flex-col lg:w-2/3 w-full items-start min-w-px overflow-clip relative self-stretch"
          data-node-id="2:68"
          data-name="SideColumn"
        >
          <div
            className="content-stretch flex flex-col gap-[16px] items-start overflow-clip relative shrink-0 w-full"
            data-node-id="2:65"
            data-name="JobListings"
          >
            {error && (
              <div className="bg-red-50 border-l-4 border-[#db2626] p-4 rounded-md w-full">
                <p className="text-sm text-[#db2626]">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-12 w-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2663eb]"></div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white border border-[#e3e8f0] p-8 rounded-[14px] text-center w-full">
                <p className="text-[#707a8c] text-lg">
                  No job postings found matching your criteria.
                </p>
              </div>
            ) : (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-[#e3e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[16px] relative rounded-[10px] shrink-0 w-full hover:shadow-md transition-shadow"
                  data-node-id="2:41"
                  data-name="JobCard1"
                >
                  <div
                    className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full"
                    data-node-id="2:42"
                    data-name="Box"
                  >
                    <div
                      className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic overflow-clip relative shrink-0"
                      data-node-id="2:43"
                      data-name="Box"
                    >
                      <p
                        className="font-bold relative shrink-0 text-[#171c29] text-[18px] whitespace-nowrap"
                        data-node-id="2:44"
                      >
                        {job.title}
                      </p>
                      <p className="font-normal relative shrink-0 text-[#707a8c] text-[14px] whitespace-pre flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {job.location}
                      </p>
                    </div>
                    <div
                      className={`content-stretch flex items-center justify-center overflow-clip px-[8px] py-[4px] relative rounded-[999px] shrink-0 text-white text-[12px] font-medium ${job.job_type === "Full-time" ? "bg-[#17a34a]" : job.job_type === "Contract" ? "bg-[#eb9917]" : "bg-[#2663eb]"}`}
                      data-node-id="2:46"
                      data-name="Badge"
                    >
                      <p
                        className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap"
                        data-node-id="2:47"
                      >
                        {job.job_type}
                      </p>
                    </div>
                  </div>
                  <p
                    className="[word-break:break-word] font-normal leading-[normal] not-italic relative shrink-0 text-[#171c29] text-[14px]"
                    data-node-id="2:48"
                  >
                    {job.description.length > 180
                      ? `${job.description.substring(0, 180)}...`
                      : job.description}
                  </p>
                  <div
                    className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full"
                    data-node-id="2:49"
                    data-name="Box"
                  >
                    <p
                      className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[#2663eb] text-[14px] whitespace-nowrap flex items-center gap-1"
                      data-node-id="2:50"
                    >
                      <DollarSign className="w-4 h-4" />{" "}
                      {job.salary_range || "Not specified"}
                    </p>
                    <button
                      onClick={() => navigate(`/jobs/${job.id}/apply`)}
                      className="bg-[#2663eb] hover:bg-blue-700 transition-colors text-white font-medium text-[14px] px-[16px] py-[12px] rounded-[10px]"
                      data-node-id="2:51"
                      data-name="Button"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
