import React from "react";
import { Users, Mail, Phone, Trash2, MapPin, Shield } from "lucide-react";

export default function TeamTable({ teams = [], loading, onDeleteTeam }) {
  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg border border-stone-200 text-center text-stone-500">
        Loading excavation teams...
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg border border-stone-200 text-center text-stone-500">
        No excavation teams registered.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {teams.map((team) => (
        <div
          key={team.id}
          className="bg-white rounded-lg border border-stone-200 shadow-sm p-5"
        >
          <div className="flex justify-between items-start border-b border-stone-100 pb-3 mb-3">
            <div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-amber-800" />
                <h4 className="text-base font-bold text-stone-900">
                  {team.team_name}
                </h4>
              </div>
              {team.site_id && (
                <div className="flex items-center space-x-1 text-xs text-stone-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-800" />
                  <span>Assigned Site ID: {team.site_id}</span>
                </div>
              )}
            </div>
            {onDeleteTeam && (
              <button
                onClick={() => onDeleteTeam(team.id)}
                title="Delete Team"
                className="p-1 text-stone-400 hover:text-red-600 rounded transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
            Team Members ({team.members ? team.members.length : 0})
          </div>

          {team.members && team.members.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {team.members.map((member) => (
                <div
                  key={member.id}
                  className="bg-stone-50 p-3 rounded border border-stone-200 text-xs space-y-1"
                >
                  <div className="font-bold text-stone-900">
                    {member.full_name}
                  </div>
                  <div className="flex items-center space-x-1 text-amber-800 font-medium">
                    <Shield className="w-3 h-3" />
                    <span>{member.role}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-stone-600">
                    <Mail className="w-3 h-3 text-stone-400" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center space-x-1 text-stone-500">
                      <Phone className="w-3 h-3 text-stone-400" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-400 italic">
              No members assigned to this team yet.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
