import React from "react";

export default function ExpenseTable({ expenses, onEdit, onDelete }) {
  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
      <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="font-headline-md text-headline-md text-on-surface">
          Recent Expenses
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left font-body-sm">
          <thead className="bg-background/50 border-b border-outline-variant text-on-surface-variant font-label-md text-label-md uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 font-semibold tracking-wider">Amount</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Date</th>
              <th className="px-6 py-4 font-semibold tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 font-semibold tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {expenses.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-8 text-center text-on-surface-variant"
                >
                  No expenses found. Add your first expense!
                </td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="hover:bg-surface-container-high transition-colors group"
                >
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-on-surface font-numeric-data font-semibold">
                    ${Number(expense.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant font-numeric-data">
                    {expense.expense_date}
                  </td>
                  <td
                    className="px-6 py-4 text-on-surface truncate max-w-xs"
                    title={expense.description}
                  >
                    {expense.description || "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(expense)}
                        className="text-on-surface-variant hover:text-primary transition-colors p-1"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          edit
                        </span>
                      </button>
                      <button
                        onClick={() => onDelete(expense.id)}
                        className="text-on-surface-variant hover:text-error transition-colors p-1"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
