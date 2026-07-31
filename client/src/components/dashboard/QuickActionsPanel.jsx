import React from "react";
import { Plus, UserPlus, BookOpen, Bell } from "lucide-react";

export default function QuickActionsPanel({
  onIssueBook,
  onAddBook,
  onRegisterMember,
  onSendReminders,
}) {
  const actions = [
    {
      label: "Issue Book",
      description: "Checkout a book to a member",
      icon: BookOpen,
      onClick: onIssueBook,
      color:
        "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20",
    },
    {
      label: "Add Book",
      description: "Add a new book to catalog",
      icon: Plus,
      onClick: onAddBook,
      color: "text-sky-400 bg-sky-500/10 border-sky-500/20 hover:bg-sky-500/20",
    },
    {
      label: "Register Member",
      description: "Create a new member account",
      icon: UserPlus,
      onClick: onRegisterMember,
      color:
        "text-purple-400 bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20",
    },
    {
      label: "Send Reminders",
      description: "Send due-date email reminders",
      icon: Bell,
      onClick: onSendReminders,
      color:
        "text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20",
    },
  ];

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <h3 className="font-semibold text-slate-100 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button
              key={idx}
              onClick={action.onClick}
              className={`flex flex-col items-start text-left p-4 rounded-xl border transition-all ${action.color}`}
            >
              <div className="p-2 rounded-lg bg-slate-900/50 mb-3">
                <Icon className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-slate-100 text-sm">
                {action.label}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {action.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
