import React from "react";
import { Search, Bell, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../main";

const Header = ({
  onSearchChange,
  searchPlaceholder = "Search catalog, patrons...",
}) => {
  const { logout } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-slate-900 text-slate-300 h-16 fixed top-0 right-0 left-64 border-b border-slate-800 flex items-center justify-between px-8 z-40">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3 text-slate-500" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-indigo-500 transition-colors text-sm placeholder-slate-500"
          />
        </div>
      </div>

      {/* Trailing Actions */}
      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800">
          <Bell className="w-5 h-5" />
        </button>
        <button
          onClick={handleLogout}
          className="text-slate-400 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-slate-800"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
