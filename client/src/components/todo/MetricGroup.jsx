import React from "react";

export default function MetricGroup({ tasks = [], isApiOnline = true }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full"
      data-node-id="2:15"
      data-name="MetricGroup"
    >
      {/* Total Tasks */}
      <div
        className="bg-white border border-[#e3e8f0] flex flex-col gap-1 p-4 rounded-[14px] shadow-sm"
        data-node-id="2:16"
        data-name="Stat"
      >
        <p
          className="font-medium text-[#707a8c] text-[12px]"
          data-node-id="2:17"
        >
          Total Tasks
        </p>
        <div
          className="flex gap-2 items-baseline"
          data-node-id="2:18"
          data-name="ValueRow"
        >
          <p
            className="font-bold text-[#171c29] text-[24px]"
            data-node-id="2:19"
          >
            {total}
          </p>
          <div
            className="bg-[#17a34a] flex items-center justify-center px-2 py-1 rounded-full shrink-0"
            data-node-id="2:20"
            data-name="Badge"
          >
            <p
              className="font-medium text-[12px] text-white"
              data-node-id="2:21"
            >
              Live
            </p>
          </div>
        </div>
      </div>

      {/* Pending Tasks */}
      <div
        className="bg-white border border-[#e3e8f0] flex flex-col gap-1 p-4 rounded-[14px] shadow-sm"
        data-node-id="2:22"
        data-name="Stat"
      >
        <p
          className="font-medium text-[#707a8c] text-[12px]"
          data-node-id="2:23"
        >
          Pending Tasks
        </p>
        <div
          className="flex gap-2 items-baseline"
          data-node-id="2:24"
          data-name="ValueRow"
        >
          <p
            className="font-bold text-[#171c29] text-[24px]"
            data-node-id="2:25"
          >
            {pending}
          </p>
          <div
            className="bg-[#2663eb] flex items-center justify-center px-2 py-1 rounded-full shrink-0"
            data-node-id="2:26"
            data-name="Badge"
          >
            <p
              className="font-medium text-[12px] text-white"
              data-node-id="2:27"
            >
              Active
            </p>
          </div>
        </div>
      </div>

      {/* Completed Tasks */}
      <div
        className="bg-white border border-[#e3e8f0] flex flex-col gap-1 p-4 rounded-[14px] shadow-sm"
        data-node-id="2:28"
        data-name="Stat"
      >
        <p
          className="font-medium text-[#707a8c] text-[12px]"
          data-node-id="2:29"
        >
          Completed Tasks
        </p>
        <div
          className="flex gap-2 items-baseline"
          data-node-id="2:30"
          data-name="ValueRow"
        >
          <p
            className="font-bold text-[#171c29] text-[24px]"
            data-node-id="2:31"
          >
            {completed}
          </p>
          <div
            className="bg-[#17a34a] flex items-center justify-center px-2 py-1 rounded-full shrink-0"
            data-node-id="2:32"
            data-name="Badge"
          >
            <p
              className="font-medium text-[12px] text-white"
              data-node-id="2:33"
            >
              {completionRate}% done
            </p>
          </div>
        </div>
      </div>

      {/* API Sync Status */}
      <div
        className="bg-white border border-[#e3e8f0] flex flex-col gap-1 p-4 rounded-[14px] shadow-sm"
        data-node-id="2:34"
        data-name="Stat"
      >
        <p
          className="font-medium text-[#707a8c] text-[12px]"
          data-node-id="2:35"
        >
          API Sync Status
        </p>
        <div
          className="flex gap-2 items-baseline"
          data-node-id="2:36"
          data-name="ValueRow"
        >
          <p
            className="font-bold text-[#171c29] text-[24px]"
            data-node-id="2:37"
          >
            {isApiOnline ? "Online" : "Offline"}
          </p>
          <div
            className={`${
              isApiOnline ? "bg-[#2663eb]" : "bg-red-500"
            } flex items-center justify-center px-2 py-1 rounded-full shrink-0`}
            data-node-id="2:38"
            data-name="Badge"
          >
            <p
              className="font-medium text-[12px] text-white"
              data-node-id="2:39"
            >
              FastAPI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
