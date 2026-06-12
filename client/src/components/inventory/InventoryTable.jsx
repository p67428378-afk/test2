import React, { useState } from 'react';

export default function InventoryTable({ inventory = [], onUpdateItem }) {
  const [editingId, setEditingId] = useState(null);
  const [editQty, setEditEditQty] = useState(0);
  const [editStatus, setEditStatus] = useState('Fresh');

  const handleStartEdit = (item) => {
    setEditingId(item.inventory_id);
    setEditEditQty(item.quantity);
    setEditStatus(item.status);
  };

  const handleSave = (id) => {
    onUpdateItem(id, { quantity: parseInt(editQty, 10), status: editStatus });
    setEditingId(null);
  };

  return (
    <div className='card-level-1 rounded-xl flex flex-col micro-shadow overflow-hidden'>
      <div className='p-5 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low/50'>
        <div className='flex items-center gap-3'>
          <span className='material-symbols-outlined text-primary'>inventory_2</span>
          <h3 className='font-label-lg text-on-surface'>Harvested Flower Inventory</h3>
        </div>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='border-b border-outline-variant/50 bg-[#0F172A]/50'>
              <th className='py-3 px-5 font-label-sm text-on-surface-variant font-semibold'>Inventory ID</th>
              <th className='py-3 px-5 font-label-sm text-on-surface-variant font-semibold'>Flower Type</th>
              <th className='py-3 px-5 font-label-sm text-on-surface-variant font-semibold'>Quantity (Stems)</th>
              <th className='py-3 px-5 font-label-sm text-on-surface-variant font-semibold'>Harvest Date</th>
              <th className='py-3 px-5 font-label-sm text-on-surface-variant font-semibold'>Shelf Life (Days)</th>
              <th className='py-3 px-5 font-label-sm text-on-surface-variant font-semibold'>Status</th>
              <th className='py-3 px-5 font-label-sm text-on-surface-variant font-semibold'>Barcode / QR</th>
              <th className='py-3 px-5 font-label-sm text-on-surface-variant font-semibold'>Actions</th>
            </tr>
          </thead>
          <tbody className='font-data-mono text-data-mono'>
            {inventory.length === 0 ? (
              <tr>
                <td colSpan='8' className='py-8 text-center text-on-surface-variant'>
                  No inventory items found.
                </td>
              </tr>
            ) : (
              inventory.map((item) => {
                const isEditing = editingId === item.inventory_id;
                const barcodeValue = `FLWR-${item.inventory_id.substring(0, 8).toUpperCase()}`;

                return (
                  <tr key={item.inventory_id} className='border-b border-outline-variant/30 hover:bg-surface-container-low/50 transition-colors'>
                    <td className='py-3 px-5 text-on-surface'>{item.inventory_id.substring(0, 8).toUpperCase()}</td>
                    <td className='py-3 px-5 text-on-surface-variant'>{item.flower_type || 'Unknown'}</td>
                    <td className='py-3 px-5 text-on-surface'>
                      {isEditing ? (
                        <input
                          type='number'
                          value={editQty}
                          onChange={(e) => setEditEditQty(e.target.value)}
                          className='w-20 bg-[#0F172A] border border-outline-variant/50 rounded px-2 py-1 text-on-surface'
                        />
                      ) : (
                        item.quantity
                      )}
                    </td>
                    <td className='py-3 px-5 text-on-surface-variant'>
                      {new Date(item.harvest_date).toLocaleDateString()}
                    </td>
                    <td className='py-3 px-5 text-on-surface-variant'>{item.shelf_life}</td>
                    <td className='py-3 px-5'>
                      {isEditing ? (
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className='bg-[#0F172A] border border-outline-variant/50 rounded px-2 py-1 text-on-surface'
                        >
                          <option value='Fresh'>Fresh</option>
                          <option value='Approaching Expiration'>Approaching Expiration</option>
                          <option value='Expired'>Expired</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${
                          item.status === 'Fresh'
                            ? 'bg-primary/10 text-primary'
                            : item.status === 'Expired'
                            ? 'bg-red-500/10 text-red-500'
                            : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {item.status}
                        </span>
                      )}
                    </td>
                    <td className='py-3 px-5'>
                      <div className='flex flex-col items-start gap-1'>
                        <div className='bg-white p-1 rounded border border-gray-300 flex items-center justify-center'>
                          {/* Simple CSS-based barcode representation */}
                          <div className='flex items-center h-6 w-24 bg-white gap-[2px] px-1'>
                            <div className='w-[2px] h-full bg-black'></div>
                            <div className='w-[1px] h-full bg-black'></div>
                            <div className='w-[3px] h-full bg-black'></div>
                            <div className='w-[1px] h-full bg-black'></div>
                            <div className='w-[2px] h-full bg-black'></div>
                            <div className='w-[4px] h-full bg-black'></div>
                            <div className='w-[1px] h-full bg-black'></div>
                            <div className='w-[2px] h-full bg-black'></div>
                            <div className='w-[3px] h-full bg-black'></div>
                          </div>
                        </div>
                        <span className='text-[10px] text-on-surface-variant'>{barcodeValue}</span>
                      </div>
                    </td>
                    <td className='py-3 px-5'>
                      {isEditing ? (
                        <div className='flex gap-2'>
                          <button
                            onClick={() => handleSave(item.inventory_id)}
                            className='px-3 py-1 bg-primary text-on-primary rounded text-xs font-bold hover:bg-primary-fixed transition-colors'
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className='px-3 py-1 bg-surface-container-high text-on-surface rounded text-xs font-bold hover:bg-surface-container-highest transition-colors'
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(item)}
                          className='px-3 py-1 bg-surface-container-high text-on-surface rounded text-xs font-bold hover:bg-surface-container-highest transition-colors'
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}