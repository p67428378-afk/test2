import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { getGroups } from "../services/api";
import ExpenseForm from "../components/expenses/ExpenseForm";
import { ChevronRight, Loader2, AlertCircle, Plus, Users } from "lucide-react";

export default function ExpenseEntryPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedGroupId = searchParams.get("groupId") || "";

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successExpense, setSuccessExpense] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getGroups();
        setGroups(data || []);
      } catch (err) {
        setError(
          "Failed to load groups. Please ensure the backend is available.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleExpenseSuccess = (created) => {
    setSuccessExpense(created);
    setTimeout(() => {
      navigate(`/groups/${created.group_id}`);
    }, 1200);
  };

  const handleCancel = () => {
    if (preselectedGroupId) {
      navigate(`/groups/${preselectedGroupId}`);
    } else {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 bg-white border border-[#E3E8F0] rounded-xl">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
        <p className="text-sm text-[#707A8C]">Loading groups and members...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-red-800">
              Connection Error
            </h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white border border-[#E3E8F0] rounded-xl shadow-sm">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
          <Users className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-[#171C29]">No Groups Found</h2>
        <p className="text-sm text-[#707A8C] mt-1 max-w-sm mx-auto">
          You need at least one group before recording shared expenses.
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Create a Group First
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-[#707A8C]">
        <Link to="/" className="hover:text-blue-600 font-medium">
          Groups
        </Link>
        {preselectedGroupId && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link
              to={`/groups/${preselectedGroupId}`}
              className="hover:text-blue-600 font-medium"
            >
              {groups.find((g) => g.id === preselectedGroupId)?.name ||
                "Group Details"}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-semibold text-[#171C29]">Record Expense</span>
      </nav>

      {/* Success Notification */}
      {successExpense && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm flex items-center justify-between">
          <p className="font-semibold">
            ✅ Expense &quot;{successExpense.title}&quot; recorded successfully!
            Redirecting...
          </p>
        </div>
      )}

      {/* Expense Form Component */}
      <ExpenseForm
        groups={groups}
        selectedGroupId={preselectedGroupId || groups[0]?.id}
        onSuccess={handleExpenseSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}
