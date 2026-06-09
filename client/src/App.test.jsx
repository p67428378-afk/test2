import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App.jsx';
import { getSnacksData, submitReview } from './services/api.js';

// Mock the API service
vi.mock('./services/api.js', () => ({
  getSnacksData: vi.fn(),
  submitReview: vi.fn(),
}));

const mockData = {
  kpis: {
    sales_per_linear_ft: 425.50,
    private_brand_pct: 24.5,
    in_stock_rate: 96.8,
    shelf_capacity: 92,
  },
  sku_performance: [
    {
      sku_id: 'sku-1',
      sku_number: '10001',
      name: "Lay's Classic 8oz",
      private_brand: false,
      sales_per_week: 520.00,
      in_stock_rate: 97.2,
      status_badge: 'GROW',
    },
    {
      sku_id: 'sku-2',
      sku_number: '10002',
      name: 'Clover Valley Potato Chips 8oz',
      private_brand: true,
      sales_per_week: 310.00,
      in_stock_rate: 94.5,
      status_badge: 'GROW',
    },
  ],
  scenarios: {
    conservative: {
      name: 'Conservative',
      projected_sales_lift: 1.2,
      projected_private_brand_pct: 22.0,
      actions_summary: 'Conservative plan summary',
      sku_actions: [{ sku_id: 'sku-1', action: 'MAINTAIN' }],
      guardrails: [{ name: 'Shelf Capacity Compliance', status: 'Passing' }],
    },
    balanced: {
      name: 'Balanced',
      projected_sales_lift: 3.8,
      projected_private_brand_pct: 24.8,
      actions_summary: 'Balanced plan summary',
      sku_actions: [{ sku_id: 'sku-1', action: 'GROW' }],
      guardrails: [{ name: 'Shelf Capacity Compliance', status: 'Passing' }],
    },
    aggressive: {
      name: 'Aggressive',
      projected_sales_lift: 6.5,
      projected_private_brand_pct: 28.0,
      actions_summary: 'Aggressive plan summary',
      sku_actions: [{ sku_id: 'sku-1', action: 'GROW' }],
      guardrails: [{ name: 'Shelf Capacity Compliance', status: 'Passing' }],
    },
  },
};

describe('DG Assortment Advisor App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSnacksData.mockResolvedValue(mockData);
  });

  it('renders loading state initially', () => {
    render(<App />);
    expect(screen.getByText(/Loading Assortment Advisor.../i)).toBeInTheDocument();
  });

  it('renders dashboard after loading data', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading Assortment Advisor.../i)).not.toBeInTheDocument();
    });

    // Check title
    expect(screen.getByText('Snacks Assortment Advisor')).toBeInTheDocument();

    // Check KPIs
    expect(screen.getByText('$425.50')).toBeInTheDocument();
    expect(screen.getByText('24.5%')).toBeInTheDocument();
    expect(screen.getByText('96.8%')).toBeInTheDocument();

    // Check SKU table
    expect(screen.getByText("Lay's Classic 8oz")).toBeInTheDocument();
    expect(screen.getByText('Clover Valley Potato Chips 8oz')).toBeInTheDocument();
  });

  it('allows selecting a different scenario', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading Assortment Advisor.../i)).not.toBeInTheDocument();
    });

    // Balanced is selected by default
    expect(screen.getByText('Balanced plan summary')).toBeInTheDocument();

    // Click Conservative scenario
    const conservativeCard = screen.getByText('Conservative');
    fireEvent.click(conservativeCard);

    // Conservative summary should be shown
    expect(screen.getByText('Conservative plan summary')).toBeInTheDocument();
  });

  it('submits the assortment plan successfully', async () => {
    submitReview.mockResolvedValue({
      audit_id: 'audit-12345',
      status: 'SUCCESS',
      timestamp: '2026-06-09T12:00:00.000Z',
    });

    // Mock window.scrollTo
    window.scrollTo = vi.fn();

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading Assortment Advisor.../i)).not.toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /Submit Assortment Plan/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitReview).toHaveBeenCalledWith('balanced', [{ sku_id: 'sku-1', action: 'GROW' }]);
    });

    // Success banner should be displayed
    expect(screen.getByText('Assortment Plan Submitted Successfully!')).toBeInTheDocument();
    expect(screen.getByText('audit-12345')).toBeInTheDocument();
  });
});
