import React from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";

export default function KidHeader({ activeTab }) {
  const navigate = useNavigate();
  const isLoggedIn = authService.isAuthenticated();

  return (
    <div
      className="bg-white border border-[#cce0f2] border-solid flex items-center justify-between overflow-clip p-[16px] relative rounded-[14px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] shrink-0 w-full"
      data-node-id="1:4"
      data-name="KidHeader"
    >
      <div
        className="flex items-center overflow-clip relative shrink-0 cursor-pointer"
        onClick={() => navigate("/")}
        data-node-id="1:5"
        data-name="Box"
      >
        <p className="[word-break:break-word] font-bold leading-[normal] not-italic relative shrink-0 text-[#ff6e00] text-[24px] whitespace-nowrap">
          🎨 ToddlerLearn
        </p>
      </div>

      <div
        className="flex gap-[16px] items-center overflow-clip relative shrink-0"
        data-node-id="1:7"
        data-name="Box"
      >
        <button
          onClick={() => navigate("/")}
          className={`content-stretch flex items-start overflow-clip p-[12px] relative rounded-[999px] shrink-0 transition-all duration-200 min-w-[64px] min-h-[48px] justify-center items-center ${
            activeTab === "letters"
              ? "bg-[#ff6e00] text-white shadow-md scale-105"
              : "bg-[#ebf5fa] text-[#1a2640] hover:bg-[#d0e7f5]"
          }`}
          data-node-id="1:8"
          data-name="LettersTab"
        >
          <p className="[word-break:break-word] font-bold leading-[normal] not-italic relative shrink-0 text-[18px] whitespace-nowrap">
            🔤 Letters
          </p>
        </button>

        <button
          onClick={() => navigate("/numbers")}
          className={`content-stretch flex items-start overflow-clip p-[12px] relative rounded-[999px] shrink-0 transition-all duration-200 min-w-[64px] min-h-[48px] justify-center items-center ${
            activeTab === "numbers"
              ? "bg-[#ff6e00] text-white shadow-md scale-105"
              : "bg-[#ebf5fa] text-[#1a2640] hover:bg-[#d0e7f5]"
          }`}
          data-node-id="1:10"
          data-name="NumbersTab"
        >
          <p className="[word-break:break-word] font-bold leading-[normal] not-italic relative shrink-0 text-[18px] whitespace-nowrap">
            🔢 Numbers
          </p>
        </button>
      </div>

      <button
        onClick={() => navigate(isLoggedIn ? "/parent" : "/login")}
        className={`border border-[#cce0f2] border-solid flex items-start overflow-clip p-[12px] relative rounded-[999px] shrink-0 transition-all duration-200 ${
          activeTab === "parents"
            ? "bg-[#ff6e00] text-white border-[#ff6e00]"
            : "bg-white text-[#668099] hover:bg-[#f2faff]"
        }`}
        data-node-id="1:12"
        data-name="ParentTab"
      >
        <p className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[16px] whitespace-nowrap">
          🔒 Parents
        </p>
      </button>
    </div>
  );
}
