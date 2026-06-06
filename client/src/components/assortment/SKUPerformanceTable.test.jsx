import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SKUPerformanceTable from './SKUPerformanceTable.jsx';

describe('SKUPerformanceTable Component', () => {
  const mockSKUs = [
    {
      sku_id: 'SKU-40129',
      product_name: 'Clover Valley Potato Chips 10oz',
      brand: 'Clover Valley [Private Brand]',
      weekly_sales: 1450.00,
      linear_ft: 2.0,
      sales_per_linear_ft: 725.00,
      status: 'GROW'
    }
  ];

  it('renders table headers and rows correctly', () => {
    render(<SKUPerformanceTable skus={mockSKUs} />);

    // Check headers
    expect(screen.getByText('SKU ID')).toBeInTheDocument();
    expect(screen.getByText('Product Name')).toBeInTheDocument();
    expect(screen.getByText('Weekly Sales')).toBeInTheDocument();

    // Check row data
    expect(screen.getByText('SKU-40129')).toBeInTheDocument();
    expect(screen.getByText('Clover Valley Potato Chips 10oz')).toBeInTheDocument();
    expect(screen.getByText('$1,450.00')).toBeInTheDocument();
    expect(screen.getByText('GROW')).toBeInTheDocument();
  });

  it('calls onOptimize when optimize button is clicked', () => {
    const handleOptimize = vi.fn();
    render(<SKUPerformanceTable skus={mockSKUs} onOptimize={handleOptimize} />);

    const optimizeButton = screen.getByRole('button', { name: 'Optimize' });
    fireEvent.click(optimizeButton);

    expect(handleOptimize).toHaveBeenCalledWith(mockSKUs[0]);
  });
});
