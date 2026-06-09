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

const mockData = {
  kpis: {
    sales_per_linear_ft: 425.50,
    private_brand_pct: 24.5,
    in_stock_rate: 96.8,
    shelf_capacity: 92,
  },
  sku_performance: [
    {
      sku_id: '1',
      sku_number: 'SKU-001',
      name: "Lay's Classic 8oz",
      private_brand: false,
      sales_per_week: 520.00,
      in_stock_rate: 97.2,
      status_badge: 'GROW',
    },
    {
      sku_id: '2',
      sku_number: 'SKU-002',
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
      projected_private_brand_pct: 21.5,
      actions_summary: 'Focus on low-risk swaps.',
      sku_actions: [
        { sku_id: '1', action: 'KEEP' },
      ],
      guardrails: [
        { name: 'Shelf Capacity Compliance', status: 'PASSING' },
      ],
    },
    balanced: {
      name: 'Balanced',
      projected_sales_lift: 3.8,
      projected_private_brand_pct: 24.8,
      actions_summary: 'Optimize shelf space.',
      sku_actions: [
        { sku_id: '1', action: 'KEEP' },
        { sku_id: '2', action: 'GROW' },
      ],
      guardrails: [
        { name: 'Shelf Capacity Compliance', status: 'PASSING' },
        { name: 'Private Brand Minimum (20%)', status: 'PASSING' },
      ],
    },
    aggressive: {
      name: 'Aggressive',
      projected_sales_lift: 6.5,
      projected_private_brand_pct: 28.2,
      actions_summary: 'Aggressively swap.',
      sku_actions: [
        { sku_id: '2', action: 'GROW' },
      ],
      guardrails: [
        { name: 'Shelf Capacity Compliance', status: 'PASSING' },
      ],
    },
  },
};

describe('DG Assortment Advisor App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollTo = vi.fn();
  });

  it('renders loading state initially', () => {
    api.getSnacksData.mockReturnValue(new Promise(() => {}));
    render(<App />);
    expect(screen.getByText(/Loading Assortment Advisor.../i)).toBeInTheDocument();
  });

  it('renders dashboard with data after successful fetch', async () => {
    api.getSnacksData.mockResolvedValue(mockData);
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading Assortment Advisor.../i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('Snacks Assortment Advisor')).toBeInTheDocument();
    expect(screen.getByText("$425.50")).toBeInTheDocument();
    expect(screen.getByText("24.5%")).toBeInTheDocument();
    expect(screen.getByText("96.8%")).toBeInTheDocument();
    expect(screen.getByText("92%")).toBeInTheDocument();

    expect(screen.getByText("Lay's Classic 8oz")).toBeInTheDocument();
    expect(screen.getByText("Clover Valley Potato Chips 8oz")).toBeInTheDocument();
  });

  it('handles scenario selection and updates the review panel', async () => {
    api.getSnacksData.mockResolvedValue(mockData);
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading Assortment Advisor.../i)).not.toBeInTheDocument();
    });

    // Balanced is selected by default
    expect(screen.getByText('Balanced Action Plan')).toBeInTheDocument();

    // Click Conservative scenario
    const conservativeCard = screen.getByText('Conservative');
    fireEvent.click(conservativeCard);

    expect(screen.getByText('Conservative Action Plan')).toBeInTheDocument();
  });

  it('handles successful submission and displays success banner', async () => {
    api.getSnacksData.mockResolvedValue(mockData);
    api.submitReview.mockResolvedValue({
      audit_id: 'AUDIT-12345',
      status: 'SUCCESS',
      timestamp: '2026-06-09T12:00:00.000Z',
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading Assortment Advisor.../i)).not.toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /Submit Assortment Plan/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Assortment Plan Submitted Successfully!')).toBeInTheDocument();
    });

    expect(screen.getByText('AUDIT-12345')).toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    api.getSnacksData.mockRejectedValue(new Error('API Error'));
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading Assortment Advisor.../i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Failed to load data from the server/i)).toBeInTheDocument();
  });
});
