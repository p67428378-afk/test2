import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import TransactionPanel from "../components/circulation/TransactionPanel";
import { patronService } from "../services/api";
import { Plus, UserPlus, CheckCircle2, AlertCircle } from "lucide-react";

const CirculationPage = () => {
  const [patrons, setPatrons] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isAddPatronOpen, setIsAddPatronOpen] = React.useState(false);

  // Form states for new patron
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [mobileNumber, setMobileNumber] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Status states
  const [formError, setFormError] = React.useState("");
  const [formSuccess, setFormSuccess] = React.useState("");

  React.useEffect(() => {
    fetchPatrons();
  }, []);

  const fetchPatrons = async () => {
    try {
      setLoading(true);
      const data = await patronService.getPatrons();
      setPatrons(data);
    } catch (err) {
      console.error("Error fetching patrons", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatron = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!username || !email || !fullName || !password) {
      setFormError("Username, Email, Full Name, and Password are required.");
      return;
    }

    try {
      await patronService.createPatron({
        username,
        email,
        full_name: fullName,
        mobile_number: mobileNumber || null,
        password,
      });
      setFormSuccess("Patron registered successfully!");
      setUsername("");
      setEmail("");
      setFullName("");
      setMobileNumber("");
      setPassword("");
      fetchPatrons();
      setTimeout(() => {
        setIsAddPatronOpen(false);
        setFormSuccess("");
      }, 1500);
    } catch (err) {
      setFormError(err.response?.data?.detail || "Failed to register patron.");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header searchPlaceholder="Search transactions..." />
        <main className="p-8 mt-16 max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div>
            <h2 className="text-2xl font-bold text-white">
              Circulation & Patrons
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Manage book checkouts, returns, and patron accounts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Transaction Panel */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-lg font-semibold text-white">
                Circulation Desk
              </h3>
              <TransactionPanel onSuccess={fetchPatrons} />
            </div>

            {/* Right Column: Patrons List & Add Patron */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Patrons Directory
                </h3>
                <button
                  onClick={() => setIsAddPatronOpen(!isAddPatronOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors text-xs shadow-lg shadow-indigo-600/10"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Add Patron
                </button>
              </div>

              {isAddPatronOpen && (
                <form
                  onSubmit={handleAddPatron}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4 shadow-xl"
                >
                  <h4 className="font-semibold text-sm text-white border-b border-slate-800 pb-2">
                    Register New Patron
                  </h4>

                  {formError && (
                    <div className="p-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg flex items-center gap-2 text-xs">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}
                  {formSuccess && (
                    <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg flex items-center gap-2 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{formSuccess}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="johndoe"
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Mobile Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="+1234567890"
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/50">
                    <button
                      type="button"
                      onClick={() => setIsAddPatronOpen(false)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-xs transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs transition-colors"
                    >
                      Register
                    </button>
                  </div>
                </form>
              )}

              {/* Patrons List */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden max-h-[450px] overflow-y-auto">
                {loading ? (
                  <div className="p-6 space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-12 bg-slate-800 rounded animate-pulse"
                      />
                    ))}
                  </div>
                ) : patrons.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    No patrons registered yet.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800/50">
                    {patrons.map((patron) => (
                      <div
                        key={patron.id}
                        className="p-4 hover:bg-slate-800/20 transition-colors flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-sm text-white">
                            {patron.full_name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {patron.email}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-mono bg-slate-950 text-indigo-400 px-2 py-0.5 rounded border border-slate-800">
                            {patron.username}
                          </span>
                          {patron.mobile_number && (
                            <p className="text-[10px] text-slate-500 mt-1">
                              {patron.mobile_number}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CirculationPage;
