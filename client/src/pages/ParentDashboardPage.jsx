import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import KidHeader from "../components/KidHeader";
import { progressService, learningService, authService } from "../services/api";

export default function ParentDashboardPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [learningItems, setLearningItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        const [progData, itemsData] = await Promise.all([
          progressService.getProgress(),
          learningService.getItems(),
        ]);
        setProgress(progData);
        setLearningItems(itemsData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        if (err.response?.status === 401) {
          authService.logout();
          navigate("/login");
        } else {
          setError("Failed to load dashboard data. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [navigate]);

  const handleReset = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset all progress? This will clear all stars and explored items.",
      )
    ) {
      return;
    }

    try {
      await progressService.resetProgress();
      setResetSuccess(true);
      // Refresh progress data
      const progData = await progressService.getProgress();
      setProgress(progData);
      setTimeout(() => setResetSuccess(false), 3000);
    } catch (err) {
      console.error("Error resetting progress:", err);
      setError("Failed to reset progress. Please try again.");
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="bg-[#f2faff] flex flex-col gap-[24px] items-start p-[32px] relative min-h-screen w-full">
        <KidHeader activeTab="parents" />
        <div className="flex justify-center items-center w-full min-h-[400px]">
          <p className="text-[#ff6e00] text-[24px] font-bold animate-pulse">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const totalStars = progress?.total_stars || 0;
  const exploredIds = progress?.explored_item_ids || [];

  const alphabetItems = learningItems.filter(
    (item) => item.type === "alphabet",
  );
  const numberItems = learningItems.filter((item) => item.type === "number");

  const exploredAlphabets = alphabetItems.filter((item) =>
    exploredIds.includes(item.id),
  );
  const exploredNumbers = numberItems.filter((item) =>
    exploredIds.includes(item.id),
  );

  const alphabetPercentage =
    alphabetItems.length > 0
      ? Math.round((exploredAlphabets.length / alphabetItems.length) * 100)
      : 0;
  const numberPercentage =
    numberItems.length > 0
      ? Math.round((exploredNumbers.length / numberItems.length) * 100)
      : 0;

  // Build progress table rows
  const progressRows = learningItems
    .filter((item) => exploredIds.includes(item.id))
    .map((item) => ({
      id: item.id,
      name:
        item.type === "alphabet"
          ? `${item.value} (${item.word_association})`
          : item.value,
      type: item.type === "alphabet" ? "Alphabet" : "Number",
      exploredAt: "Just now", // Since we don't have exact timestamps in the simple response
      stars: "⭐ 1",
    }));

  return (
    <div className="bg-[#f2faff] flex flex-col gap-[24px] items-start p-[32px] relative min-h-screen w-full">
      <KidHeader activeTab="parents" />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg w-full">
          {error}
        </div>
      )}

      {resetSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg w-full font-bold">
          🔄 Progress reset successfully! Your child can start learning fresh.
        </div>
      )}

      <div className="flex justify-between items-center w-full">
        <h1 className="text-[28px] font-bold text-[#1a2640]">
          Parent Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-white border border-[#cce0f2] hover:bg-red-50 hover:text-red-600 text-[#668099] px-4 py-2 rounded-lg font-medium transition-all"
        >
          Logout
        </button>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-[16px] w-full"
        data-node-id="2:117"
        data-name="MetricGroup"
      >
        <div className="bg-white border border-[#cce0f2] border-solid flex flex-col gap-[4px] items-start p-[16px] rounded-[14px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)]">
          <p className="font-medium text-[#668099] text-[12px] whitespace-nowrap">
            Total Stars Earned
          </p>
          <div className="flex gap-[8px] items-baseline">
            <p className="font-bold text-[#1a2640] text-[24px] whitespace-nowrap">
              {totalStars} ⭐
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#cce0f2] border-solid flex flex-col gap-[4px] items-start p-[16px] rounded-[14px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)]">
          <p className="font-medium text-[#668099] text-[12px] whitespace-nowrap">
            Letters Explored
          </p>
          <div className="flex gap-[8px] items-baseline">
            <p className="font-bold text-[#1a2640] text-[24px] whitespace-nowrap">
              {exploredAlphabets.length} / {alphabetItems.length}
            </p>
            <div className="bg-[#26bf59] px-[8px] py-[4px] rounded-[999px]">
              <p className="font-medium text-[12px] text-white whitespace-nowrap">
                {alphabetPercentage}% Complete
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#cce0f2] border-solid flex flex-col gap-[4px] items-start p-[16px] rounded-[14px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)]">
          <p className="font-medium text-[#668099] text-[12px] whitespace-nowrap">
            Numbers Explored
          </p>
          <div className="flex gap-[8px] items-baseline">
            <p className="font-bold text-[#1a2640] text-[24px] whitespace-nowrap">
              {exploredNumbers.length} / {numberItems.length}
            </p>
            <div className="bg-[#26bf59] px-[8px] py-[4px] rounded-[999px]">
              <p className="font-medium text-[12px] text-white whitespace-nowrap">
                {numberPercentage}% Complete
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-[24px] items-start w-full">
        <div className="flex flex-col flex-[7_0_0] items-start w-full">
          <div className="bg-white border border-[#cce0f2] border-solid flex flex-col gap-[12px] items-start p-[24px] rounded-[14px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] w-full">
            <p className="font-bold text-[#1a2640] text-[18px]">
              Child's Learning Progress
            </p>

            <div className="bg-white border border-[#cce0f2] border-solid flex flex-col items-start overflow-clip rounded-[10px] text-[13px] w-full">
              <div className="bg-[#f2faff] flex font-medium gap-[12px] items-start p-[12px] text-[#668099] w-full">
                <p className="flex-[1_0_0] min-w-px">Item</p>
                <p className="flex-[1_0_0] min-w-px">Type</p>
                <p className="flex-[1_0_0] min-w-px">Explored At</p>
                <p className="flex-[1_0_0] min-w-px">Stars</p>
              </div>

              {progressRows.length === 0 ? (
                <div className="p-8 text-center text-[#668099] w-full">
                  No items explored yet. Let's start learning! 🎨
                </div>
              ) : (
                progressRows.map((row, idx) => (
                  <div
                    key={idx}
                    className="bg-white border-t border-[#cce0f2] flex font-normal gap-[12px] items-start p-[12px] text-[#1a2640] w-full"
                  >
                    <p className="flex-[1_0_0] min-w-px">{row.name}</p>
                    <p className="flex-[1_0_0] min-w-px">{row.type}</p>
                    <p className="flex-[1_0_0] min-w-px">{row.exploredAt}</p>
                    <p className="flex-[1_0_0] min-w-px">{row.stars}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-[4_0_0] items-start w-full lg:w-auto">
          <div className="bg-white border border-[#cce0f2] border-solid flex flex-col gap-[12px] items-start p-[24px] rounded-[14px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] w-full">
            <p className="font-bold text-[#1a2640] text-[18px]">
              Quick Actions
            </p>
            <p className="text-[#668099] text-[14px]">
              Manage your child's learning session and progress data.
            </p>

            <button
              onClick={handleReset}
              className="bg-[#ff6e00] hover:bg-[#e05c00] active:scale-95 transition-all flex items-center justify-center p-[12px] rounded-[10px] w-full text-white font-medium text-[14px]"
            >
              🔄 Reset Progress
            </button>

            <button
              onClick={() => window.print()}
              className="bg-white border border-[#cce0f2] hover:bg-[#f2faff] active:scale-95 transition-all flex items-center justify-center p-[12px] rounded-[10px] w-full text-[#1a2640] font-medium text-[14px]"
            >
              📥 Export Progress Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
