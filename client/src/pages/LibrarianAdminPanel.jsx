import React, { useState, useEffect } from "react";
import AddBookForm from "../components/admin/AddBookForm";
import BookInventoryTable from "../components/admin/BookInventoryTable";
import { bookService, loanService } from "../services/api";

export default function LibrarianAdminPanel() {
  const [books, setBooks] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSubTab, setActiveTab] = useState("inventory"); // inventory, add-book, all-loans

  const fetchData = async () => {
    setLoading(true);
    try {
      const [booksData, loansData] = await Promise.all([
        bookService.getBooks(),
        loanService.getAllLoans(),
      ]);
      setBooks(booksData);
      setLoans(loansData);
    } catch (err) {
      setError("Failed to fetch admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddBook = async (bookData) => {
    await bookService.addBook(bookData);
    fetchData();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-stack-xs">
          Librarian Admin Panel
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Manage library inventory and monitor active loans
        </p>
      </div>

      {error && (
        <div className="p-4 bg-error/10 text-error rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex border-b border-outline-variant">
        <button
          onClick={() => setActiveTab("inventory")}
          className={`py-2.5 px-4 font-medium text-sm border-b-2 transition-colors ${
            activeSubTab === "inventory"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Book Inventory
        </button>
        <button
          onClick={() => setActiveTab("add-book")}
          className={`py-2.5 px-4 font-medium text-sm border-b-2 transition-colors ${
            activeSubTab === "add-book"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Add New Book
        </button>
        <button
          onClick={() => setActiveTab("all-loans")}
          className={`py-2.5 px-4 font-medium text-sm border-b-2 transition-colors ${
            activeSubTab === "all-loans"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          All Active Loans
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {activeSubTab === "inventory" && <BookInventoryTable books={books} />}
          {activeSubTab === "add-book" && (
            <AddBookForm onAddBook={handleAddBook} />
          )}
          {activeSubTab === "all-loans" && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-outline-variant">
                  <thead className="bg-surface-container-low">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                        Book Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                        Borrower
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                        Borrowed At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                        Fine
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-outline-variant">
                    {loans.map((loan) => {
                      const isOverdue = loan.status === "overdue";
                      const isReturned = loan.status === "returned";

                      return (
                        <tr
                          key={loan.id}
                          className="hover:bg-surface-container-low/30 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">
                            {loan.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                            {loan.username}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                            {new Date(loan.borrowed_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                            {new Date(loan.due_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {isReturned ? (
                              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-tertiary-container/10 text-tertiary-container">
                                Returned
                              </span>
                            ) : isOverdue ? (
                              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-error/10 text-error">
                                Overdue
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-container/10 text-primary-container">
                                Active
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">
                            {loan.fine_amount > 0 ? (
                              <span className="text-error">
                                ${loan.fine_amount.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-tertiary-container">
                                $0.00
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
