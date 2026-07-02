import React from "react";
import Badge from "../common/Badge";
import { Phone, UserPlus } from "lucide-react";

export default function AgentTable({ agents, onAddAgent }) {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [fullName, setFullName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [isSubmitting, setIsLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onAddAgent({ full_name: fullName, phone_number: phoneNumber });
      setFullName("");
      setPhoneNumber("");
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800 text-lg">Delivery Agents</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          {showAddForm ? "Cancel" : "Add Agent"}
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-md space-y-4"
        >
          <h4 className="font-bold text-gray-800 text-sm border-b border-gray-100 pb-2">
            New Agent Registration
          </h4>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Agent Full Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Phone Number
            </label>
            <input
              type="text"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 019-9999"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Registering..." : "Register Agent"}
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Agent Name</th>
                <th className="px-6 py-3">Phone Number</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Active Shipments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white text-gray-700">
              {agents.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-10 text-center text-gray-400"
                  >
                    No delivery agents registered yet.
                  </td>
                </tr>
              ) : (
                agents.map((agent) => (
                  <tr
                    key={agent.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">{agent.full_name}</td>
                    <td className="px-6 py-4 font-mono text-gray-500 flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-gray-400" />
                      {agent.phone_number}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={agent.status} />
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {agent.active_shipments_count}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
