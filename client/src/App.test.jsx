import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';

// Mock the API services
vi.mock('./services/api', () => ({
  getKpis: vi.fn(() => Promise.resolve({
    sales_per_linear_ft: 45.5,
    private_brand_percentage: 15.2,
    in_stock_rate: 94.8,
    shelf_capacity: 85,
  })),
  getSkus: vi.fn(() => Promise.resolve([
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa1',
      name: "Lay's Classic 13oz",
      weekly_sales: 1240.00,
      profit_margin: 24.00,
      days_of_supply: 12,
      recommended_action: 'GROW',
    }
  ])),
  submitDecision: vi.fn(() => Promise.resolve({
    id: '4fa85f64-5717-4562-b3fc-2c963f66afa6',
    scenario_name: 'Balanced',
    submitted_by: 'category_manager@dollargeneral.com',
    submitted_at: '2026-01-01T12:00:00Z',
    status: 'APPROVED',
    audit_id: 'AUDIT-12345',
  })),
}));

describe('DG Assortment Advisor App', () => {
  it('renders the sidebar and header', async () => {
    render(<App />);
    
    // Check that the main title is rendered
    const titleElements = screen.getAllByText(/DG Assortment Advisor/i);
    expect(titleElements.length).toBeGreaterThan(0);

    // Check that the user profile name is rendered
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });
});
