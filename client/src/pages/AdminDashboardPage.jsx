import React from "react";
import PlatformHealthCharts from "../components/admin/PlatformHealthCharts";
import SupportTicketsPanel from "../components/admin/SupportTicketsPanel";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import Modal from "../components/common/Modal";
import { adminService } from "../services/api";

export default function AdminDashboardPage({ user, activeTab, setActiveTab }) {
  const [metrics, setMetrics] = React.useState(null);
  const [users, setUsers] = React.useState([]);
  const [tickets, setTickets] = React.useState([]);
  const [isUserModalOpen, setIsUserModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);

  // User Edit Form State
  const [userFullName, setUserFullName] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");
  const [userRole, setUserRole] = React.useState("");
  const [userPhone, setUserPhone] = React.useState("");

  React.useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const healthMetrics = await adminService.getMetrics();
      setMetrics(healthMetrics);

      const userList = await adminService.listUsers();
      setUsers(userList);

      const ticketList = await adminService.listTickets();
      setTickets(ticketList);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    }
  };

  const handleEditUser = (u) => {
    setSelectedUser(u);
    setUserFullName(u.full_name);
    setUserEmail(u.email);
    setUserRole(u.role);
    setUserPhone(u.phone || "");
    setIsUserModalOpen(true);
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateUser(selectedUser.id, {
        full_name: userFullName,
        email: userEmail,
        role: userRole,
        phone: userPhone || null,
      });
      setIsUserModalOpen(false);
      fetchAdminData();
    } catch (err) {
      console.error("Failed to update user", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    )
      return;
    try {
      await adminService.deleteUser(userId);
      fetchAdminData();
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const handleCreateTicket = async (ticketData) => {
    await adminService.createTicket(ticketData);
    fetchAdminData();
  };

  const handleResolveTicket = async (ticketId, resolution) => {
    await adminService.resolveTicket(ticketId, resolution);
    fetchAdminData();
  };

  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-coral"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm">
        <h1 className="text-2xl font-black text-on-surface mb-1">
          Platform Administration
        </h1>
        <p className="text-sm text-on-surface-variant">
          Oversee platform health, manage users, and resolve support tickets.
        </p>
      </div>

      {activeTab === "metrics" && <PlatformHealthCharts metrics={metrics} />}

      {activeTab === "users" && (
        <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm space-y-6">
          <h3 className="font-headline-md text-lg font-bold text-on-surface">
            User Management
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-outline-variant text-on-surface-variant font-bold">
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-surface-container-low transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-on-surface">
                      {u.full_name}
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">
                      {u.email}
                    </td>
                    <td className="py-3 px-4 capitalize">
                      <Badge
                        variant={
                          u.role === "admin"
                            ? "danger"
                            : u.role === "restaurant"
                              ? "primary"
                              : "info"
                        }
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">
                      {u.phone || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditUser(u)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteUser(u.id)}
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
          onCreateTicket={handleCreateTicket}
          onResolveTicket={handleResolveTicket}
        />
      )}

      {/* Edit User Modal */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title="Edit User Profile"
      >
        <form onSubmit={handleUserSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={userFullName}
              onChange={(e) => setUserFullName(e.target.value)}
              className="w-full p-2.5 border border-outline-variant rounded-brand text-sm focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full p-2.5 border border-outline-variant rounded-brand text-sm focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1">
              Role
            </label>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="w-full p-2.5 border border-outline-variant rounded-brand text-sm focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none bg-white"
              required
            >
              <option value="customer">Customer</option>
              <option value="restaurant">Restaurant Partner</option>
              <option value="delivery">Delivery Partner</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              className="w-full p-2.5 border border-outline-variant rounded-brand text-sm focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none bg-white"
            />
          </div>
          <Button type="submit" variant="primary" className="w-full">
            Save Changes
          </Button>
        </form>
      </Modal>
    </div>
  );
}
