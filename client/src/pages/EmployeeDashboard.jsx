import React, { useState, useEffect } from "react";
import { leaveService, authService } from "../services/api";
import LeaveBalanceCard from "../components/leave/LeaveBalanceCard";
import MyRequestsTable from "../components/leave/MyRequestsTable";
import ApplyLeaveForm from "../components/leave/ApplyLeaveForm";

export default function EmployeeDashboard() {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const [profileData, requestsData] = await Promise.all([
        authService.getMe(),
        leaveService.getMyRequests(),
      ]);
      setUser(profileData);
      setRequests(requestsData);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApplyLeave = async (formData) => {
    setIsSubmitting(true);
    setError("");
    try {
      await leaveService.applyLeave(
        formData.leave_type,
        formData.start_date,
        formData.end_date,
        formData.reason,
      );
      // Refresh data
      await fetchData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to submit leave request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-body-lg font-body-lg text-secondary">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="p-margin-page flex-1 max-w-[1440px] mx-auto w-full">
      {error && (
        <div
          className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg text-body-md font-body-md"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Row 1: Balance Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-8">
        <LeaveBalanceCard
          title="Vacation"
          balance={user ? user.leave_balance : 0}
          maxBalance={20}
          icon="beach_access"
          colorClass="bg-surface-container text-primary"
          progressColor="bg-primary-container"
        />
        <LeaveBalanceCard
          title="Sick Leave"
          balance={10} // Static or dynamic if backend supports multiple balances
          maxBalance={10}
          icon="medical_services"
          colorClass="bg-secondary-container text-[#2563EB]"
          progressColor="bg-[#3B82F6]"
        />
        <LeaveBalanceCard
          title="Personal"
          balance={5}
          maxBalance={5}
          icon="person"
          colorClass="bg-[#FEF3C7] text-[#D97706]"
          progressColor="bg-[#F59E0B]"
        />
      </section>

      {/* Row 2: Grid Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column (8-col): Requests Table */}
        <div className="lg:col-span-8">
          <MyRequestsTable requests={requests} />
        </div>
        {/* Right Column (4-col): Apply Form */}
        <div className="lg:col-span-4">
          <ApplyLeaveForm
            onSubmit={handleApplyLeave}
            isSubmitting={isSubmitting}
          />
        </div>
      </section>
    </div>
  );
}
