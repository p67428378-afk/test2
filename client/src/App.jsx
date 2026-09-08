import React, { useState } from "react";
import TopNavBar from "./components/layout/TopNavBar";
import DashboardPage from "./pages/DashboardPage";
import ExpensesPage from "./pages/ExpensesPage";
import ExpenseFormModal from "./components/expenses/ExpenseFormModal";
import { createExpense, updateExpense } from "./services/api";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = "success") => {
    setToastMessage({ msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const handleSubmitExpense = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, formData);
        showToast("Expense updated successfully!", "success");
      } else {
        await createExpense(formData);
        showToast("Expense created successfully!", "success");
      }
      handleCloseModal();
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to save expense:", err);
      showToast(
        err.response?.data?.detail ||
          "Failed to save expense. Please check your inputs.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold flex items-center space-x-2 animate-bounce ${
            toastMessage.type === "error"
              ? "bg-red-50 text-red-800 border-red-200"
              : "bg-emerald-50 text-emerald-800 border-emerald-200"
          }`}
        >
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <TopNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={handleOpenAddModal}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" ? (
          <DashboardPage
            onOpenAddModal={handleOpenAddModal}
            onEditExpense={handleOpenEditModal}
            key={`dashboard-${refreshTrigger}`}
          />
        ) : (
          <ExpensesPage
            onOpenAddModal={handleOpenAddModal}
            onEditExpense={handleOpenEditModal}
            refreshTrigger={refreshTrigger}
          />
        )}
      </main>

      {/* Add / Edit Expense Modal */}
      <ExpenseFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitExpense}
        initialData={editingExpense}
        isSubmitting={isSubmitting}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          ExpenseTracker Application &copy; 2026 &bull; Personal Finance
          Dashboard
        </div>
      </footer>
    </div>
  );
}
