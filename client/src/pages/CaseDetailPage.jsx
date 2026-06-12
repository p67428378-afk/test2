import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PersonalDetailsCard from '../components/cases/PersonalDetailsCard';
import IdentityVerificationCard from '../components/cases/IdentityVerificationCard';
import SanctionsScreeningCard from '../components/cases/SanctionsScreeningCard';
import ActionsPanel from '../components/cases/ActionsPanel';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import {
  getCustomer,
  getVerifications,
  getScreeningResults,
  verifyAadhaarOTP,
  verifyPAN,
  runScreening,
  customerAction,
  createTransaction,
} from '../services/api';
import { ArrowLeft, Plus, X } from 'lucide-react';

export default function CaseDetailPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [verifications, setVerifications] = useState([]);
  const [screeningResults, setScreeningResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // State for actions
  const [isVerifyingAadhaar, setIsVerifyingAadhaar] = useState(false);
  const [isVerifyingPAN, setIsVerifyingPAN] = useState(false);
  const [isScreening, setIsScreening] = useState(false);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // State for transaction simulation
  const [showTxModal, setShowTxModal] = useState(false);
  const [txData, setTxData] = useState({
    amount: '',
    transactionType: 'DEPOSIT',
    destinationAccount: '',
  });
  const [isSimulatingTx, setIsSubmittingTx] = useState(false);
  const [txResult, setTxResult] = useState(null);

  const fetchCaseDetails = async () => {
    try {
      setIsLoading(true);
      const [custData, verifData, screenData] = await Promise.all([
        getCustomer(id),
        getVerifications(id),
        getScreeningResults(id),
      ]);
      setCustomer(custData);
      setVerifications(verifData);
      setScreeningResults(screenData);
    } catch (err) {
      console.error('Error fetching case details:', err);
      setError('Failed to load customer case details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseDetails();
  }, [id]);

  const handleVerifyAadhaar = async (otp) => {
    try {
      setIsVerifyingAadhaar(true);
      await verifyAadhaarOTP(id, otp);
      await fetchCaseDetails();
    } catch (err) {
      alert(err.response?.data?.detail || 'Aadhaar verification failed.');
    } finally {
      setIsVerifyingAadhaar(false);
    }
  };

  const handleVerifyPAN = async () => {
    try {
      setIsVerifyingPAN(true);
      await verifyPAN(id);
      await fetchCaseDetails();
    } catch (err) {
      alert(err.response?.data?.detail || 'PAN validation failed.');
    } finally {
      setIsVerifyingPAN(false);
    }
  };

  const handleRunScreening = async () => {
    try {
      setIsScreening(true);
      await runScreening(id);
      await fetchCaseDetails();
    } catch (err) {
      alert(err.response?.data?.detail || 'Screening failed.');
    } finally {
      setIsScreening(false);
    }
  };

  const handleAction = async ({ status, notes }) => {
    try {
      setIsSubmittingAction(true);
      await customerAction(id, { status, notes });
      await fetchCaseDetails();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to submit action.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleTxSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingTx(true);
    setTxResult(null);
    try {
      const res = await createTransaction({
        customerId: id,
        amount: parseFloat(txData.amount),
        transactionType: txData.transactionType,
        destinationAccount: txData.destinationAccount || undefined,
      });
      setTxResult(res);
      await fetchCaseDetails();
    } catch (err) {
      alert(err.response?.data?.detail || 'Transaction simulation failed.');
    } finally {
      setIsSubmittingTx(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 text-on-surface-variant">Loading case details...</div>;
  }

  if (error || !customer) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-error/10 border border-error/20 text-error rounded-md">
          {error || 'Customer not found.'}
        </div>
        <Link to="/" className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 hover:bg-surface-container-highest rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display-lg text-display-lg text-on-surface">
                {`${customer.firstName} ${customer.lastName}`}
              </h1>
              <Badge status={customer.status} />
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Customer ID: <span className="font-mono text-primary">{customer.id}</span>
            </p>
          </div>
        </div>

        <Button variant="secondary" onClick={() => setShowTxModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Simulate Transaction
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PersonalDetailsCard customer={customer} />
          <IdentityVerificationCard
            verifications={verifications}
            onVerifyAadhaar={handleVerifyAadhaar}
            onVerifyPAN={handleVerifyPAN}
            isVerifyingAadhaar={isVerifyingAadhaar}
            isVerifyingPAN={isVerifyingPAN}
          />
          <SanctionsScreeningCard
            screeningResults={screeningResults}
            onRunScreening={handleRunScreening}
            isScreening={isScreening}
          />
        </div>

        <div className="space-y-6">
          <div className="bg-surface-container rounded-lg border border-outline-variant p-6 space-y-4">
            <h2 className="font-headline-md text-headline-md text-on-surface">Risk Assessment</h2>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant">Risk Score</span>
              <span className={`font-display-lg text-display-lg ${
                customer.riskScore > 70 ? 'text-error' : customer.riskScore > 30 ? 'text-amber-500' : 'text-emerald-400'
              }`}>
                {customer.riskScore}%
              </span>
            </div>
            <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  customer.riskScore > 70 ? 'bg-error' : customer.riskScore > 30 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${customer.riskScore}%` }}
              ></div>
            </div>
          </div>

          <ActionsPanel
            currentStatus={customer.status}
            onAction={handleAction}
            isSubmitting={isSubmittingAction}
          />
        </div>
      </div>

      {/* Simulate Transaction Modal */}
      {showTxModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container border border-outline-variant rounded-lg max-w-md w-full p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-outline-variant/30 pb-4">
              <h2 className="font-headline-md text-headline-md text-on-surface">Simulate Transaction</h2>
              <button onClick={() => { setShowTxModal(false); setTxResult(null); }} className="text-on-surface-variant hover:text-on-surface">
                <X className="w-6 h-6" />
              </button>
            </div>

            {txResult ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-md border ${
                  txResult.alertTriggered ? 'bg-error/10 border-error/20 text-error' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}>
                  <p className="font-bold">{txResult.alertTriggered ? '⚠️ AML Alert Triggered!' : '✅ Transaction Completed Cleanly'}</p>
                  <p className="text-sm mt-1">
                    {txResult.alertTriggered
                      ? 'This transaction triggered suspicious activity rules. A regulatory report has been auto-generated.'
                      : 'Transaction processed successfully without triggering any alerts.'}
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => { setShowTxModal(false); setTxResult(null); }} variant="primary">
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleTxSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Amount (INR)</label>
                  <input
                    type="number"
                    value={txData.amount}
                    onChange={(e) => setTxData((prev) => ({ ...prev, amount: e.target.value }))}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Transaction Type</label>
                  <select
                    value={txData.transactionType}
                    onChange={(e) => setTxData((prev) => ({ ...prev, transactionType: e.target.value }))}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="DEPOSIT">DEPOSIT</option>
                    <option value="WITHDRAWAL">WITHDRAWAL</option>
                    <option value="TRANSFER">TRANSFER</option>
                  </select>
                </div>

                {txData.transactionType === 'TRANSFER' && (
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Destination Account</label>
                    <input
                      type="text"
                      value={txData.destinationAccount}
                      onChange={(e) => setTxData((prev) => ({ ...prev, destinationAccount: e.target.value }))}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
                  <Button type="button" variant="secondary" onClick={() => setShowTxModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={isSimulatingTx}>
                    {isSimulatingTx ? 'Processing...' : 'Submit Transaction'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}