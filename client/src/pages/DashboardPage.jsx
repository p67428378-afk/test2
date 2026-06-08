import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Wallet, FileText, ShieldCheck, Search, Bell, UserCircle } from 'lucide-react';
import { listCertificates } from '../services/api';
import RecentRequestsTable from '../components/certificates/RecentRequestsTable';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const skip = (page - 1) * limit;
      const data = await listCertificates(skip, limit);
      setRequests(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to fetch certificate requests:', err);
      setError('Failed to load certificate requests. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [page]);

  const handleRetry = (req) => {
    navigate('/request', { state: { accountNumber: req.account_number, purpose: req.purpose } });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* TopNavBar */}
      <header className="bg-surface dark:bg-on-background text-primary dark:text-primary-fixed border-b border-outline-variant flex justify-between items-center h-16 px-container-padding-desktop shrink-0 z-10 sticky top-0">
        {/* Search on left */}
        <div className="flex-1 max-w-md">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            <input
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-on-surface font-body-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all outline-none"
              placeholder="Search certificates..."
              type="text"
            />
          </div>
        </div>
        {/* Trailing Icons */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-full text-secondary hover:bg-surface-container-low transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error text-on-error rounded-full font-label-sm text-[10px] flex items-center justify-center border-2 border-surface">
              2
            </span>
          </button>
          <button className="p-2 rounded-full text-secondary hover:bg-surface-container-low transition-colors">
            <UserCircle className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Scrollable Canvas */}
      <main className="flex-1 overflow-y-auto p-container-padding-desktop">
        <div className="max-w-[1080px] mx-auto space-y-gutter">
          {/* Row 1: Banner */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-primary-container/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="relative z-10 max-w-2xl">
              <h1 className="font-display-lg text-display-lg text-on-surface mb-2">Account Balance Certificates</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Generate legally compliant, digitally signed balance certificates for visa, loan, or audit purposes.
              </p>
            </div>
            <button
              onClick={() => navigate('/request')}
              className="relative z-10 shrink-0 bg-primary-container text-on-primary font-label-md text-label-md px-6 py-3 rounded-lg hover:bg-primary-container/90 active:scale-95 transition-all flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Request New Certificate
            </button>
          </div>

          {/* Row 2: KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* KPI 1 */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Active Accounts</span>
                <div className="p-2 bg-surface-container-low rounded-lg text-primary-container group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-md text-headline-md text-on-surface">3</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">accounts</span>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">(savings & current)</p>
            </div>

            {/* KPI 2 */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Certificates Generated</span>
                <div className="p-2 bg-surface-container-low rounded-lg text-primary-container group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-md text-headline-md text-on-surface">{total}</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">certificates</span>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">(all time)</p>
            </div>

            {/* KPI 3 */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Compliance Status</span>
                <div className="p-2 bg-surface-container-low rounded-lg text-[#059669] group-hover:bg-[#059669] group-hover:text-white transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-md text-headline-md text-on-surface">100%</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Compliant</span>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">(RBI & IT Act 2000)</p>
            </div>
          </div>

          {/* Row 3: Data Table */}
          {isLoading ? (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-12 text-center shadow-sm">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-container mx-auto mb-4"></div>
              <p className="text-on-surface-variant">Loading certificate requests...</p>
            </div>
          ) : error ? (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-12 text-center shadow-sm text-error">
              <p>{error}</p>
              <button onClick={fetchRequests} className="mt-4 text-primary-container hover:underline font-label-md text-label-md">
                Retry Loading
              </button>
            </div>
          ) : (
            <RecentRequestsTable
              requests={requests}
              total={total}
              page={page}
              limit={limit}
              onPageChange={setPage}
              onRetry={handleRetry}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
