import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock the API calls
vi.mock('./services/api', () => ({
  getDashboardKPIs: vi.fn(() => Promise.resolve({
    in_stock_rate_pct: 96.8,
    private_brand_pct: 24.5,
    sales_per_linear_ft: 1245.50,
    shelf_capacity_pct: 88.2
  })),
  getSKUPerformance: vi.fn(() => Promise.resolve({
    items: [
      {
        sku_id: '10482000-0000-0000-0000-000000000000',
        name: 'Clover Valley Potato Chips 10oz',
        brand: 'Private Brand',
        sales: 14250.00,
        units: 1200,
        profit: 5486.25,
        gm_pct: 38.5,
        status_badge: 'GROW'
      }
    ],
    limit: 10,
    page: 1,
    total: 1
  })),
  getDefaultScenarios: vi.fn(() => Promise.resolve({
    scenarios: [
      {
        scenario_id: 'b0000000-0000-0000-0000-000000000002',
        name: 'Balanced',
        projected_sales: 66220.00,
        change_in_private_brand_pct: 2.4,
        shelf_utilization_pct: 88.2,
        is_selected: true
      }
    ]
  }))
}));

describe('App Component Smoke Test', () => {
  it('renders the App layout and sidebar', async () => {
    render(<App />);
    
    // Check if Dollar General header is present
    const headerElement = await screen.findByText(/Dollar General/i);
    expect(headerElement).toBeInTheDocument();

    // Check if Category Management text is present
    const subHeaderElement = await screen.findByText(/Category Management/i);
    expect(subHeaderElement).toBeInTheDocument();
  });
});
