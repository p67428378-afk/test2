import React, { useState, useEffect } from "react";
import StatCard from "../components/dashboard/StatCard.jsx";
import QuickActionsPanel from "../components/dashboard/QuickActionsPanel.jsx";
import ActiveLoansTable from "../components/dashboard/ActiveLoansTable.jsx";
import OverdueFinesTable from "../components/dashboard/OverdueFinesTable.jsx";
import Modal from "../components/common/Modal.jsx";
import Button from "../components/common/Button.jsx";
import {
  bookService,
  memberService,
  loanService,
  fineService,
} from "../services/api.js";
import { BookOpen, Users, FileText, DollarSign } from "lucide-react";

export default function LibrarianDashboard() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Form states
  const [selectedBookId, setSelectedBookId] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "",
    publication_year: "",
    total_copies: 1,
  });
  const [newMember, setNewMember] = useState({
    email: "",
    full_name: "",
    password: "",
    role: "member",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [booksData, membersData, finesData] = await Promise.all([
        bookService.getBooks(),
        memberService.getMembers(),
        fineService.getFines(),
      ]);

      setBooks(booksData);
      setMembers(membersData);
      setFines(finesData);

      // Fetch loans for all members to aggregate active loans
      const allLoansPromises = membersData.map((m) =>
        loanService.getMemberLoans(m.id),
      );
      const allLoansResults = await Promise.all(allLoansPromises);
      const flatLoans = allLoansResults.flat();
      setLoans(flatLoans);

      setError("");
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

  const handleIssueBook = async (e) => {
    e.preventDefault();
    if (!selectedBookId || !selectedMemberId) {
      setError("Please select both a book and a member.");
      return;
    }
    try {
      await loanService.checkoutBook(selectedBookId, selectedMemberId);
      setIsIssueModalOpen(false);
      setSelectedBookId("");
      setSelectedMemberId("");
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to issue book.");
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await bookService.createBook({
        ...newBook,
        publication_year: newBook.publication_year
          ? parseInt(newBook.publication_year, 10)
          : null,
        total_copies: parseInt(newBook.total_copies, 10) || 1,
      });
      setIsAddBookModalOpen(false);
      setNewBook({
        title: "",
        author: "",
        isbn: "",
        genre: "",
        publication_year: "",
        total_copies: 1,
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add book.");
    }
  };

  const handleRegisterMember = async (e) => {
    e.preventDefault();
    try {
      await memberService.createMember(newMember);
      setIsRegisterModalOpen(false);
      setNewMember({ email: "", full_name: "", password: "", role: "member" });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to register member.");
    }
  };

  const handleReturnBook = async (loanId) => {
    try {
      await loanService.returnBook(loanId);
      fetchData();
    } catch (err) {
      setError("Failed to return book.");
    }
  };

  const handlePayFine = async (fineId) => {
    try {
      await fineService.payFine(fineId);
      fetchData();
    } catch (err) {
      setError("Failed to process fine payment.");
    }
  };

  const handleSendReminders = async () => {
    try {
      await loanService.sendDueReminders();
      alert("Due-date reminders sent successfully!");
    } catch (err) {
      setError("Failed to send reminders.");
    }
  };

  const activeLoans = loans.filter((l) => !l.return_date);
  const unpaidFines = fines.filter((f) => f.status !== "paid");
  const totalFinesAmount = unpaidFines.reduce((sum, f) => sum + f.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Books"
          value={books.length}
          icon={FileText}
          trend={`${books.reduce((sum, b) => sum + b.available_copies, 0)} available`}
          trendType="positive"
        />
        <StatCard
          title="Active Loans"
          value={activeLoans.length}
          icon={BookOpen}
          trendType="neutral"
        />
        <StatCard
          title="Overdue Fines"
          value={`$${totalFinesAmount.toFixed(2)}`}
          icon={DollarSign}
          trend={`${unpaidFines.length} unpaid`}
          trendType="negative"
        />
        <StatCard
          title="Total Members"
          value={members.length}
          icon={Users}
          trendType="neutral"
        />
      </div>

      {/* Quick Actions */}
      <QuickActionsPanel
        onIssueBook={() => setIsIssueModalOpen(true)}
        onAddBook={() => setIsAddBookModalOpen(true)}
        onRegisterMember={() => setIsRegisterModalOpen(true)}
        onSendReminders={handleSendReminders}
      />

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ActiveLoansTable loans={activeLoans} onReturn={handleReturnBook} />
        <OverdueFinesTable fines={unpaidFines} onPayFine={handlePayFine} />
      </div>

      {/* Issue Book Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title="Issue Book (Checkout)"
      >
        <form onSubmit={handleIssueBook} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">
              Select Book
            </label>
            <select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
            >
              <option value="">-- Select Book --</option>
              {books
                .filter((b) => b.available_copies > 0)
                .map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} ({b.author})
                  </option>
                ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">
              Select Member
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
            >
              <option value="">-- Select Member --</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name} ({m.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsIssueModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Issue Book
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Book Modal */}
      <Modal
        isOpen={isAddBookModalOpen}
        onClose={() => setIsAddBookModalOpen(false)}
        title="Add New Book"
      >
        <form onSubmit={handleAddBook} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">
              Title *
            </label>
            <input
              type="text"
              required
              value={newBook.title}
              onChange={(e) =>
                setNewBook({ ...newBook, title: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">
              Author *
            </label>
            <input
              type="text"
              required
              value={newBook.author}
              onChange={(e) =>
                setNewBook({ ...newBook, author: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">
              ISBN *
            </label>
            <input
              type="text"
              required
              value={newBook.isbn}
              onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase">
                Genre
              </label>
              <input
                type="text"
                value={newBook.genre}
                onChange={(e) =>
                  setNewBook({ ...newBook, genre: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase">
                Year
              </label>
              <input
                type="number"
                value={newBook.publication_year}
                onChange={(e) =>
                  setNewBook({ ...newBook, publication_year: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">
              Total Copies
            </label>
            <input
              type="number"
              min="1"
              value={newBook.total_copies}
              onChange={(e) =>
                setNewBook({ ...newBook, total_copies: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsAddBookModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Book
            </Button>
          </div>
        </form>
      </Modal>

      {/* Register Member Modal */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Register New Member"
      >
        <form onSubmit={handleRegisterMember} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={newMember.full_name}
              onChange={(e) =>
                setNewMember({ ...newMember, full_name: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">
              Email *
            </label>
            <input
              type="email"
              required
              value={newMember.email}
              onChange={(e) =>
                setNewMember({ ...newMember, email: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">
              Password *
            </label>
            <input
              type="password"
              required
              value={newMember.password}
              onChange={(e) =>
                setNewMember({ ...newMember, password: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsRegisterModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Register Member
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
