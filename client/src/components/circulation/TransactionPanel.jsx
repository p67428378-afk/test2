import React from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Book,
  User,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  circulationService,
  bookService,
  patronService,
} from "../../services/api";

const TransactionPanel = ({ onSuccess }) => {
  const [activeTab, setActiveTab] = React.useState("checkout"); // 'checkout' or 'checkin'
  const [books, setBooks] = React.useState([]);
  const [patrons, setPatrons] = React.useState([]);

  // Form states
  const [selectedBookId, setSelectedBookId] = React.useState("");
  const [selectedPatronId, setSelectedPatronId] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [checkinBookId, setCheckinBookId] = React.useState("");

  // Status states
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState(null); // { type: 'success'|'error', text: '' }

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [booksData, patronsData] = await Promise.all([
        bookService.getBooks(),
        patronService.getPatrons(),
      ]);
      setBooks(booksData);
      setPatrons(patronsData);
    } catch (err) {
      console.error("Error fetching data for transaction panel", err);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!selectedBookId || !selectedPatronId || !dueDate) {
      setMessage({ type: "error", text: "Please fill in all fields." });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      await circulationService.checkout(
        selectedBookId,
        selectedPatronId,
        dueDate,
      );
      setMessage({ type: "success", text: "Book checked out successfully!" });
      setSelectedBookId("");
      setSelectedPatronId("");
      setDueDate("");
      if (onSuccess) onSuccess();
      fetchData(); // Refresh available copies
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.detail ||
          "Failed to check out book. Please check availability.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckin = async (e) => {
    e.preventDefault();
    if (!checkinBookId) {
      setMessage({ type: "error", text: "Please select a book to check in." });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      await circulationService.checkin(checkinBookId);
      setMessage({ type: "success", text: "Book checked in successfully!" });
      setCheckinBookId("");
      if (onSuccess) onSuccess();
      fetchData(); // Refresh available copies
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.detail ||
          "Failed to check in book. Is it already checked in?",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-sm overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/50">
        <button
          onClick={() => {
            setActiveTab("checkout");
            setMessage(null);
          }}
          className={`flex-1 py-4 px-6 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
            activeTab === "checkout"
              ? "border-indigo-500 text-white bg-slate-900/50"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          Check Out Book
        </button>
        <button
          onClick={() => {
            setActiveTab("checkin");
            setMessage(null);
          }}
          className={`flex-1 py-4 px-6 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
            activeTab === "checkin"
              ? "border-indigo-500 text-white bg-slate-900/50"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <ArrowDownLeft className="w-4 h-4 text-indigo-400" />
          Check In Book
        </button>
      </div>

      <div className="p-6">
        {/* Status Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-start gap-3 text-sm ${
              message.type === "success"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {activeTab === "checkout" ? (
          <form onSubmit={handleCheckout} className="space-y-4">
            {/* Book Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Book className="w-3.5 h-3.5" /> Select Book
              </label>
              <select
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value="">-- Choose a Book --</option>
                {books.map((book) => (
                  <option
                    key={book.id}
                    value={book.id}
                    disabled={book.copies_available === 0}
                  >
                    {book.title} by {book.author} ({book.copies_available}{" "}
                    available)
                  </option>
                ))}
              </select>
            </div>

            {/* Patron Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> Select Patron
              </label>
              <select
                value={selectedPatronId}
                onChange={(e) => setSelectedPatronId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value="">-- Choose a Patron --</option>
                {patrons.map((patron) => (
                  <option key={patron.id} value={patron.id}>
                    {patron.full_name} ({patron.username})
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold rounded-lg transition-colors text-sm shadow-lg shadow-indigo-600/10"
            >
              {loading ? "Processing..." : "Complete Checkout"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCheckin} className="space-y-4">
            {/* Book Selection for Checkin */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Book className="w-3.5 h-3.5" /> Select Book to Return
              </label>
              <select
                value={checkinBookId}
                onChange={(e) => setCheckinBookId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value="">-- Choose a Book --</option>
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} by {book.author} (
                    {book.copies_total - book.copies_available} currently
                    loaned)
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-semibold rounded-lg transition-colors text-sm shadow-lg shadow-emerald-600/10"
            >
              {loading ? "Processing..." : "Complete Return"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default TransactionPanel;
