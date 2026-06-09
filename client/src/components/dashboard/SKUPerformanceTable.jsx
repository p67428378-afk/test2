import React, { useState, useEffect } from 'react';
import { getSkus } from '../../services/api';
import StatusBadge from './StatusBadge';
import TableFilters from './TableFilters';

const SKUPerformanceTable = () => {
  const [skus, setSkus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ sortBy: 'sales', filterByStatus: '' });

  useEffect(() => {
    setLoading(true);
    getSkus({ page, ...filters })
      .then(response => {
        setSkus(response.data.skus);
        setTotalPages(Math.ceil(response.data.total_skus / response.data.limit));
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching SKUs:", error);
        setError("Failed to load SKU data. Please try again later.");
        setLoading(false);
      });
  }, [page, filters]);

  const handleFilterChange = (newFilters) => {
    setPage(1);
    setFilters(newFilters);
  };

  const renderTableBody = () => {
    if (loading) {
      return (
        [...Array(10)].map((_, i) => (
          <tr key={i} className="animate-pulse">
            <td className="p-4"><div className="h-4 bg-gray-200 rounded"></div></td>
            <td className="p-4"><div className="h-4 bg-gray-200 rounded"></div></td>
            <td className="p-4"><div className="h-4 bg-gray-200 rounded"></div></td>
            <td className="p-4"><div className="h-4 bg-gray-200 rounded"></div></td>
            <td className="p-4"><div className="h-4 bg-gray-200 rounded"></div></td>
          </tr>
        ))
      );
    }

    if (error) {
        return <tr><td colSpan="5" className="text-center p-8 text-red-500 bg-red-50">{error}</td></tr>;
    }

    if (skus.length === 0) {
      return <tr><td colSpan="5" className="text-center p-8 text-gray-500">No SKUs found.</td></tr>;
    }

    return skus.map(sku => (
      <tr key={sku.id} className="border-b hover:bg-gray-50">
        <td className="p-4 font-medium text-gray-800">{sku.name}</td>
        <td className="p-4 text-gray-600">${sku.sales.toFixed(2)}</td>
        <td className="p-4 text-gray-600">{sku.profit_margin.toFixed(2)}%</td>
        <td className="p-4 text-gray-600">{sku.inventory_level}</td>
        <td className="p-4"><StatusBadge status={sku.status_badge} /></td>
      </tr>
    ));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold mb-4">SKU Performance</h2>
        <TableFilters onFilterChange={handleFilterChange} />
        <div className="overflow-x-auto mt-4">
            <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase font-semibold">
                <tr>
                <th className="p-4">SKU Name</th>
                <th className="p-4">Sales</th>
                <th className="p-4">Profit Margin</th>
                <th className="p-4">Inventory</th>
                <th className="p-4">Status</th>
                </tr>
            </thead>
            <tbody>
                {renderTableBody()}
            </tbody>
            </table>
        </div>
        <div className="flex justify-between items-center mt-4">
            <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
            >
                Previous
            </button>
            <span className="text-gray-600">Page {page} of {totalPages}</span>
            <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
            >
                Next
            </button>
        </div>
    </div>
  );
};

export default SKUPerformanceTable;
