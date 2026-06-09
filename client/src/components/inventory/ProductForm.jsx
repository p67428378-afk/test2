import React, { useState, useEffect } from 'react';
import Button from '../common/Button.jsx';

export default function ProductForm({ item, onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');

  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setDescription(item.description || '');
      setCost(item.cost || '');
      setPrice(item.price || '');
      setStockQuantity(item.stock_quantity || '');
    } else {
      setName('');
      setDescription('');
      setCost('');
      setPrice('');
      setStockQuantity('');
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      cost: parseFloat(cost),
      price: parseFloat(price),
      stock_quantity: parseInt(stockQuantity, 10),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-surface-container p-6 rounded-xl border border-outline-variant/30">
      <h3 className="text-lg font-semibold text-on-surface">
        {item ? 'Edit Product' : 'Add New Product'}
      </h3>

      <div>
        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
          Product Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full bg-[#0F172A] border border-outline-variant/50 text-on-surface text-sm rounded-lg p-2.5 focus:outline-none focus:border-brand-indigo"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-[#0F172A] border border-outline-variant/50 text-on-surface text-sm rounded-lg p-2.5 focus:outline-none focus:border-brand-indigo"
          rows="3"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
            Cost ($)
          </label>
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            required
            min="0"
            step="0.01"
            className="w-full bg-[#0F172A] border border-outline-variant/50 text-on-surface text-sm rounded-lg p-2.5 focus:outline-none focus:border-brand-indigo"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
            Price ($)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            step="0.01"
            className="w-full bg-[#0F172A] border border-outline-variant/50 text-on-surface text-sm rounded-lg p-2.5 focus:outline-none focus:border-brand-indigo"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
            Stock Qty
          </label>
          <input
            type="number"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            required
            min="0"
            className="w-full bg-[#0F172A] border border-outline-variant/50 text-on-surface text-sm rounded-lg p-2.5 focus:outline-none focus:border-brand-indigo"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" onClick={onCancel} variant="secondary">
          Cancel
        </Button>
        <Button type="submit">
          {item ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
}