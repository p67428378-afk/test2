import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { bookService, patronService, reportService } from "../services/api";
import {
  Book,
  Users,
  ArrowUpRight,
  AlertCircle,
  TrendingUp,
  Info,
} from "lucide-react";

const DashboardPage = () => {
  const [stats, setStats] = React.useState({
    totalBooks: 0,
    activePatrons: 0,
    activeLoans: 0,
    overdueLoans: 0,
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [books, patrons, report] = await Promise.all([
        bookService.getBooks(),
        patronService.getPatrons(),
        reportService.getCirculationReport(),
      ]);

      setStats({
        totalBooks: books.length,
        activePatrons: patrons.length,
        activeLoans: report.active_loans || 0,
        overdueLoans: report.overdue_loans || 0,
      });
    } catch (err) {
      console.error("Error fetching dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="p-8 mt-16 max-w-7xl mx-auto space-y-8">
          {/* Page Title */}
          <div>
            <h2 className="text-2xl font-bold text-white">
              Dashboard Overview
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Real-time library metrics and activity.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-6 h-32 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Books */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col justify-between border-t-2 border-t-indigo-500 shadow-sm relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Total Books
                    </p>
                    <Book className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white">
                      {stats.totalBooks}
                    </h3>
                    <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> +1.2% this week
                    </p>
                  </div>
                </div>

                {/* Active Patrons */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col justify-between border-t-2 border-t-indigo-500 shadow-sm relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Active Patrons
                    </p>
                    <Users className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white">
                      {stats.activePatrons}
                    </h3>
                    <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> +4.5% this week
                    </p>
                  </div>
                </div>

                {/* Books Checked Out */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col justify-between border-t-2 border-t-indigo-500 shadow-sm relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Books Checked Out
                    </p>
                    <ArrowUpRight className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white">
                      {stats.activeLoans}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" /> Active loans
                    </p>
                  </div>
                </div>

                {/* Overdue Books */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col justify-between border-t-2 border-t-red-500 shadow-sm relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Overdue Books
                    </p>
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-red-400">
                      {stats.overdueLoans}
                    </h3>
                    <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Action required
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 2: Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Chart (8-col) */}
                <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-white">
                      Circulation Activity
                    </h3>
                    <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                      Last 6 Months
                    </span>
                  </div>
                  <div className="h-64 flex items-end justify-between gap-4 pt-4 border-b border-slate-800 relative">
                    <div className="w-full flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full max-w-[40px] h-[40%] bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t opacity-80 hover:opacity-100 transition-opacity" />
                      <span className="text-xs text-slate-500">Dec</span>
                    </div>
                    <div className="w-full flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full max-w-[40px] h-[55%] bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t opacity-80 hover:opacity-100 transition-opacity" />
                      <span className="text-xs text-slate-500">Jan</span>
                    </div>
                    <div className="w-full flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full max-w-[40px] h-[45%] bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t opacity-80 hover:opacity-100 transition-opacity" />
                      <span className="text-xs text-slate-500">Feb</span>
                    </div>
                    <div className="w-full flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full max-w-[40px] h-[70%] bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t opacity-80 hover:opacity-100 transition-opacity" />
                      <span className="text-xs text-slate-500">Mar</span>
                    </div>
                    <div className="w-full flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full max-w-[40px] h-[60%] bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t opacity-80 hover:opacity-100 transition-opacity" />
                      <span className="text-xs text-slate-500">Apr</span>
                    </div>
                    <div className="w-full flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full max-w-[40px] h-[85%] bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t opacity-80 hover:opacity-100 transition-opacity" />
                      <span className="text-xs text-slate-500">May</span>
                    </div>
                  </div>
                </div>

                {/* Right Chart (4-col) */}
                <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-sm flex flex-col">
                  <h3 className="font-semibold text-white mb-6">
                    Collection by Category
                  </h3>
                  <div className="flex-1 flex flex-col items-center justify-center relative min-h-[200px]">
                    <svg
                      className="w-40 h-48 transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        fill="transparent"
                        r="40"
                        stroke="#1e293b"
                        strokeWidth="20"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        fill="transparent"
                        r="40"
                        stroke="#6366f1"
                        strokeWidth="20"
                        strokeDasharray="100.5 251.2"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        fill="transparent"
                        r="40"
                        stroke="#4f46e5"
                        strokeWidth="20"
                        strokeDasharray="62.8 251.2"
                        strokeDashoffset="-100.5"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        fill="transparent"
                        r="40"
                        stroke="#4338ca"
                        strokeWidth="20"
                        strokeDasharray="37.6 251.2"
                        strokeDashoffset="-163.3"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="font-semibold text-white">Total</span>
                      <span className="text-xs text-slate-400">100%</span>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#6366f1]" />
                      <span>Fiction (40%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#4f46e5]" />
                      <span>Science (25%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#4338ca]" />
                      <span>History (15%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
