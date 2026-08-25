import React from "react";

export default function Navbar({ units, onToggleUnits }) {
  return (
    <div
      className="bg-white border border-[#e3e8f0] border-solid content-stretch flex items-center justify-between overflow-clip px-[32px] py-[16px] relative shrink-0 w-full"
      data-node-id="1:4"
      data-name="Navbar"
    >
      <div
        className="[word-break:break-word] content-stretch flex gap-[24px] items-center leading-[normal] not-italic overflow-clip relative shrink-0 whitespace-nowrap"
        data-node-id="1:5"
        data-name="BrandNav"
      >
        <p
          className="font-bold relative shrink-0 text-[#2663eb] text-[18px]"
          data-node-id="1:6"
        >
          WeatherCast
        </p>
        <div
          className="content-stretch flex font-medium gap-[24px] items-center overflow-clip relative shrink-0 text-[#707a8c] text-[14px]"
          data-node-id="1:7"
          data-name="Links"
        >
          <p
            className="relative shrink-0 cursor-pointer hover:text-[#2663eb]"
            data-node-id="1:8"
          >
            {" "}
            Dashboard{" "}
          </p>
          <p
            className="relative shrink-0 cursor-pointer hover:text-[#2663eb]"
            data-node-id="1:9"
          >
            {" "}
            Radar{" "}
          </p>
          <p
            className="relative shrink-0 cursor-pointer hover:text-[#2663eb]"
            data-node-id="1:10"
          >
            {" "}
            Alerts{" "}
          </p>
          <p
            className="relative shrink-0 cursor-pointer hover:text-[#2663eb]"
            data-node-id="1:11"
          >
            {" "}
            Settings{" "}
          </p>
        </div>
      </div>
      <div
        className="content-stretch flex gap-[16px] items-center overflow-clip relative shrink-0"
        data-node-id="1:12"
        data-name="UserActions"
      >
        {/* Unit Toggle Button */}
        <button
          onClick={onToggleUnits}
          className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#171c29] font-semibold px-3 py-1.5 rounded-md text-sm transition-colors"
          aria-label="Toggle temperature units"
        >
          {units === "metric" ? "Switch to °F" : "Switch to °C"}
        </button>

        <p
          className="[word-break:break-word] font-normal leading-[normal] not-italic relative shrink-0 text-[#707a8c] text-[16px] whitespace-nowrap cursor-pointer"
          data-node-id="1:13"
        >
          🔔
        </p>
        <div
          className="bg-[#2663eb] content-stretch flex items-center justify-center overflow-clip relative rounded-[999px] shrink-0 size-[32px]"
          data-node-id="1:14"
          data-name="Avatar"
        >
          <p
            className="[word-break:break-word] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap"
            data-node-id="1:15"
          >
            JD
          </p>
        </div>
      </div>
    </div>
  );
}
