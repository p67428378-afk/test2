import React from "react";
import ExpenseEntryForm from "../components/expenses/ExpenseEntryForm";

export const ExpenseEntryPage = ({ selectedGroup, onExpenseCreated }) => {
  if (!selectedGroup) {
    return (
      <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center max-w-lg mx-auto my-12">
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          No Group Selected
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Please select a group before adding an expense.
        </p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <ExpenseEntryForm
        group={selectedGroup}
        onExpenseCreated={onExpenseCreated}
      />
    </div>
  );
};

export default ExpenseEntryPage;
