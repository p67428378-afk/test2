import React, { useState, useEffect } from "react";
import { loanService } from "../../services/api";
import { Calculator, DollarSign, Calendar, Percent } from "lucide-react";

export default function EMICalculator({ selectedProduct, products }) {
  const [productId, setProductId] = useState("");
  const [amount, setAmount] = useState(50000);
  const [tenure, setTenure] = useState(24);
  const [rate, setRate] = useState(10.5);
  const [calculation, setCalculation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Sync with selected product from parent
  useEffect(() => {
    if (selectedProduct) {
      setProductId(selectedProduct.id);
      setRate(selectedProduct.interest_rate);
      // Clamp amount and tenure to product limits
      const maxAmt = parseFloat(selectedProduct.max_loan_amount);
      if (amount > maxAmt) setAmount(maxAmt);
      if (tenure < selectedProduct.min_tenure_months)
        setTenure(selectedProduct.min_tenure_months);
      if (tenure > selectedProduct.max_tenure_months)
        setTenure(selectedProduct.max_tenure_months);
    } else if (products && products.length > 0 && !productId) {
      const first = products[0];
      setProductId(first.id);
      setRate(first.interest_rate);
    }
  }, [selectedProduct, products]);

  // Handle product dropdown change
  const handleProductChange = (e) => {
    const id = e.target.value;
    setProductId(id);
    const prod = products.find((p) => p.id === id);
    if (prod) {
      setRate(prod.interest_rate);
      const maxAmt = parseFloat(prod.max_loan_amount);
      if (amount > maxAmt) setAmount(maxAmt);
      if (tenure < prod.min_tenure_months) setTenure(prod.min_tenure_months);
      if (tenure > prod.max_tenure_months) setTenure(prod.max_tenure_months);
    }
  };

  // Real-time calculation trigger
  useEffect(() => {
    if (!amount || !tenure || !rate) {
      setCalculation(null);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const res = await loanService.calculateEMI({
          loan_amount: parseFloat(amount),
          interest_rate: parseFloat(rate),
          tenure_months: parseInt(tenure, 10),
        });
        setCalculation(res);
      } catch (err) {
        setError("Failed to calculate EMI. Please check inputs.");
        setCalculation(null);
      } finally {
        setLoading(false);
      }
    }, 300); // Debounce API calls

    return () => clearTimeout(delayDebounce);
  }, [amount, tenure, rate]);

  const activeProduct = products.find((p) => p.id === productId);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-bold text-slate-900">
          Real-Time EMI Calculator
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Select Loan Product
            </label>
            <select
              value={productId}
              onChange={handleProductChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">-- Select Product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.interest_rate}%)
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-medium text-slate-700">
                Loan Amount ($)
              </label>
              {activeProduct && (
                <span className="text-xs text-slate-500">
                  Max: $
                  {parseFloat(activeProduct.max_loan_amount).toLocaleString()}
                </span>
              )}
            </div>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <DollarSign className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value ? parseFloat(e.target.value) : "")
                }
                max={
                  activeProduct
                    ? parseFloat(activeProduct.max_loan_amount)
                    : undefined
                }
                className="block w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter loan amount"
              />
            </div>
            {activeProduct && (
              <input
                type="range"
                min="1000"
                max={parseFloat(activeProduct.max_loan_amount)}
                step="1000"
                value={amount || 0}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                className="w-full mt-2 accent-indigo-600"
              />
            )}
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-medium text-slate-700">
                Tenure (Months)
              </label>
              {activeProduct && (
                <span className="text-xs text-slate-500">
                  Range: {activeProduct.min_tenure_months} -{" "}
                  {activeProduct.max_tenure_months}m
                </span>
              )}
            </div>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Calendar className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="number"
                value={tenure}
                onChange={(e) =>
                  setTenure(e.target.value ? parseInt(e.target.value, 10) : "")
                }
                min={
                  activeProduct ? activeProduct.min_tenure_months : undefined
                }
                max={
                  activeProduct ? activeProduct.max_tenure_months : undefined
                }
                className="block w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter tenure in months"
              />
            </div>
            {activeProduct && (
              <input
                type="range"
                min={activeProduct.min_tenure_months}
                max={activeProduct.max_tenure_months}
                step="1"
                value={tenure || 0}
                onChange={(e) => setTenure(parseInt(e.target.value, 10))}
                className="w-full mt-2 accent-indigo-600"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Interest Rate (% p.a.)
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Percent className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="number"
                step="0.1"
                value={rate}
                onChange={(e) =>
                  setRate(e.target.value ? parseFloat(e.target.value) : "")
                }
                className="block w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Interest rate"
              />
            </div>
          </div>
        </div>

        {/* Outputs */}
        <div className="bg-slate-50 rounded-xl p-6 flex flex-col justify-center border border-slate-100">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
              <p className="text-sm text-slate-500">
                Calculating repayments...
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-red-600 text-sm">{error}</div>
          )}

          {!loading && !error && calculation && (
            <div className="space-y-6">
              <div className="text-center border-b border-slate-200 pb-6">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                  Estimated Monthly EMI
                </p>
                <p className="text-4xl font-extrabold text-indigo-600 mt-1">
                  $
                  {parseFloat(calculation.emi).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <p className="text-xs font-medium text-slate-500 uppercase">
                    Total Interest
                  </p>
                  <p className="text-lg font-bold text-slate-800 mt-1">
                    $
                    {parseFloat(calculation.total_interest).toLocaleString(
                      undefined,
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                    )}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <p className="text-xs font-medium text-slate-500 uppercase">
                    Total Repayment
                  </p>
                  <p className="text-lg font-bold text-slate-800 mt-1">
                    $
                    {parseFloat(calculation.total_repayment).toLocaleString(
                      undefined,
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && !calculation && (
            <div className="text-center py-8 text-slate-400 text-sm">
              Select a product and enter valid inputs to see real-time EMI
              calculation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
