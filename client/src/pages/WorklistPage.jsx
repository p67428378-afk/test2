import React, { useState, useEffect, useCallback } from "react";
import KPIGrid from "../components/worklist/KPIGrid.jsx";
import RefreshControls from "../components/worklist/RefreshControls.jsx";
import WorklistTable from "../components/worklist/WorklistTable.jsx";
import { worklistService } from "../services/api.js";

export default function WorklistPage({ searchQuery }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [skip, setSkip] = useState(0);
  const [limit] = useState(5); // Show 5 items per page to match Stitch design
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchWorklist = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await worklistService.getWorklist({ skip, limit });
      setItems(data.items || []);
      setTotal(data.total || 0);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch worklist items.");
    } finally {
      setLoading(false);
    }
  }, [skip, limit]);

  useEffect(() => {
    fetchWorklist();
  }, [fetchWorklist]);

  const handleCreateItem = async (title, status) => {
    const newItem = await worklistService.createWorklistItem(title, status);
    // Refresh the list after creation
    await fetchWorklist();
    return newItem;
  };

  // Filter items locally based on search query and status filter
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filter === "all" ||
      item.status?.toLowerCase() === filter.toLowerCase() ||
      (filter === "in_progress" &&
        item.status?.toLowerCase() === "in progress");

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Page Header */}
      <div className="mb-space-xl flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            My Worklist
          </h2>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            Manage and track your operational tasks
          </p>
        </div>
        <RefreshControls
          onRefresh={fetchWorklist}
          lastUpdated={lastUpdated}
          loading={loading}
        />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl border border-error/20 flex items-center gap-3">
          <span
            className="material-symbols-outlined text-error"
            data-icon="error"
          >
            error
          </span>
          <span className="text-body-md font-medium">{error}</span>
        </div>
      )}

      {/* KPI Grid */}
      <KPIGrid items={items} total={total} />

      {/* Worklist Table */}
      <WorklistTable
        items={filteredItems}
        total={total}
        loading={loading}
        filter={filter}
        setFilter={setFilter}
        skip={skip}
        setSkip={setSkip}
        limit={limit}
        onCreateItem={handleCreateItem}
      />

      {/* Bento Layout Extra: Performance & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mt-space-xl pb-space-xl">
        <div className="lg:col-span-2 bg-white rounded-xl border border-outline-variant p-space-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-headline-md text-headline-md">
              Processing Volume
            </h4>
            <div className="flex gap-2">
              <button className="text-xs font-semibold px-3 py-1 bg-surface-container-high rounded-full cursor-pointer">
                Weekly
              </button>
              <button className="text-xs font-semibold px-3 py-1 text-on-surface-variant cursor-pointer">
                Monthly
              </button>
            </div>
          </div>
          {/* Mock chart area */}
          <div className="h-48 w-full flex items-end justify-between gap-2 px-4">
            <div
              className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary"
              style={{ height: "40%" }}
            ></div>
            <div
              className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary"
              style={{ height: "65%" }}
            ></div>
            <div
              className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary"
              style={{ height: "45%" }}
            ></div>
            <div
              className="w-full bg-primary rounded-t-lg transition-all"
              style={{ height: "85%" }}
            ></div>
            <div
              className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary"
              style={{ height: "60%" }}
            ></div>
            <div
              className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary"
              style={{ height: "70%" }}
            ></div>
            <div
              className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary"
              style={{ height: "55%" }}
            ></div>
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-on-surface-variant font-bold uppercase tracking-widest px-4">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
        <div className="bg-primary-container text-white rounded-xl p-space-lg shadow-lg relative overflow-hidden flex flex-col justify-between">
          {/* Glassmorphism effect */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <span
              className="material-symbols-outlined text-4xl mb-4"
              data-icon="auto_awesome"
            >
              auto_awesome
            </span>
            <h4 className="font-headline-md text-headline-md mb-2">
              Smart Allocation
            </h4>
            <p className="text-white/80 font-body-md text-body-md">
              AI suggests focusing on{" "}
              <span className="font-bold text-white">#WL-8492</span> based on
              due date and complexity.
            </p>
          </div>
          <button className="relative z-10 w-full mt-6 py-3 bg-white text-primary font-bold rounded-lg hover:bg-surface-container-lowest transition-colors cursor-pointer">
            View Recommendation
          </button>
        </div>
      </div>
    </div>
  );
}
