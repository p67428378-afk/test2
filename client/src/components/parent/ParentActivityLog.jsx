import React from "react";
import { Activity, Clock, Award, CheckCircle } from "lucide-react";

export default function ParentActivityLog({
  completedHabitIds = [],
  habits = [],
}) {
  // Mock activity entries based on completed habits
  const completedHabitList = habits.filter((h) =>
    completedHabitIds.includes(h.id),
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-400" />
            <span>Child Daily Activity Log</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time record of habit completions and quiz progress for parental
            oversight.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl">
          {completedHabitList.length} Entries Today
        </span>
      </div>

      {completedHabitList.length === 0 ? (
        <div className="p-8 bg-slate-800/40 border border-slate-800 rounded-2xl text-center text-slate-400">
          <Clock className="h-8 w-8 text-slate-500 mx-auto mb-2" />
          <p className="font-semibold text-xs text-slate-300">
            No habit completions logged today yet.
          </p>
          <p className="text-[11px] mt-1 text-slate-500">
            Encourage your child to mark completed daily habit cards on the
            dashboard!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Habit Quest</th>
                <th className="py-3 px-4">Points Earned</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {completedHabitList.map((habit) => (
                <tr
                  key={habit.id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase">
                      {habit.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-200">
                    {habit.title}
                  </td>
                  <td className="py-3 px-4 text-amber-400 font-bold flex items-center gap-1">
                    <Award className="h-3.5 w-3.5" />+{habit.points_value || 10}{" "}
                    pts
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Completed Today
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
