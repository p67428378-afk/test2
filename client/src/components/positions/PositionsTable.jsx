import React from 'react';

const PositionsTable = ({ positions }) => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
      <div className="px-lg py-md border-b border-outline-variant bg-surface-bright flex items-center justify-between">
        <h3 className="font-title-sm text-title-sm text-on-surface">Current Positions</h3>
        <span className="font-body-sm text-on-surface-variant italic">Live update enabled</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left zebra-table">
          <thead className="bg-surface-container-low border-b border-outline-variant">
            <tr>
              <th className="px-lg py-sm font-label-caps text-label-caps text-on-surface-variant">Instrument</th>
              <th className="px-lg py-sm font-label-caps text-label-caps text-on-surface-variant text-right">Quantity</th>
              <th className="px-lg py-sm font-label-caps text-label-caps text-on-surface-variant text-right">Avg Price</th>
              <th className="px-lg py-sm font-label-caps text-label-caps text-on-surface-variant text-right">Current Price</th>
              <th className="px-lg py-sm font-label-caps text-label-caps text-on-surface-variant text-right">P&L</th>
              <th className="px-lg py-sm font-label-caps text-label-caps text-on-surface-variant text-right">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {positions && positions.map((position) => (
              <tr key={position.instrument_id}>
                <td className="px-lg py-md font-bold text-on-surface">{position.instrument_id}</td>
                <td className="px-lg py-md font-data-tabular text-data-tabular text-right">{position.quantity}</td>
                <td className="px-lg py-md font-data-tabular text-data-tabular text-right">${position.average_price.toFixed(2)}</td>
                <td className="px-lg py-md font-data-tabular text-data-tabular text-right">${position.current_price.toFixed(2)}</td>
                <td className={`px-lg py-md font-data-tabular text-data-tabular text-right font-bold ${position.pnl >= 0 ? 'text-[#28A745]' : 'text-[#DC3545]'}`}>
                  {position.pnl >= 0 ? '+' : '-'}${Math.abs(position.pnl).toFixed(2)}
                </td>
                <td className="px-lg py-md font-data-tabular text-data-tabular text-right text-on-surface-variant">{new Date(position.updated_at).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PositionsTable;
