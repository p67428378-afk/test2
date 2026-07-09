import React, { useState, useEffect } from "react";
import AppLayout from "../components/layout/AppLayout";
import ExpenseTable from "../components/expenses/ExpenseTable";
import ExpenseForm from "../components/expenses/ExpenseForm";
import { expenseService } from "../services/api";

export default function DashboardPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await expenseService.list();
      setExpenses(data);
    } catch (err) {
      setError("Failed to load expenses. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await expenseService.delete(id);
        fetchExpenses();
      } catch (err) {
        setError("Failed to delete expense.");
        console.error(err);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingExpense) {
        await expenseService.update(editingExpense.id, formData);
      } else {
        await expenseService.create(formData);
      }
      setShowForm(false);
      setEditingExpense(null);
      fetchExpenses();
    } catch (err) {
      setError("Failed to save expense. Please check your inputs.");
      console.error(err);
    }
  };

  // Calculate stats
  const totalExpenses = expenses.reduce(
    (sum, exp) => sum + Number(expense.amount || exp.amount || 0),
    0,
  );
  const foodExpenses = expenses
    .filter((exp) => exp.category === "Food")
    .reduce((sum, exp) => sum + Number(exp.amount), 0);
  const transportExpenses = expenses
    .filter((exp) => exp.category === "Transport")
    .reduce((sum, exp) => sum + Number(exp.amount), 0);

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            Dashboard
          </h1>
          <p className="text-on-surface-variant mt-1 font-body-lg text-body-lg">
            Overview of your financial health.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={handleAddExpense}
            className="bg-primary-container text-on-primary-container font-label-md text-label-md px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>+
            Add Expense
          </button>
        )}
      </div>

      {error && (
        <div className="bg-error-container/20 border border-error text-error p-4 rounded-xl mb-6 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-sm underline">
            Dismiss
          </button>
        </div>
      )}

      {showForm ? (
        <div className="mb-8">
          <ExpenseForm
            expense={editingExpense}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingExpense(null);
            }}
          />
        </div>
      ) : (
        <>
          {/* Row 1: Stat Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-card-gap mb-8">
            {/* Stat Card 1 */}
            <div className="bg-surface-container border border-outline-variant rounded-xl p-6 relative overflow-hidden group hover:border-primary transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-background rounded-lg border border-outline-variant">
                  <span className="material-symbols-outlined text-primary">
                    account_balance_wallet
                  </span>
                </div>
              </div>
              <div className="text-on-surface-variant font-body-sm text-body-sm mb-1">
                Total Expenses
              </div>
              <div className="font-headline-lg text-headline-lg text-on-surface font-numeric-data">
                ${totalExpenses.toFixed(2)}
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-surface-container border border-outline-variant rounded-xl p-6 relative overflow-hidden group hover:border-primary transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-background rounded-lg border border-outline-variant">
                  <span className="material-symbols-outlined text-secondary">
                    restaurant
                  </span>
                </div>
              </div>
              <div className="text-on-surface-variant font-body-sm text-body-sm mb-1">
                Food & Dining
              </div>
              <div className="flex items-end gap-3">
                <div className="font-headline-lg text-headline-lg text-on-surface font-numeric-data">
                  ${foodExpenses.toFixed(2)}
                </div>
                <div className="font-label-md text-label-md text-secondary mb-2">
                  {totalExpenses > 0
                    ? ((foodExpenses / totalExpenses) * 100).toFixed(0)
                    : 0}
                  % of total
                </div>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-surface-container border border-outline-variant rounded-xl p-6 relative overflow-hidden group hover:border-primary transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-background rounded-lg border border-outline-variant">
                  <span className="material-symbols-outlined text-secondary">
                    directions_car
                  </span>
                </div>
              </div>
              <div className="text-on-surface-variant font-body-sm text-body-sm mb-1">
                Transport
              </div>
              <div className="flex items-end gap-3">
                <div className="font-headline-lg text-headline-lg text-on-surface font-numeric-data">
                  ${transportExpenses.toFixed(2)}
                </div>
                <div className="font-label-md text-label-md text-secondary mb-2">
                  {totalExpenses > 0
                    ? ((transportExpenses / totalExpenses) * 100).toFixed(0)
                    : 0}
                  % of total
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Transactions */}
          {loading ? (
            <div className="text-center py-12 text-on-surface-variant">
              Loading expenses...
            </div>
          ) : (
            <ExpenseTable
              expenses={expenses}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          )}
        </>
      )}
    </AppLayout>
  );
}
