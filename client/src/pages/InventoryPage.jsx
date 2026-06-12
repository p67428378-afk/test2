import React, { useEffect, useState } from 'react';
import InventoryTable from '../components/inventory/InventoryTable.jsx';
import AddBatchModal from '../components/inventory/AddBatchModal.jsx';
import { getInventory, getFlowers, createInventoryItem, updateInventoryItem } from '../services/api.js';

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [flowers, setFlowers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [inventoryData, flowersData] = await Promise.all([
        getInventory(),
        getFlowers()
      ]);
      setInventory(inventoryData);
      setFlowers(flowersData);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddBatch = async (batchData) => {
    try {
      await createInventoryItem(batchData);
      await fetchData();
    } catch (error) {
      console.error('Error adding inventory batch:', error);
    }
  };

  const handleUpdateItem = async (id, updateData) => {
    try {
      await updateInventoryItem(id, updateData);
      await fetchData();
    } catch (error) {
      console.error('Error updating inventory item:', error);
    }
  };

  if (loading) {
    return <div className='text-center py-12 text-on-surface-variant'>Loading inventory...</div>;
  }

  return (
    <div className='space-y-gutter'>
      <div className='flex justify-between items-center'>
        <div>
          <h3 className='font-headline-sm text-headline-sm text-primary font-bold'>Inventory Management</h3>
          <p className='font-label-sm text-on-surface-variant mt-1'>
            Track and manage harvested flower batches, shelf life, and barcodes.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className='bg-primary-container text-on-primary-container font-label-lg py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-primary transition-colors duration-200 shadow-sm'
        >
          <span className='material-symbols-outlined text-[20px]'>add</span>
          Add Harvested Batch
        </button>
      </div>

      <InventoryTable inventory={inventory} onUpdateItem={handleUpdateItem} />

      <AddBatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        flowers={flowers}
        onAddBatch={handleAddBatch}
      />
    </div>
  );
}