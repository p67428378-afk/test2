import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App.jsx';
import * as api from './services/api.js';

// Mock the API service
vi.mock('./services/api.js', () => ({
  getSnacksData: vi.fn(),
  submitReview: vi.fn(),
}));

const mockSnacksData = {
  kpis: {
    sales_per_linear_ft: 425.50,
    private_brand_pct: 24.5,
    in_stock_rate: 96.8,
    shelf_capacity: 92,
  },
  scenarios: {
    conservative: {
      name: 'Conservative',
      projected_sales_lift: 1.2,
      projected_private_brand_pct: 21.5,
      sku_actions: [
        { sku_id: 'sku-1', action: 'KEEP' },
      ],
      guardrails: [
        { name: 'Shelf Capacity Compliance', status: 'Passing' },
      ],
    },
    balanced: {
      name: 'Balanced',
      projected_sales_lift: 3.8,
      projected_private_brand_pct: 24.8,
      sku_actions: [
        { sku_id: 'sku-1', action: 'GROW' },
        { sku_id: 'sku-2', action: 'SWAP' },
      ],
      guardrails: [
        { name: 'Shelf Capacity Compliance', status: 'Passing' },
      ],
    },
    aggressive: {
      name: 'Aggressive',
      projected_sales_lift: 6.5,
      projected_private_brand_pct: 28.2,
      sku_actions: [
        { sku_id: 'sku-1', action: 'GROW' },
        { sku_id: 'sku-2', action: 'REMOVE' },
      ],
      guardrails: [
        { name: 'Shelf Capacity Compliance', status: 'Passing' },
      ],
    },
  },
  sku_performance: [
    {
      sku_id: 'sku-1',
      sku_number: '123456',
      name: "Lay's Classic 8oz",
      private_brand: false,
      sales_per_week: 520,
      in_stock_rate: 97.2,
      shelf_capacity_used: 12,
      status_badge: 'GROW',
    },
    {
      sku_id: 'sku-2',
      sku_number: '789012',
      name: 'Clover Valley Potato Chips 8oz',
      private_brand: true,
      sales_per_week: 310,
      in_stock_rate: 94.5,
      shelf_capacity_used: 10,
      status_badge: 'GROW',
    },
  ],
};

describe('DG Assortment Advisor Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    api.getSnacksData.mockReturnValue(new Promise(() => {}));
    render(<App />);
    expect(screen.getByText(/Loading Assortment Advisor.../i)).toBeInTheDocument();
  });

  it('renders error state when API fails', async () => {
    api.getSnacksData.mockRejectedValue(new Error('API Error'));
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/Connection Error/i)).toBeInTheDocument();
    });
  });

  it('renders dashboard with data successfully', async () => {
    api.getSnacksData.mockResolvedValue(mockSnacksData);
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Snacks Assortment Advisor')).toBeInTheDocument();
    });

    // Check KPIs
    expect(screen.getByText('$425.50')).toBeInTheDocument();
    expect(screen.getByText('24.5%')).toBeInTheDocument();
    expect(screen.getByText('96.8%')).toBeInTheDocument();

    // Check SKU Table
    expect(screen.getByText("Lay's Classic 8oz")).toBeInTheDocument();
    expect(screen.getByText('Clover Valley Potato Chips 8oz')).toBeInTheDocument();
  });

  it('allows selecting a different scenario and submitting', async () => {
    api.getSnacksData.mockResolvedValue(mockSnacksData);
    api.submitReview.mockResolvedValue({
      audit_id: 'audit-123',
      status: 'success',
      timestamp: '2026-06-09T12:00:00Z',
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Snacks Assortment Advisor')).toBeInTheDocument();
    });

    // Select Conservative scenario
    const conservativeCard = screen.getByText('Conservative');
    fireEvent.click(conservativeCard);

    // Submit the plan
    const submitButton = screen.getByRole('button', { name: /Submit Assortment Plan/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Assortment Plan Submitted Successfully')).toBeInTheDocument();
      expect(screen.getByText('audit-123')).toBeInTheDocument();
    });
  });
});