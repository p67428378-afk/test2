import React, { useState, useEffect } from "react";
import ActiveLoansTable from "../components/loans/ActiveLoansTable";
import { loanService } from "../services/api";

export default function MyLoansPage({ user }) {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const data = await loanService.getMyLoans();
      setLoans(data);
    } catch (err) {
      setError("Failed to fetch your loans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchLoans();
    }
  }, [user]);

  const handleReturn = async (bookCopyId) => {
    setError("");
    setSuccess("");
    try {
      await loanService.returnBook(bookCopyId);
      setSuccess("Book returned successfully!");
      fetchLoans();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to return book.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-stack-xs">
          My Loans
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Manage your borrowed books and track due dates
        </p>
      </div>

      {error && (
        <div className="p-4 bg-error/10 text-error rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-tertiary-container/10 text-tertiary-container rounded-lg text-sm font-medium">
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ActiveLoansTable loans={loans} onReturn={handleReturn} />
      )}
    </div>
  );
}
