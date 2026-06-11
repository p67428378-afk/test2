import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardPage from './pages/DashboardPage';
import TransferPage from './pages/TransferPage';
import StatementsPage from './pages/StatementsPage';
import { authService } from './services/api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      setUser({ id: userId, login_id: localStorage.getItem('loginId') || 'John Doe' });
    }
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const data = await authService.login(loginId, password);
      localStorage.setItem('loginId', loginId);
      setIsAuthenticated(true);
    } catch (err) {
      setLoginError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-md">
        <div className="glass-card w-full max-w-md rounded-2xl p-lg flex flex-col gap-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          
          <div className="flex flex-col items-center gap-sm text-center">
            <span className="material-symbols-outlined text-primary text-5xl">account_balance</span>
            <h2 className="font-headline-md text-headline-md font-bold text-primary">Apex Bank</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Sign in to manage your accounts and transfers
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-md">
            {loginError && (
              <div className="p-md rounded-lg bg-error-container text-on-error-container text-sm">
                {loginError}
              </div>
            )}

            <div>
              <label className="font-label-sm text-on-surface-variant mb-2 block">Login ID</label>
              <input
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-md text-on-surface focus:border-primary focus:ring-0 focus:outline-none"
                type="text"
                placeholder="Enter your login ID"
                required
              />
            </div>

            <div>
              <label className="font-label-sm text-on-surface-variant mb-2 block">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-md text-on-surface focus:border-primary focus:ring-0 focus:outline-none"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-primary text-on-primary font-label-lg py-lg rounded-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-md disabled:opacity-50 mt-md"
            >
              <span className="material-symbols-outlined">login</span>
              {loginLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'transfer':
        return 'Payments & Transfers';
      case 'statements':
        return 'Account Statements';
      default:
        return 'Apex Bank';
    }
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-background text-on-surface">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        user={user}
      />

      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Header
          title={getHeaderTitle()}
          setIsSidebarOpen={setIsSidebarOpen}
          setActiveTab={setActiveTab}
        />

        <div className="flex-grow">
          {activeTab === 'dashboard' && (
            <DashboardPage
              setActiveTab={setActiveTab}
              refreshTrigger={refreshTrigger}
              setRefreshTrigger={setRefreshTrigger}
            />
          )}
          {activeTab === 'transfer' && (
            <TransferPage
              refreshTrigger={refreshTrigger}
              setRefreshTrigger={setRefreshTrigger}
            />
          )}
          {activeTab === 'statements' && (
            <StatementsPage
              refreshTrigger={refreshTrigger}
            />
          )}
        </div>
      </main>
    </div>
  );
}
