import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from './Dashboard';

// Mock the API services
vi.mock('../services/api', () => ({
  getDashboardKPIs: vi.fn(() => Promise.resolve({
    sales_linear_ft: 245.50,
    private_brand_pct: 18.5,
    in_stock_rate: 94.2,
    shelf_capacity: 82.0,
  })),
  getDashboardSKUs: vi.fn(() => Promise.resolve([
    {
      product_id: '1',
      sku: 'CV-POT-01',
      name: 'Clover Valley Potato Chips 10oz',
      margin: 38.5,
      sales: 1850,
      shelf_space: 10.0,
      in_stock: true,
      is_private_brand: true,
      status: 'GROW',
    },
  ])),
}));

describe('Dashboard Component', () => {
  it('renders loading state initially', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Loading dashboard.../i)).toBeInTheDocument();
  });

  it('renders KPI cards and SKU table after loading', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading dashboard.../i)).not.toBeInTheDocument();
    });

    // Check KPIs
    expect(screen.getByText('Sales/Linear Ft')).toBeInTheDocument();
    expect(screen.getByText('$245.50')).toBeInTheDocument();
    expect(screen.getByText('18.5%')).toBeInTheDocument();
    expect(screen.getByText('94.2%')).toBeInTheDocument();

    // Check SKU Table
    expect(screen.getByText('SKU Performance')).toBeInTheDocument();
    expect(screen.getByText('CV-POT-01')).toBeInTheDocument();
    expect(screen.getByText('Clover Valley Potato Chips 10oz')).toBeInTheDocument();
  });
});
