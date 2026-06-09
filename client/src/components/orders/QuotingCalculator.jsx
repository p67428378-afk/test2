import React, { useState, useEffect } from 'react';
import { getCustomers, getInventory, createQuote } from '../../services/api.js';
import Button from '../common/Button.jsx';

export default function QuotingCalculator({ onQuoteCreated }) {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [discount, setDiscount] = useState('0');
  const [calculatedPrice, setCalculatedPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersData, inventoryData] = await Promise.all([
          getCustomers(),
          getInventory()
        ]);
        setCustomers(customersData);
        setProducts(inventoryData);
        if (customersData.length > 0) setSelectedCustomerId(customersData[0].customer_id);
        if (inventoryData.length > 0) setSelectedProductId(inventoryData[0].product_id);
      } catch (err) {
        console.error('Error fetching calculator data:', err);
      }
    };
    fetchData();
  }, []);

  // Calculate price locally when inputs change
  useEffect(() => {
    if (!selectedProductId || !width || !height) {
      setCalculatedPrice(null);
      return;
    }

    const product = products.find(p => p.product_id === selectedProductId);
    if (!product) return;

    const w = parseFloat(width);
    const h = parseFloat(height);
    const d = parseFloat(discount) || 0;

    if (isNaN(w) || w <= 0 || isNaN(h) || h <= 0) {
      setCalculatedPrice(null);
      return;
    }

    // Simple pricing rule: area (sq inches) * price per unit, minus discount percentage
    const area = w * h;
    const basePrice = (area / 144) * parseFloat(product.price || 10); // price per sq ft
    const finalPrice = basePrice * (1 - d / 100);
    setCalculatedPrice(Math.max(0, finalPrice));
  }, [selectedProductId, width, height, discount, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomerId || !selectedProductId || !width || !height) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const quoteData = {
        customer_id: selectedCustomerId,
        glass_type_id: selectedProductId,
        width: parseFloat(width),
        height: parseFloat(height),
        discount: parseFloat(discount) || 0
      };

      const newQuote = await createQuote(quoteData);
      setSuccess('Quote created successfully!');
      setWidth('');
      setHeight('');
      setDiscount('0');
      if (onQuoteCreated) onQuoteCreated(newQuote);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create quote.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-xl p-6">
      <h2 className="text-lg font-semibold text-on-surface mb-4">New Quote Calculator</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-error-container/20 border border-error/30 text-error rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
            Customer
          </label>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="w-full bg-[#0F172A] border border-outline-variant/50 text-on-surface text-sm rounded-lg p-2.5 focus:outline-none focus:border-brand-indigo"
          >
            {customers.map((c) => (
              <option key={c.customer_id} value={c.customer_id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
            Glass Type / Material
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full bg-[#0F172A] border border-outline-variant/50 text-on-surface text-sm rounded-lg p-2.5 focus:outline-none focus:border-brand-indigo"
          >
            {products.map((p) => (
              <option key={p.product_id} value={p.product_id}>
                {p.name} (${parseFloat(p.price).toFixed(2)}/sq.ft)
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
              Width (inches)
            </label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="e.g. 24"
              min="1"
              step="0.1"
              required
              className="w-full bg-[#0F172A] border border-outline-variant/50 text-on-surface text-sm rounded-lg p-2.5 focus:outline-none focus:border-brand-indigo"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
              Height (inches)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="e.g. 36"
              min="1"
              step="0.1"
              required
              className="w-full bg-[#0F172A] border border-outline-variant/50 text-on-surface text-sm rounded-lg p-2.5 focus:outline-none focus:border-brand-indigo"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
            Discount (%)
          </label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="0"
            min="0"
            max="100"
            className="w-full bg-[#0F172A] border border-outline-variant/50 text-on-surface text-sm rounded-lg p-2.5 focus:outline-none focus:border-brand-indigo"
          />
        </div>

        {calculatedPrice !== null && (
          <div className="p-4 bg-brand-indigo/10 border border-brand-indigo/20 rounded-lg flex justify-between items-center">
            <span className="text-sm font-medium text-on-surface-variant">Estimated Price:</span>
            <span className="text-2xl font-bold text-brand-indigo">${calculatedPrice.toFixed(2)}</span>
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Creating...' : 'Generate Quote'}
        </Button>
      </form>
    </div>
  );
}