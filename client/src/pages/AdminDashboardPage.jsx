import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PlatformHealthCharts from "../components/admin/PlatformHealthCharts";
import SupportTicketsPanel from "../components/admin/SupportTicketsPanel";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import { adminService, orderService } from "../services/api";

export default function AdminDashboardPage({ activeTab }) {
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userForm, setUserForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "customer",
  });

  const fetchData = async () => {
    try {
      if (activeTab === "dashboard") {
        const metricsData = await adminService.getMetrics();
        setMetrics(metricsData);
      } else if (activeTab === "users") {
        const usersList = await adminService.listUsers();
        setUsers(usersList);
      } else if (activeTab === "tickets") {
        const ticketsList = await adminService.listTickets();
        setTickets(ticketsList);
      }
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleResolveTicket = async (ticketId) => {
    try {
      await adminService.resolveTicket(ticketId);
      alert("Ticket resolved successfully!");
      fetchData();
    } catch (err) {
      alert("Failed to resolve ticket.");
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserForm({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
    });
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    try {
      await adminService.updateUser(selectedUser.id, userForm);
      setIsUserModalOpen(false);
      setSelectedUser(null);
      alert("User updated successfully!");
      fetchData();
    } catch (err) {
      alert("Failed to update user.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await adminService.deleteUser(userId);
      alert("User deleted successfully!");
      fetchData();
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-coral"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {activeTab === "dashboard" && metrics && (
        <div className="space-y-8">
          <PlatformHealthCharts metrics={metrics} />
        </div>
      )}

      {activeTab === "users" && (
        <div className="bg-white rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
            <h3 className="font-headline-md text-on-surface text-base font-bold">
              Manage Users
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-sm text-on-surface">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-surface-container-lowest transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold">
                      {user.full_name}
                    </td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.phone || "N/A"}</td>
                    <td className="px-6 py-4 capitalize">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary-container text-on-secondary-container">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <Button
                        onClick={() => handleEditUser(user)}
                        variant="secondary"
                        className="py-1 px-3 text-xs"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteUser(user.id)}
                        variant="danger"
                        className="py-1 px-3 text-xs"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "tickets" && (
        <SupportTicketsPanel
          tickets={tickets}
          onResolveTicket={handleResolveTicket}
        />
      )}

      {/* Edit User Modal */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title="Edit User Details"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              value={userForm.full_name}
              onChange={(e) =>
                setUserForm({ ...userForm, full_name: e.target.value })
              }
              className="w-full h-11 px-4 rounded-brand border border-outline-variant bg-white focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none font-body-md text-sm text-on-surface transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={userForm.email}
              onChange={(e) =>
                setUserForm({ ...userForm, email: e.target.value })
              }
              className="w-full h-11 px-4 rounded-brand border border-outline-variant bg-white focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none font-body-md text-sm text-on-surface transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">
              Phone Number
            </label>
            <input
              type="text"
              value={userForm.phone}
              onChange={(e) =>
                setUserForm({ ...userForm, phone: e.target.value })
              }
              className="w-full h-11 px-4 rounded-brand border border-outline-variant bg-white focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none font-body-md text-sm text-on-surface transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">
              Role
            </label>
            <select
              value={userForm.role}
              onChange={(e) =>
                setUserForm({ ...userForm, role: e.target.value })
              }
              className="w-full h-11 px-4 rounded-brand border border-outline-variant bg-white focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none font-body-md text-sm text-on-surface transition-colors"
            >
              <option value="customer">Customer</option>
              <option value="restaurant">Restaurant Partner</option>
              <option value="delivery">Delivery Partner</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <Button
            onClick={handleSaveUser}
            variant="primary"
            className="w-full py-3 mt-4"
          >
            Save Changes
          </Button>
        </div>
      </Modal>
    </div>
  );
}

AdminDashboardPage.propTypes = {
  activeTab: PropTypes.string.isRequired,
};
