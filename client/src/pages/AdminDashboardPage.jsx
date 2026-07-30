import React, { useState, useEffect } from "react";
import { userService, donationService } from "../services/api";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Badge from "../components/Badge";
import Button from "../components/Button";
import { Users, Package, ShieldAlert } from "lucide-react";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersData, donationsData] = await Promise.all([
        userService.listUsers(),
        donationService.listDonations(),
      ]);
      setUsers(usersData);
      setDonations(donationsData);
    } catch (err) {
      setError("Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleActive = async (user) => {
    try {
      await userService.updateUser(user.id, {
        full_name: user.full_name,
        address: user.address,
        phone_number: user.phone_number,
        is_active: !user.is_active,
      });
      fetchData();
    } catch (err) {
      setError("Failed to update user status.");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[280px] w-[calc(100%-280px)] overflow-hidden">
        <Header title="Admin Dashboard" />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1440px] mx-auto space-y-8">
            {error && (
              <div
                className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col shadow-sm">
                <span className="text-xs font-bold text-slate-500 uppercase mb-2">
                  Total Users
                </span>
                <span className="text-3xl font-bold text-slate-800">
                  {users.length}
                </span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col shadow-sm">
                <span className="text-xs font-bold text-slate-500 uppercase mb-2">
                  Total Donations
                </span>
                <span className="text-3xl font-bold text-slate-800">
                  {donations.length}
                </span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col shadow-sm">
                <span className="text-xs font-bold text-slate-500 uppercase mb-2">
                  Active Listings
                </span>
                <span className="text-3xl font-bold text-slate-800">
                  {donations.filter((d) => d.status === "available").length}
                </span>
              </div>
            </div>

            {/* Users Management Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-200 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-800" />
                <h3 className="text-lg font-bold text-slate-800">
                  User Management
                </h3>
              </div>
              {loading ? (
                <div className="p-6 text-center text-slate-500">
                  Loading users...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                          Name
                        </th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                          Email
                        </th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                          Role
                        </th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                      {users.map((u) => (
                        <tr
                          key={u.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-slate-900">
                            {u.full_name}
                          </td>
                          <td className="px-6 py-4">{u.email}</td>
                          <td className="px-6 py-4 capitalize">{u.role}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${u.is_active ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}
                            >
                              {u.is_active ? "ACTIVE" : "INACTIVE"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              onClick={() => handleToggleActive(u)}
                              variant={u.is_active ? "danger" : "primary"}
                              className="text-xs py-1 px-2.5"
                            >
                              {u.is_active ? "Deactivate" : "Activate"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Donations Overview Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-200 flex items-center gap-2">
                <Package className="w-5 h-5 text-slate-800" />
                <h3 className="text-lg font-bold text-slate-800">
                  Donations Overview
                </h3>
              </div>
              {loading ? (
                <div className="p-6 text-center text-slate-500">
                  Loading donations...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                          Description
                        </th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                          Restaurant
                        </th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                      {donations.map((d) => (
                        <tr
                          key={d.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-slate-900">
                            {d.description}
                          </td>
                          <td className="px-6 py-4">{d.restaurant_name}</td>
                          <td className="px-6 py-4">{d.quantity}</td>
                          <td className="px-6 py-4">
                            <Badge status={d.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
