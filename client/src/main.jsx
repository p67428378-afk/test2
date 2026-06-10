import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import BodyTrackingPage from './pages/BodyTrackingPage';
import FuneralArrangementsPage from './pages/FuneralArrangementsPage';
import BillingInvoicingPage from './pages/BillingInvoicingPage';
import { bodiesApi, funeralsApi, invoicesApi } from './services/api';
import './index.css';

// MANDATORY ERROR BOUNDARY
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: '#ffb4ab', backgroundColor: '#0b1326', minHeight: '100vh' }}>
          <h2 className="text-xl font-bold mb-2">Something went wrong.</h2>
          <p className="text-sm text-on-surface-variant">Please check the console or refresh the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Mock Data for fallback
const MOCK_BODIES = [
  { body_id: 'eleanor-vance-uuid', first_name: 'Eleanor', last_name: 'Vance', intake_date: '2026-05-15T10:00:00Z', location: 'Refrigeration Room B', status: 'Intake' },
  { body_id: 'thomas-miller-uuid', first_name: 'Thomas', last_name: 'Miller', intake_date: '2026-05-16T14:00:00Z', location: 'Prep Room 1', status: 'Preparation' },
  { body_id: 'sarah-jenkins-uuid', first_name: 'Sarah', last_name: 'Jenkins', intake_date: '2026-05-14T16:30:00Z', location: 'Chapel A', status: 'Refrigeration' },
  { body_id: 'robert-chen-uuid', first_name: 'Robert', last_name: 'Chen', intake_date: '2026-05-13T09:00:00Z', location: 'Loading Bay', status: 'Released' },
  { body_id: 'martha-stewart-uuid', first_name: 'Martha', last_name: 'Stewart', intake_date: '2026-05-16T11:15:00Z', location: 'Refrigeration Room A', status: 'Intake' },
];

const MOCK_FUNERALS = [
  { funeral_id: 'funeral-1', body_id: 'eleanor-vance-uuid', deceased_name: 'Eleanor Vance', service_type: 'burial', service_date: '2026-05-16T10:00:00Z', assigned_resources: 'Chapel A', status: 'scheduled', notes: 'Live stream service for overseas relatives.' },
  { funeral_id: 'funeral-2', body_id: 'thomas-miller-uuid', deceased_name: 'Thomas Miller', service_type: 'cremation', service_date: '2026-05-16T14:00:00Z', assigned_resources: 'Crematory', status: 'scheduled', notes: 'Eco-friendly biodegradable urn requested.' },
  { funeral_id: 'funeral-3', body_id: 'sarah-jenkins-uuid', deceased_name: 'Sarah Jenkins', service_type: 'wake', service_date: '2026-05-16T16:30:00Z', assigned_resources: 'Viewing Room 2', status: 'scheduled', notes: 'Special floral arrangement (white lilies and roses).' },
];

