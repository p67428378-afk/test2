import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../services/api";
import { Briefcase, LogOut, User, Bell } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authService.getMe();
        setCurrentUser(user);
      } catch (err) {
        setCurrentUser(null);
      }
    };
    if (localStorage.getItem("token")) {
      fetchUser();
    } else {
      setCurrentUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <div
      className="bg-white border border-[#e3e8f0] border-solid content-stretch flex items-center justify-between overflow-clip px-[32px] py-[16px] relative shrink-0 w-full"
      data-node-id="2:3"
      data-name="Navbar"
    >
      <div
        className="[word-break:break-word] content-stretch flex gap-[24px] items-center leading-[normal] not-italic overflow-clip relative shrink-0 whitespace-nowrap"
        data-node-id="2:4"
        data-name="BrandNav"
      >
        <Link
          to="/"
          className="font-bold relative shrink-0 text-[#2663eb] text-[18px] flex items-center gap-2"
          data-node-id="2:5"
        >
          <Briefcase className="w-5 h-5 text-[#2663eb]" />
          <span>NicheJobs</span>
        </Link>
        <div
          className="content-stretch flex font-medium gap-[24px] items-center overflow-clip relative shrink-0 text-[#707a8c] text-[14px]"
          data-node-id="2:6"
          data-name="Links"
        >
          <Link
            to="/"
            className={`relative shrink-0 hover:text-[#2663eb] ${location.pathname === "/" ? "text-[#2663eb] font-semibold" : ""}`}
            data-node-id="2:7"
          >
            Find Jobs
          </Link>
          {currentUser && currentUser.role === "employer" && (
            <>
              <Link
                to="/post-job"
                className={`relative shrink-0 hover:text-[#2663eb] ${location.pathname === "/post-job" ? "text-[#2663eb] font-semibold" : ""}`}
                data-node-id="2:8"
              >
                Post a Job
              </Link>
              <Link
                to="/dashboard"
                className={`relative shrink-0 hover:text-[#2663eb] ${location.pathname === "/dashboard" ? "text-[#2663eb] font-semibold" : ""}`}
                data-node-id="2:9"
              >
                Dashboard
              </Link>
            </>
          )}
        </div>
      </div>
      <div
        className="content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0"
        data-node-id="2:10"
        data-name="UserActions"
      >
        {currentUser ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#707a8c] hidden md:inline-block">
              {currentUser.email} ({currentUser.role})
            </span>
            <button
              onClick={handleLogout}
              className="text-[#707a8c] hover:text-[#db2626] flex items-center gap-1 text-sm font-medium"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
            <div
              className="bg-[#2663eb] content-stretch flex items-center justify-center overflow-clip relative rounded-[999px] shrink-0 size-[32px]"
              data-node-id="2:12"
              data-name="Avatar"
            >
              <p
                className="[word-break:break-word] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap"
                data-node-id="2:13"
              >
                {currentUser.email.substring(0, 2).toUpperCase()}
              </p>
            </div>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-[#2663eb] text-white px-4 py-2 rounded-[10px] text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Login / Register
          </Link>
        )}
      </div>
    </div>
  );
}
