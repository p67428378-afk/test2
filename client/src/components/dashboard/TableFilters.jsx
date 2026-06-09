import React, { useState } from 'react';

const TableFilters = ({ onFilterChange }) => {
  const [sortBy, setSortBy] = useState('sales');
  const [filterByStatus, setFilterByStatus] = useState('');

  const handleApplyFilters = () => {
    onFilterChange({ sortBy, filterByStatus });
  };

  return (
    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
      <div>
        <label htmlFor="sort-by" className="text-sm font-medium text-gray-700 mr-2">Sort by:</label>
        <select 
          id="sort-by" 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="sales">Sales</option>
          <option value="profit_margin">Profit Margin</option>
          <option value="inventory_level">Inventory</option>
        </select>
      </div>
      <div>
        <label htmlFor="filter-by-status" className="text-sm font-medium text-gray-700 mr-2">Status:</label>
        <select 
          id="filter-by-status" 
          value={filterByStatus} 
          onChange={(e) => setFilterByStatus(e.target.value)}
          className="border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">All</option>
          <option value="GROW">Grow</option>
          <option value="MAINTAIN">Maintain</option>
          <option value="SWAP">Swap</option>
          <option value="REDUCE">Reduce</option>
        </select>
      </div>
      <button 
        onClick={handleApplyFilters}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Apply
      </button>
    </div>
  );
};

export default TableFilters;
