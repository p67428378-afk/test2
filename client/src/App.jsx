import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import GroupDashboardPage from "./pages/GroupDashboardPage";
import ExpenseEntryPage from "./pages/ExpenseEntryPage";
import SettlementLedgerPage from "./pages/SettlementLedgerPage";
import {
  getGroups,
  createGroup,
  addGroupMember,
  getGroup,
} from "./services/api";
import { RefreshCw } from "lucide-react";

export function App() {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const initGroups = async () => {
    setLoading(true);
    setError("");
    try {
      let list = await getGroups();

      // If no groups exist in the database, automatically seed a default group
      if (!list || list.length === 0) {
        try {
          const newGroup = await createGroup({
            name: "Summer Vacation 2026",
            description: "Group expenses for trip to Cancun",
          });
          // Add default members: User A, User B, User C
          await addGroupMember(newGroup.id, {
            name: "User A",
            email: "usera@example.com",
          });
          await addGroupMember(newGroup.id, {
            name: "User B",
            email: "userb@example.com",
          });
          await addGroupMember(newGroup.id, {
            name: "User C",
            email: "userc@example.com",
          });

          list = await getGroups();
        } catch (seedErr) {
          console.error("Failed auto-seeding group:", seedErr);
        }
      }

      setGroups(list || []);
      if (list && list.length > 0) {
        // Fetch full details (with members) for the selected group
        const fullGroup = await getGroup(list[0].id);
        setSelectedGroupId(fullGroup.id);
        setGroups((prev) =>
          prev.map((g) => (g.id === fullGroup.id ? fullGroup : g)),
        );
      }
    } catch (err) {
      console.error("Failed loading groups:", err);
      setError("Could not connect to backend server or load expense groups.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initGroups();
  }, []);

  const handleSelectGroup = async (groupId) => {
    setSelectedGroupId(groupId);
    try {
      const fullGroup = await getGroup(groupId);
      setGroups((prev) => prev.map((g) => (g.id === groupId ? fullGroup : g)));
    } catch (err) {
      console.error("Failed to load group details:", err);
    }
  };

  const handleCreateGroup = async (groupData) => {
    const newGroup = await createGroup(groupData);
    // Add default member to new group
    await addGroupMember(newGroup.id, {
      name: "User A",
      email: "usera@example.com",
    });
    await addGroupMember(newGroup.id, {
      name: "User B",
      email: "userb@example.com",
    });

    const refreshed = await getGroups();
    setGroups(refreshed || []);
    const full = await getGroup(newGroup.id);
    setSelectedGroupId(full.id);
  };

  const handleReloadSelectedGroup = async () => {
    if (selectedGroupId) {
      try {
        const full = await getGroup(selectedGroupId);
        setGroups((prev) =>
          prev.map((g) => (g.id === selectedGroupId ? full : g)),
        );
      } catch (err) {
        console.error("Failed reloading group:", err);
      }
    }
  };

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <RefreshCw className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">
            Loading Shared Bill Splitter
          </h2>
          <p className="text-xs text-slate-500">
            Connecting to API server and fetching expense groups...
          </p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppLayout
        groups={groups}
        selectedGroupId={selectedGroupId}
        onSelectGroup={handleSelectGroup}
        onCreateGroup={handleCreateGroup}
      >
        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <Routes>
          <Route
            path="/"
            element={
              <GroupDashboardPage
                selectedGroup={selectedGroup}
                onReloadGroup={handleReloadSelectedGroup}
              />
            }
          />
          <Route
            path="/expense/new"
            element={
              <ExpenseEntryPage
                selectedGroup={selectedGroup}
                onExpenseCreated={handleReloadSelectedGroup}
              />
            }
          />
          <Route
            path="/settlements"
            element={<SettlementLedgerPage selectedGroup={selectedGroup} />}
          />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
