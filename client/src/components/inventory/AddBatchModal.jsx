import React, { useState } from 'react';

export default function AddBatchModal({ isOpen, onClose, flowers = [], onAddBatch }) {
  const [flowerId, setFlowerId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [shelfLife, setShelfLife] = useState('7');
  const [status, setStatus] = useState('Fresh');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!flowerId || !quantity || !harvestDate || !shelfLife) {
      alert('Please fill in all fields.');
      return;
    }
    onAddBatch({
      flower_id: flowerId,
      quantity: parseInt(quantity, 10),
      harvest_date: new Date(harvestDate).toISOString(),
      shelf_life: parseInt(shelfLife, 10),
      status
    });
    onClose();
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
      <div className='card-level-1 rounded-xl w-full max-w-md p-6 shadow-xl border border-outline-variant/50'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='font-headline-sm text-headline-sm text-primary font-bold'>Add Harvested Batch</h3>
          <button onClick={onClose} className='text-on-surface-variant hover:text-on-surface'>
            <span className='material-symbols-outlined'>close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block font-label-lg text-on-surface-variant mb-1'>Flower Type</label>
            <select
              value={flowerId}
              onChange={(e) => setFlowerId(e.target.value)}
              className='w-full bg-[#0F172A] border border-outline-variant/50 rounded-lg p-2 text-on-surface focus:outline-none focus:border-primary'
              required
            >
              <option value=''>Select Flower Type</option>
              {flowers.map((f) => (
                <option key={f.flower_id} value={f.flower_id}>
                  {f.flower_type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='block font-label-lg text-on-surface-variant mb-1'>Quantity (Stems)</label>
            <input
              type='number'
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className='w-full bg-[#0F172A] border border-outline-variant/50 rounded-lg p-2 text-on-surface focus:outline-none focus:border-primary'
              placeholder='e.g. 150'
              required
              min='1'
            />
          </div>
          <div>
            <label className='block font-label-lg text-on-surface-variant mb-1'>Harvest Date</label>
            <input
              type='date'
              value={harvestDate}
              onChange={(e) => setHarvestDate(e.target.value)}
              className='w-full bg-[#0F172A] border border-outline-variant/50 rounded-lg p-2 text-on-surface focus:outline-none focus:border-primary'
              required
            />
          </div>
          <div>
            <label className='block font-label-lg text-on-surface-variant mb-1'>Shelf Life (Days)</label>
            <input
              type='number'
              value={shelfLife}
              onChange={(e) => setShelfLife(e.target.value)}
              className='w-full bg-[#0F172A] border border-outline-variant/50 rounded-lg p-2 text-on-surface focus:outline-none focus:border-primary'
              placeholder='e.g. 7'
              required
              min='1'
            />
          </div>
          <div>
            <label className='block font-label-lg text-on-surface-variant mb-1'>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className='w-full bg-[#0F172A] border border-outline-variant/50 rounded-lg p-2 text-on-surface focus:outline-none focus:border-primary'
            >
              <option value='Fresh'>Fresh</option>
              <option value='Approaching Expiration'>Approaching Expiration</option>
              <option value='Expired'>Expired</option>
            </select>
          </div>
          <div className='flex justify-end gap-3 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 bg-surface-container-high text-on-surface rounded-lg font-label-lg hover:bg-surface-container-highest transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-primary text-on-primary rounded-lg font-label-lg hover:bg-primary-fixed transition-colors'
            >
              Add Batch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}