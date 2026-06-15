import React from 'react';

const PositionsTable = ({ positions }) => {
  return (
    <div className='bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full text-left'>
          <thead className='bg-surface-container-low border-b border-outline-variant'>
            <tr>
              <th className='px-4 py-3 font-label-caps text-xs text-on-surface-variant'>Instrument</th>
              <th className='px-4 py-3 font-label-caps text-xs text-on-surface-variant text-right'>Quantity</th>
              <th className='px-4 py-3 font-label-caps text-xs text-on-surface-variant text-right'>Avg Price</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-outline-variant/30'>
            {positions.map((position) => (
              <tr key={position.instrument_id} className='hover:bg-primary/5 transition-colors'>
                <td className='px-4 py-3 font-bold text-on-surface'>{position.instrument_id}</td>
                <td className='px-4 py-3 font-data-tabular text-sm text-right'>{position.quantity}</td>
                <td className='px-4 py-3 font-data-tabular text-sm text-right'>${position.average_price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PositionsTable;
