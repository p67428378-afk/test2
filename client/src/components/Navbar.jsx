import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/api";

export default function Navbar({ user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    if (onLogout) onLogout();
    navigate("/login");
  };

  const getInitials = (email) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div
      className="bg-[#1f293b] border border-[#334054] border-solid content-stretch flex items-center justify-between overflow-clip px-[32px] py-[16px] relative shrink-0 w-full"
      data-node-id="1:4"
      data-name="Navbar"
    >
      <div
        className="[word-break:break-word] content-stretch flex gap-[24px] items-center leading-[normal] not-italic overflow-clip relative shrink-0 whitespace-nowrap"
        data-node-id="1:5"
        data-name="BrandNav"
      >
        <Link
          to="/"
          className="font-bold relative shrink-0 text-[#6173f5] text-[18px] hover:opacity-80"
          data-node-id="1:6"
        >
          CineList
        </Link>
        <div
          className="content-stretch flex font-medium gap-[24px] items-center overflow-clip relative shrink-0 text-[#94a3b8] text-[14px]"
          data-node-id="1:7"
          data-name="Links"
        >
          <Link
            to="/"
            className={`relative shrink-0 hover:text-white ${location.pathname === "/" ? "text-white font-bold" : "text-[#94a3b8]"}`}
            data-node-id="1:8"
          >
            Search Films
          </Link>
          <Link
            to="/dashboard"
            className={`relative shrink-0 hover:text-white ${location.pathname === "/dashboard" ? "text-white font-bold" : "text-[#94a3b8]"}`}
            data-node-id="1:9"
          >
            My Dashboard
          </Link>
        </div>
      </div>
      <div
        className="content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0"
        data-node-id="1:10"
        data-name="UserActions"
      >
        {user && (
          <span className="text-xs text-[#94a3b8] hidden md:inline-block mr-2">
            {user.email}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="text-xs bg-[#334054] hover:bg-red-600 text-white px-3 py-1.5 rounded-[8px] transition-colors"
        >
          Logout
        </button>
        <div
          className="bg-[#6173f5] content-stretch flex items-center justify-center overflow-clip relative rounded-[999px] shrink-0 w-[32px] h-[32px]"
          data-node-id="1:12"
          data-name="Avatar"
        >
          <p
            className="[word-break:break-word] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap"
            data-node-id="1:13"
          >
            {getInitials(user?.email)}
          </p>
        </div>
      </div>
    </div>
  );
}
