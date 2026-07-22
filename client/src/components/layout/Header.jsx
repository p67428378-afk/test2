import React from "react";
import { Search, Bell } from "lucide-react";

export default function Header({
  searchQuery,
  onSearchChange,
  alertCount = 0,
  onAlertsClick,
}) {
  return (
    <header className="bg-[#0f1413] fixed top-0 right-0 w-[calc(100%-280px)] h-16 border-b border-[#3d4947] flex justify-between items-center px-8 z-40">
      <div className="flex items-center">
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-[#bcc9c6] w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-[#171d1c] border border-[#3d4947] text-[#dee4e1] text-sm rounded-lg focus:ring-2 focus:ring-[#6bd8cb] focus:border-[#6bd8cb] block w-64 pl-10 p-2 placeholder-[#bcc9c6] transition-all outline-none"
            placeholder="Search equipment..."
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onAlertsClick}
          className="text-[#bcc9c6] hover:bg-[#171d1c] rounded-full p-2 focus:ring-2 focus:ring-[#6bd8cb] transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          {alertCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ffb4ab] rounded-full ring-2 ring-[#0f1413]"></span>
          )}
        </button>
        <div className="w-8 h-8 rounded-full overflow-hidden border border-[#3d4947]">
          <img
            alt="User Profile"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1YTEB67lTU6DShlNzVF-tpdmC0i3p1jjBjSuqvh3ckIwU7DNwIDUt_YQzy_6748FBCoBtcDnFa-1h09wY2-Fsvb1oIhPA3P21-VGDEIdTp6t9A9DEL1Alwtet2ZlkL1ttZI4On3nFmZc5hmJEuriI0TR5JX_dQhVHfUHZv7ymSYWkUSqJDfsOA7YYcouKNgq8DX4PGMAfObXdzf168cokxjVYku6sJRikkyo_0u6w5m9gTTKE1NrS9luDSthPBsreWaKjcbDEt3Ps"
          />
        </div>
      </div>
    </header>
  );
}
