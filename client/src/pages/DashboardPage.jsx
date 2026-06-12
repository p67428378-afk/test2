import React, { useState, useEffect } from 'react';
import KPIGrid from '../components/dashboard/KPIGrid';
import RecentCasesTable from '../components/dashboard/RecentCasesTable';
import Button from '../components/common/Button';
import { getCustomers, createCustomer } from '../services/api';
import { Plus, X } from 'lucide-react';

export default function DashboardPage() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    aadhaarNumber: '',
    panNumber: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Basic validation
    if (formData.aadhaarNumber.length !== 12 || !/^\d+$/.test(formData.aadhaarNumber)) {
      setError('Aadhaar number must be exactly 12 digits');
      setIsSubmitting(false);
      return;
    }

    if (formData.panNumber.length !== 10 || !/^[a-zA-Z0-9]+$/.test(formData.panNumber)) {
      setError('PAN number must be exactly 10 alphanumeric characters');
      setIsSubmitting(false);
      return;
    }

    try {
      await createCustomer(formData);
      setShowCreateModal(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: '',
        aadhaarNumber: '',
        panNumber: '',
      });
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create customer profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate stats
  const totalOnboarded = customers.length;
  const pendingVerification = customers.filter((c) => c.status === 'REVIEW').length;
  const activeAlerts = customers.filter((c) => c.status === 'FLAGGED').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface">Compliance Dashboard</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Real-time KYC ingestion, identity verification, and AML transaction monitoring.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Customer
        </Button>
      </div>

      <KPIGrid
        stats={{
          totalOnboarded: totalOnboarded.toString(),
          pendingVerification: pendingVerification.toString(),
          activeAlerts: activeAlerts.toString(),
          reportsFiled: '186',
        }}
      />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Area Chart */}
        <div className="lg:col-span-8 bg-surface-container rounded-lg border border-outline-variant p-6 flex flex-col min-h-[320px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline-md text-headline-md text-on-surface">KYC Onboarding &amp; Alert Trends</h2>
          </div>
          <div className="flex-1 relative w-full flex items-end justify-between px-2 pb-6 border-b border-outline-variant/50">
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-on-surface-variant font-label-md text-[10px]">
              <span>3k</span>
              <span>2k</span>
              <span>1k</span>
              <span>0</span>
            </div>
            <div className="w-full h-full ml-6 relative overflow-hidden flex items-end">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="border-t border-outline-variant/20 w-full"></div>
                <div className="border-t border-outline-variant/20 w-full"></div>
                <div className="border-t border-outline-variant/20 w-full"></div>
              </div>
              <svg className="w-full h-[80%] drop-shadow-[0_0_15px_rgba(99,102,241,0.2)]" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#8083ff" stopOpacity="0.4"></stop>
                    <stop offset="100%" stopColor="#8083ff" stopOpacity="0.0"></stop>
                  </linearGradient>
                </defs>
                <path d="M0,100 L0,60 L20,70 L40,30 L60,40 L80,10 L100,20 L100,100 Z" fill="url(#chartGradient)"></path>
                <path d="M0,60 L20,70 L40,30 L60,40 L80,10 L100,20" fill="none" stroke="#8083ff" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
              </svg>
            </div>
          </div>
          <div className="flex justify-between mt-2 ml-6 text-on-surface-variant font-label-md text-[10px]">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="lg:col-span-4 bg-surface-container rounded-lg border border-outline-variant p-6 flex flex-col min-h-[320px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline-md text-headline-md text-on-surface">Risk Distribution</h2>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="none" r="40" stroke="#222a3d" strokeWidth="15"></circle>
                <circle cx="50" cy="50" fill="none" r="40" stroke="#34d399" strokeDasharray="251.2" strokeDashoffset="75.36" strokeWidth="15"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-display-lg text-[24px] text-on-surface leading-none">{totalOnboarded}</span>
                <span className="font-label-md text-[10px] text-on-surface-variant">Total Profiles</span>
              </div>
            </div>
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between font-body-sm text-body-sm">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-emerald-400"></div><span className="text-on-surface-variant">Low Risk</span></div>
                <span className="text-on-surface font-mono-data">70%</span>
              </div>
              <div className="flex items-center justify-between font-body-sm text-body-sm">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-amber-500"></div><span className="text-on-surface-variant">Medium Risk</span></div>
                <span className="text-on-surface font-mono-data">20%</span>
              </div>
              <div className="flex items-center justify-between font-body-sm text-body-sm">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-error"></div><span className="text-on-surface-variant">High Risk</span></div>
                <span className="text-on-surface font-mono-data">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Cases Table */}
      {isLoading ? (
        <div className="text-center py-12 text-on-surface-variant">Loading dashboard data...</div>
      ) : (
        <RecentCasesTable customers={customers} />
      )}

      {/* Create Customer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container border border-outline-variant rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-outline-variant/30 pb-4">
              <h2 className="font-headline-md text-headline-md text-on-surface">Ingest Customer Profile</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <X className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <div className="p-4 bg-error/10 border border-error/20 text-error rounded-md text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Date of Birth (YYYY-MM-DD)</label>
                  <input
                    type="text"
                    name="dateOfBirth"
                    placeholder="YYYY-MM-DD"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Aadhaar Number (12 digits)</label>
                  <input
                    type="text"
                    name="aadhaarNumber"
                    maxLength={12}
                    value={formData.aadhaarNumber}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">PAN Number (10 alphanumeric)</label>
                  <input
                    type="text"
                    name="panNumber"
                    maxLength={10}
                    value={formData.panNumber}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
                <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Ingesting...' : 'Ingest Profile'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}