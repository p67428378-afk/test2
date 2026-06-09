import React, { useState, useEffect } from 'react';
import { getInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } from '../services/api.js';
import InventoryTable from '../components/inventory/InventoryTable.jsx';
import ProductForm from '../components/inventory/ProductForm.jsx';
import Button from '../components/common/Button.jsx';
import { Plus } from 'lucide-react';

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchInventoryData = async () => {
    try {
      const data = await getInventory();
      setItems(data);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const handleAddOrUpdate = async (productData) => {
    try {
      if (editingItem) {
        await updateInventoryItem(editingItem.product_id, productData);
      } else {
        await addInventoryItem(productData);
      }
      setShowForm(false);
      setEditingItem(null);
      fetchInventoryData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to save product.');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteInventoryItem(productId);
        fetchInventoryData();
      } catch (err) {
        alert(err.response?.data?.detail || 'Failed to delete product.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-brand-indigo font-semibold">Loading inventory...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Inventory Management</h1>
          <p className="text-sm text-on-surface-variant mt-1">Manage glass products, materials, costs, and stock levels.</p>
        </div>
        {!showForm && (
          <Button onClick={() => { setEditingItem(null); setShowForm(true); }}>
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        )}
      </div>

      {showForm && (
        <div className="max-w-2xl">
          <ProductForm
            item={editingItem}
            onSubmit={handleAddOrUpdate}
            onCancel={() => { setShowForm(false); setEditingItem(null); }}
          />
        </div>
      )}

      <InventoryTable
        items={items}
        onEdit={(item) => { setEditingItem(item); setShowForm(true); }}
        onDelete={handleDelete}
      />
    </div>
  );
}