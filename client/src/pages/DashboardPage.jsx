import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getReviews } from '../services/api';

export default function DashboardPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getReviews();
        setReviews(data);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
        setError("Failed to load dashboard data. Please make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate stats based on reviews
  const totalPRs = reviews.length;
  const openIssues = reviews.reduce((acc, r) => acc + (r.issues_count || 0), 0);
  const passRate = totalPRs > 0 
    ? ((reviews.filter(r => r.status === 'APPROVED').length / totalPRs) * 100).toFixed(1) 
    : '100.0';

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl flex items-center gap-2">
          <span className="material-symbols-outlined">error</span>
          <span className="text-xs font-medium">{error}</span>
        </div>
      )}

      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat 1 */}
        <div className="glass-card p-6 rounded-xl flex flex-col gap-2">
          <span className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider">Total PRs Reviewed</span>
          <div className="flex items-end justify-between">
            <span className="font-sans text-3xl font-bold text-on-surface">{loading ? '...' : totalPRs}</span>
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>+12%</span>
            </div>
          </div>
        </div>
        {/* Stat 2 */}
        <div className="glass-card p-6 rounded-xl flex flex-col gap-2">
          <span className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider">Average Review Time</span>
          <div className="flex items-end justify-between">
            <span className="font-sans text-3xl font-bold text-on-surface">2.4 mins</span>
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span>Target &lt; 5m</span>
            </div>
          </div>
        </div>
        {/* Stat 3 */}
        <div className="glass-card p-6 rounded-xl flex flex-col gap-2">
          <span className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider">Open Issues</span>
          <div className="flex items-end justify-between">
            <span className="font-sans text-3xl font-bold text-on-surface">{loading ? '...' : openIssues}</span>
            <div className="flex flex-col items-end">
              <span className="text-error text-[10px] font-bold">Critical Check</span>
              <span className="text-amber-400 text-[10px] font-bold">OWASP Top 10</span>
            </div>
          </div>
        </div>
        {/* Stat 4 */}
        <div className="glass-card p-6 rounded-xl flex flex-col gap-2">
          <span className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider">Security Pass Rate</span>
          <div className="flex items-end justify-between">
            <span className="font-sans text-3xl font-bold text-on-surface">{loading ? '...' : `${passRate}%`}</span>
            <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
              <span className="material-symbols-outlined text-sm">warning</span>
              <span>Target 100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Charts */}
      <div className="bento-grid">
        {/* Left Chart */}
        <div className="col-span-12 lg:col-span-8 glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-sans text-lg font-bold text-on-surface">Code Quality Trend</h3>
            <div className="flex items-center gap-2 bg-surface-container p-1 rounded-lg">
              <button className="px-3 py-1 text-xs font-semibold rounded bg-primary text-on-primary">6 Sprints</button>
              <button className="px-3 py-1 text-xs font-semibold rounded text-on-surface-variant hover:text-on-surface">12 Sprints</button>
            </div>
          </div>
          {/* Chart Placeholder Visual */}
          <div className="h-[260px] w-full relative overflow-hidden rounded-lg">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 260">
              <defs>
                <linearGradient id="chartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#8083ff" stopOpacity="0.2"></stop>
                  <stop offset="100%" stopColor="#8083ff" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <path d="M0,200 Q100,180 200,190 T400,140 T600,100 T800,40" fill="none" stroke="#8083ff" strokeWidth="3"></path>
              <path d="M0,200 Q100,180 200,190 T400,140 T600,100 T800,40 V260 H0 Z" fill="url(#chartGradient)"></path>
              {/* Dots */}
              <circle cx="200" cy="190" fill="#8083ff" r="4"></circle>
              <circle cx="400" cy="140" fill="#8083ff" r="4"></circle>
              <circle cx="600" cy="100" fill="#8083ff" r="4"></circle>
              <circle cx="800" cy="40" fill="#8083ff" r="4"></circle>
            </svg>
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="border-t border-outline"></div>
              <div className="border-t border-outline"></div>
              <div className="border-t border-outline"></div>
              <div className="border-t border-outline"></div>
            </div>
          </div>
        </div>

        {/* Right Chart */}
        <div className="col-span-12 lg:col-span-4 glass-card rounded-xl p-6 flex flex-col">
          <h3 className="font-sans text-lg font-bold text-on-surface mb-6">Vulnerabilities by Severity</h3>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="w-48 h-48 rounded-full border-[12px] border-secondary-container relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[12px] border-t-error border-r-amber-400 border-b-primary border-l-primary rotate-45"></div>
              <div className="flex flex-col items-center">
                <span className="font-sans text-2xl font-bold text-on-surface">{loading ? '...' : openIssues}</span>
                <span className="text-[10px] text-on-surface-variant uppercase font-bold">Issues Found</span>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
                <span className="text-on-surface-variant">Critical</span>
              </div>
              <span className="text-on-surface font-bold">12%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span className="text-on-surface-variant">Major</span>
              </div>
              <span className="text-on-surface font-bold">38%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                <span className="text-on-surface-variant">Minor</span>
              </div>
              <span className="text-on-surface font-bold">50%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Data Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between">
          <h3 className="font-sans text-lg font-bold text-on-surface">Recent Pull Request Reviews</h3>
          <button className="flex items-center gap-2 text-primary font-semibold text-xs hover:underline transition-all">
            <span>Export CSV</span>
            <span class="material-symbols-outlined text-sm">download</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container/50 text-on-surface-variant font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 border-b border-outline-variant">PR ID</th>
                <th className="px-6 py-4 border-b border-outline-variant">Repository</th>
                <th className="px-6 py-4 border-b border-outline-variant">Status</th>
                <th className="px-6 py-4 border-b border-outline-variant">Issues</th>
                <th className="px-6 py-4 border-b border-outline-variant">Date</th>
                <th className="px-6 py-4 border-b border-outline-variant text-right">Action</th>
              </tr>
            </thead>
            <tbody className="font-sans text-sm text-on-surface divide-y divide-outline-variant">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-on-surface-variant">
                    Loading reviews...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-on-surface-variant">
                    No reviews found.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.review_id} className="hover:bg-surface-variant/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-primary">
                      <Link to={`/reviews/${review.review_id}`} className="hover:underline">
                        #{review.pr_id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">{review.repo_name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-tighter ${
                        review.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-error/10 text-error border-error/20'
                      }`}>
                        {review.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span>{review.issues_count} {review.issues_count === 1 ? 'issue' : 'issues'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {new Date(review.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/reviews/${review.review_id}`} className="text-primary hover:underline text-xs font-semibold">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