const MOCK_INVOICES = [
  { invoice_id: 'invoice-1', funeral_id: 'funeral-1', total_amount: 11350.00, paid_amount: 11350.00, status: 'paid', items: [
    { description: 'Standard Funeral Service Package', amount: 4500.00 },
    { description: 'Casket - Oak Classic', amount: 2500.00 },
    { description: 'Cemetery Plot & Burial Fees', amount: 3500.00 },
    { description: 'Transportation & Hearse Service', amount: 850.00 },
  ]},
  { invoice_id: 'invoice-2', funeral_id: 'funeral-2', total_amount: 5200.00, paid_amount: 2000.00, status: 'partially_paid', items: [
    { description: 'Cremation Service Package', amount: 3200.00 },
    { description: 'Eco-Friendly Urn', amount: 1200.00 },
    { description: 'Memorial Service Chapel Rental', amount: 800.00 },
  ]},
  { invoice_id: 'invoice-3', funeral_id: 'funeral-3', total_amount: 3500.00, paid_amount: 0.00, status: 'unpaid', items: [
    { description: 'Wake & Viewing Room Rental', amount: 1500.00 },
    { description: 'Special Floral Arrangements', amount: 1200.00 },
    { description: 'Catering & Refreshments', amount: 800.00 },
  ]},
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bodies, setBodies] = useState(MOCK_BODIES);
  const [funerals, setFunerals] = useState(MOCK_FUNERALS);
  const [invoices, setInvoices] = useState(MOCK_INVOICES);

  // Modals state
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showUpdateBodyModal, setShowUpdateBodyModal] = useState(false);
  const [showUpdateFuneralModal, setShowUpdateFuneralModal] = useState(false);
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);

  // Selected items for updates
  const [selectedBody, setSelectedBody] = useState(null);
  const [selectedFuneral, setSelectedFuneral] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Form states
  const [newBody, setNewBody] = useState({ first_name: '', last_name: '', date_of_death: '', intake_date: new Date().toISOString().substring(0, 16), location: '', status: 'Intake' });
  const [newFuneral, setNewFuneral] = useState({ body_id: '', service_type: 'burial', service_date: new Date().toISOString().substring(0, 16), assigned_resources: '', notes: '', status: 'scheduled' });
  const [newInvoice, setNewInvoice] = useState({ funeral_id: '', items: [{ description: '', amount: '' }], paid_amount: 0, status: 'unpaid' });
  const [paymentAmount, setPaymentAmount] = useState('');

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const bodiesData = await bodiesApi.list();
        if (bodiesData && bodiesData.length > 0) {
          setBodies(bodiesData);
        }
      } catch (err) {
        console.warn("Failed to fetch bodies from API, using mock data", err);
      }

      try {
        const funeralsData = await funeralsApi.list();
        if (funeralsData && funeralsData.length > 0) {
          // Map deceased names if possible
          const mapped = funeralsData.map(f => {
            const b = bodies.find(x => x.body_id === f.body_id);
            return {
              ...f,
              deceased_name: b ? `${b.first_name || ''} ${b.last_name || ''}`.trim() : `Case #${f.body_id.substring(0, 8).toUpperCase()}`
            };
          });
          setFunerals(mapped);
        }
      } catch (err) {
        console.warn("Failed to fetch funerals from API, using mock data", err);
      }

      try {
        const invoicesData = await invoicesApi.list();
        if (invoicesData && invoicesData.length > 0) {
          setInvoices(invoicesData);
        }
      } catch (err) {
        console.warn("Failed to fetch invoices from API, using mock data", err);
      }
    };

    fetchData();
  }, []);

  // Handlers
  const handleRegisterBody = async (e) => {
    e.preventDefault();
    try {
      const registered = await bodiesApi.register(newBody);
      setBodies([registered, ...bodies]);
    } catch (err) {
      console.error("API registration failed, adding locally", err);
      const localBody = {
        ...newBody,
        body_id: 'local-' + Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
      };
      setBodies([localBody, ...bodies]);
    }
    setShowRegisterModal(false);
    setNewBody({ first_name: '', last_name: '', date_of_death: '', intake_date: new Date().toISOString().substring(0, 16), location: '', status: 'Intake' });
  };

  const handleScheduleFuneral = async (e) => {
    e.preventDefault();
    try {
      const scheduled = await funeralsApi.create(newFuneral);
      const b = bodies.find(x => x.body_id === scheduled.body_id);
      const mapped = {
        ...scheduled,
        deceased_name: b ? `${b.first_name || ''} ${b.last_name || ''}`.trim() : `Case #${scheduled.body_id.substring(0, 8).toUpperCase()}`
      };
      setFunerals([mapped, ...funerals]);
    } catch (err) {
      console.error("API scheduling failed, adding locally", err);
      const b = bodies.find(x => x.body_id === newFuneral.body_id);
      const localFuneral = {
        ...newFuneral,
        funeral_id: 'local-' + Math.random().toString(36).substr(2, 9),
        deceased_name: b ? `${b.first_name || ''} ${b.last_name || ''}`.trim() : 'Unknown',
        created_at: new Date().toISOString(),
      };
      setFunerals([localFuneral, ...funerals]);
    }
    setShowScheduleModal(false);
    setNewFuneral({ body_id: '', service_type: 'burial', service_date: new Date().toISOString().substring(0, 16), assigned_resources: '', notes: '', status: 'scheduled' });
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    const items = newInvoice.items.map(item => ({
      description: item.description,
      amount: parseFloat(item.amount || 0)
    }));
    const total_amount = items.reduce((sum, item) => sum + item.amount, 0);
    const payload = {
      funeral_id: newInvoice.funeral_id,
      items,
      paid_amount: parseFloat(newInvoice.paid_amount || 0),
      status: newInvoice.status,
      total_amount
    };

    try {
      const created = await invoicesApi.create(payload);
      setInvoices([created, ...invoices]);
    } catch (err) {
      console.error("API invoice creation failed, adding locally", err);
      const localInvoice = {
        ...payload,
        invoice_id: 'local-' + Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
      };
      setInvoices([localInvoice, ...invoices]);
    }
    setShowInvoiceModal(false);
    setNewInvoice({ funeral_id: '', items: [{ description: '', amount: '' }], paid_amount: 0, status: 'unpaid' });
  };

  const handleUpdateBody = async (e) => {
    e.preventDefault();
    try {
      const updated = await bodiesApi.update(selectedBody.body_id, {
        status: selectedBody.status,
        location: selectedBody.location,
      });
      setBodies(bodies.map(b => b.body_id === updated.body_id ? updated : b));
    } catch (err) {
      console.error("API body update failed, updating locally", err);
      setBodies(bodies.map(b => b.body_id === selectedBody.body_id ? selectedBody : b));
    }
    setShowUpdateBodyModal(false);
  };

  const handleUpdateFuneral = async (e) => {
    e.preventDefault();
    try {
      const updated = await funeralsApi.update(selectedFuneral.funeral_id, {
        status: selectedFuneral.status,
      });
      setFunerals(funerals.map(f => f.funeral_id === updated.funeral_id ? { ...f, ...updated } : f));
    } catch (err) {
      console.error("API funeral update failed, updating locally", err);
      setFunerals(funerals.map(f => f.funeral_id === selectedFuneral.funeral_id ? selectedFuneral : f));
    }
    setShowUpdateFuneralModal(false);
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    const amt = parseFloat(paymentAmount || 0);
    const newPaid = Number(selectedInvoice.paid_amount || 0) + amt;
    const newStatus = newPaid >= Number(selectedInvoice.total_amount) ? 'paid' : 'partially_paid';

    try {
      const updated = await invoicesApi.update(selectedInvoice.invoice_id, {
        paid_amount: newPaid,
        status: newStatus,
      });
      setInvoices(invoices.map(inv => inv.invoice_id === updated.invoice_id ? { ...inv, ...updated } : inv));
    } catch (err) {
      console.error("API payment recording failed, updating locally", err);
      const updatedLocal = {
        ...selectedInvoice,
        paid_amount: newPaid,
        status: newStatus,
      };
      setInvoices(invoices.map(inv => inv.invoice_id === selectedInvoice.invoice_id ? updatedLocal : inv));
    }
    setShowRecordPaymentModal(false);
    setPaymentAmount('');
  };

  // Stats calculation
  const stats = {
    activeCases: bodies.filter(b => b.status?.toLowerCase() !== 'released').length,
    occupancyRate: Math.round((bodies.filter(b => b.location?.toLowerCase().includes('refrigeration')).length / 40) * 100) || 45,
    occupancyText: `${bodies.filter(b => b.location?.toLowerCase().includes('refrigeration')).length}/40 refrigeration slots`,
    upcomingServices: funerals.filter(f => f.status?.toLowerCase() === 'scheduled').length,
    outstandingInvoices: invoices.reduce((sum, inv) => sum + (Number(inv.total_amount || 0) - Number(inv.paid_amount || 0)), 0),
    pendingInvoicesCount: invoices.filter(inv => inv.status?.toLowerCase() !== 'paid').length,
  };

  return (
    <AppLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onRegisterClick={() => setShowRegisterModal(true)}
    >
      {activeTab === 'dashboard' && (
        <DashboardPage
          stats={stats}
          bodies={bodies}
          funerals={funerals}
          onViewAllBodies={() => setActiveTab('tracking')}
          onViewFullCalendar={() => setActiveTab('arrangements')}
        />
      )}

      {activeTab === 'tracking' && (
        <BodyTrackingPage
          bodies={bodies}
          stats={stats}
          onRegisterClick={() => setShowRegisterModal(true)}
          onUpdateStatus={(body) => {
            setSelectedBody({ ...body });
            setShowUpdateBodyModal(true);
          }}
        />
      )}

      {activeTab === 'arrangements' && (
        <FuneralArrangementsPage
          funerals={funerals}
          onCreateClick={() => setShowScheduleModal(true)}
          onUpdateStatus={(funeral) => {
            setSelectedFuneral({ ...funeral });
            setShowUpdateFuneralModal(true);
          }}
        />
      )}

      {activeTab === 'billing' && (
        <BillingInvoicingPage
          invoices={invoices}
          onCreateClick={() => setShowInvoiceModal(true)}
          onUpdateStatus={(invoice) => {
            setSelectedInvoice({ ...invoice });
            setShowRecordPaymentModal(true);
          }}
        />
      )}

      {/* MODALS */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container border border-outline-variant rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-on-surface">Register New Intake</h3>
              <button onClick={() => setShowRegisterModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleRegisterBody} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={newBody.first_name}
                  onChange={(e) => setNewBody({ ...newBody, first_name: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={newBody.last_name}
                  onChange={(e) => setNewBody({ ...newBody, last_name: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Date of Death</label>
                <input
                  type="date"
                  value={newBody.date_of_death}
                  onChange={(e) => setNewBody({ ...newBody, date_of_death: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Intake Date &amp; Time</label>
                <input
                  type="datetime-local"
                  required
                  value={newBody.intake_date}
                  onChange={(e) => setNewBody({ ...newBody, intake_date: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Refrigeration Room A"
                  value={newBody.location}
                  onChange={(e) => setNewBody({ ...newBody, location: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                />
              </div>
              <button type="submit" className="w-full bg-primary-container text-on-primary-container py-2 rounded-lg font-medium hover:opacity-90 transition-all">
                Register Intake
              </button>
            </form>
          </div>
        </div>
      )}

      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container border border-outline-variant rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-on-surface">Schedule Funeral Service</h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleScheduleFuneral} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Select Deceased Individual</label>
                <select
                  required
                  value={newFuneral.body_id}
                  onChange={(e) => setNewFuneral({ ...newFuneral, body_id: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                >
                  <option value="">-- Select --</option>
                  {bodies.map(b => (
                    <option key={b.body_id} value={b.body_id}>
                      {b.first_name} {b.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Service Type</label>
                <select
                  value={newFuneral.service_type}
                  onChange={(e) => setNewFuneral({ ...newFuneral, service_type: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                >
                  <option value="burial">Burial</option>
                  <option value="cremation">Cremation</option>
                  <option value="wake">Wake</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Service Date &amp; Time</label>
                <input
                  type="datetime-local"
                  required
                  value={newFuneral.service_date}
                  onChange={(e) => setNewFuneral({ ...newFuneral, service_date: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Assigned Resources</label>
                <input
                  type="text"
                  placeholder="e.g., Chapel A, Hearse"
                  value={newFuneral.assigned_resources}
                  onChange={(e) => setNewFuneral({ ...newFuneral, assigned_resources: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Special Notes</label>
                <textarea
                  value={newFuneral.notes}
                  onChange={(e) => setNewFuneral({ ...newFuneral, notes: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface outline-none focus:border-primary h-20"
                />
              </div>
              <button type="submit" className="w-full bg-primary-container text-on-primary-container py-2 rounded-lg font-medium hover:opacity-90 transition-all">
                Schedule Service
              </button>
            </form>
          </div>
        </div>
      )}

      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container border border-outline-variant rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-on-surface">Create Invoice</h3>
              <button onClick={() => setShowInvoiceModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Select Funeral Arrangement</label>
                <select
                  required
                  value={newInvoice.funeral_id}
                  onChange={(e) => setNewInvoice({ ...newInvoice, funeral_id: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                >
                  <option value="">-- Select --</option>
                  {funerals.map(f => (
                    <option key={f.funeral_id} value={f.funeral_id}>
                      {f.deceased_name} ({f.service_type})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Item Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Standard Funeral Package"
                  value={newInvoice.items[0].description}
                  onChange={(e) => {
                    const items = [...newInvoice.items];
                    items[0].description = e.target.value;
                    setNewInvoice({ ...newInvoice, items });
                  }}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Amount ($)</label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={newInvoice.items[0].amount}
                  onChange={(e) => {
                    const items = [...newInvoice.items];
                    items[0].amount = e.target.value;
                    setNewInvoice({ ...newInvoice, items });
                  }}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                />
              </div>
              <button type="submit" className="w-full bg-primary-container text-on-primary-container py-2 rounded-lg font-medium hover:opacity-90 transition-all">
                Create Invoice
              </button>
            </form>
          </div>
        </div>
      )}

      {showUpdateBodyModal && selectedBody && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container border border-outline-variant rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-on-surface">Update Status &amp; Location</h3>
              <button onClick={() => setShowUpdateBodyModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleUpdateBody} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Status</label>
                <select
                  value={selectedBody.status}
                  onChange={(e) => setSelectedBody({ ...selectedBody, status: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                >
                  <option value="Intake">Intake</option>
                  <option value="Refrigeration">Refrigeration</option>
                  <option value="Preparation">Preparation</option>
                  <option value="Released">Released</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={selectedBody.location}
                  onChange={(e) => setSelectedBody({ ...selectedBody, location: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                />
              </div>
              <button type="submit" className="w-full bg-primary-container text-on-primary-container py-2 rounded-lg font-medium hover:opacity-90 transition-all">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {showUpdateFuneralModal && selectedFuneral && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container border border-outline-variant rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-on-surface">Update Service Status</h3>
              <button onClick={() => setShowUpdateFuneralModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleUpdateFuneral} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Status</label>
                <select
                  value={selectedFuneral.status}
                  onChange={(e) => setSelectedFuneral({ ...selectedFuneral, status: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-primary-container text-on-primary-container py-2 rounded-lg font-medium hover:opacity-90 transition-all">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {showRecordPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container border border-outline-variant rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-on-surface">Record Payment</h3>
              <button onClick={() => setShowRecordPaymentModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <p className="text-sm text-on-surface-variant mb-2">
                  Total Amount: <span className="font-bold text-on-surface">${Number(selectedInvoice.total_amount).toFixed(2)}</span>
                </p>
                <p className="text-sm text-on-surface-variant mb-4">
                  Already Paid: <span className="font-bold text-tertiary">${Number(selectedInvoice.paid_amount).toFixed(2)}</span>
                </p>
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Payment Amount ($)</label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                />
              </div>
              <button type="submit" className="w-full bg-primary-container text-on-primary-container py-2 rounded-lg font-medium hover:opacity-90 transition-all">
                Record Payment
              </button>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);