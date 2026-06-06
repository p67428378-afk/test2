import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App.jsx';

// Mock the API services
vi.mock('./services/api.js', () => ({
  getKPIs: vi.fn(() => Promise.resolve({
    sales_per_linear_ft: 1245.50,
    sales_per_linear_ft_change: 8.2,
    private_brand_percentage: 24.5,
    private_brand_target: 30.0,
    in_stock_rate: 96.8,
    in_stock_target: 95.0,
    shelf_capacity_percentage: 88,
    shelf_capacity_used: 88,
    shelf_capacity_total: 100
  })),
  getSKUsPerformance: vi.fn(() => Promise.resolve([
    {
      sku_id: 'SKU-40129',
      product_name: 'Clover Valley Potato Chips 10oz',
      brand: 'Clover Valley [Private Brand]',
      weekly_sales: 1450.00,
      linear_ft: 2.0,
      sales_per_linear_ft: 725.00,
      status: 'GROW'
    }
  ])),
  getScenarioProjections: vi.fn(() => Promise.resolve([])),
  getScenarioDetails: vi.fn(() => Promise.resolve({})),
  submitScenario: vi.fn(() => Promise.resolve({})),
  getAudits: vi.fn(() => Promise.resolve([]))
}));

describe('App Smoke Test', () => {
  it('renders without crashing', async () => {
    render(<App />);
    // Verify that the main layout elements are present
    const titleElement = await screen.findByText('DG Assortment Advisor');
    expect(titleElement).toBeInTheDocument();
  });
});
