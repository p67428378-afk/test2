import { useState } from 'react';
import api from '../services/api';

const InterestCertificateForm = () => {
  const [customerId, setCustomerId] = useState('BS-99482103');
  const [financialYear, setFinancialYear] = useState('2023-24');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.generateInterestCertificate(customerId, financialYear);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `interest_certificate_${customerId}_${financialYear}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-tertiary-container"></div>
      <div className="p-lg">
        <div className="flex items-center gap-4 mb-lg">
          <div className="h-12 w-12 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-3xl">description</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-lg">Certificate Request</h3>
            <p className="font-body-sm text-on-surface-variant">Verify details to generate your digital copy.</p>
          </div>
        </div>
        <form className="space-y-md" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block font-label-md text-on-surface" htmlFor="customer-id">Customer ID</label>
            <div className="relative">
              <input
                className="w-full bg-surface-container-low border border-slate-200 rounded-lg px-4 py-3 font-tabular-nums text-on-surface focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all cursor-not-allowed"
                id="customer-id"
                readOnly
                type="text"
                value={customerId}
              />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-primary-container text-sm">lock</span>
            </div>
            <p className="text-xs text-on-primary-container">Pre-filled based on your secure login session.</p>
          </div>
          <div className="space-y-2">
            <label className="block font-label-md text-on-surface" htmlFor="financial-year">Financial Year</label>
            <div className="relative">
              <select
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 font-body-md text-on-surface focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none appearance-none transition-all"
                id="financial-year"
                value={financialYear}
                onChange={(e) => setFinancialYear(e.target.value)}
              >
                <option value="2023-24">2023 - 2024 (Current)</option>
                <option value="2022-23">2022 - 2023</option>
                <option value="2021-22">2021 - 2022</option>
                <option value="2020-21">2020 - 2021</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
            </div>
          </div>
          <div className="p-4 bg-surface-container rounded-lg border border-outline-variant/30 flex gap-3">
            <span className="material-symbols-outlined text-secondary text-xl">info</span>
            <ul className="text-xs text-on-surface-variant space-y-1 font-body-sm">
              <li>The certificate will be generated in PDF format.</li>
              <li>Includes savings, FD, and RD accounts linked to this ID.</li>
              <li>Interest values are updated as per the latest settlement date.</li>
            </ul>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="pt-4">
            <button
              className="w-full bg-secondary text-white font-label-md py-4 rounded-lg flex items-center justify-center gap-3 hover:brightness-90 active:scale-[0.98] transition-all shadow-md"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Certificate'}
              <span className="material-symbols-outlined">download</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterestCertificateForm;
