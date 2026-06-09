import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ApprovalReview from './ApprovalReview';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock the API services
vi.mock('../services/api', () => ({
  getScenarios: vi.fn(() => Promise.resolve([
    {
      id: 'balanced',
      name: 'Balanced',
      description: 'Optimize assortment.',
      projected_sales_lift: 4.5,
      new_private_brand_pct: 44.1,
      shelf_space_impact_ft: 0.0,
      is_selected: true,
      items_to_add: [
        { sku: 'CV-PST-08', name: 'Clover Valley Pistachios 8oz', is_private_brand: true, shelf_space: 2.0 }
      ],
      items_to_remove: [
        { sku: 'CV-TOR-05', name: 'Clover Valley Tortilla Chips 13oz' }
      ],
    }
  ])),
  getDashboardKPIs: vi.fn(() => Promise.resolve({
    sales_linear_ft: 245.50,
    private_brand_pct: 18.5,
    in_stock_rate: 94.2,
    shelf_capacity: 82.0,
  })),
  getDashboardSKUs: vi.fn(() => Promise.resolve([
    { sku: '1', name: 'SKU 1', margin: 30, sales: 100, shelf_space: 5, in_stock: true, is_private_brand: false, status: 'MAINTAIN' },
    { sku: '2', name: 'SKU 2', margin: 30, sales: 100, shelf_space: 5, in_stock: true, is_private_brand: false, status: 'MAINTAIN' },
    { sku: '3', name: 'SKU 3', margin: 30, sales: 100, shelf_space: 5, in_stock: true, is_private_brand: false, status: 'MAINTAIN' },
    { sku: '4', name: 'SKU 4', margin: 30, sales: 100, shelf_space: 5, in_stock: true, is_private_brand: false, status: 'MAINTAIN' },
    { sku: '5', name: 'SKU 5', margin: 30, sales: 100, shelf_space: 5, in_stock: true, is_private_brand: false, status: 'MAINTAIN' },
    { sku: '6', name: 'SKU 6', margin: 30, sales: 100, shelf_space: 5, in_stock: true, is_private_brand: false, status: 'MAINTAIN' },
    { sku: '7', name: 'SKU 7', margin: 30, sales: 100, shelf_space: 5, in_stock: true, is_private_brand: false, status: 'MAINTAIN' },
    { sku: '8', name: 'SKU 8', margin: 30, sales: 100, shelf_space: 5, in_stock: true, is_private_brand: false, status: 'MAINTAIN' },
    { sku: '9', name: 'SKU 9', margin: 30, sales: 100, shelf_space: 5, in_stock: true, is_private_brand: false, status: 'MAINTAIN' },
    { sku: '10', name: 'SKU 10', margin: 30, sales: 100, shelf_space: 5, in_stock: true, is_private_brand: false, status: 'MAINTAIN' },
  ])),
  submitApproval: vi.fn(() => Promise.resolve({
    success: true,
    approval_id: 'test-approval-id',
    approver_name: 'John Doe',
    timestamp: '2026-06-09T20:57:47.438593+00:00',
    guardrail_status: {
      new_sku_limit_check: 'PASS',
      private_brand_check: 'PASS',
      shelf_space_check: 'PASS',
    }
  })),
}));

describe('ApprovalReview Component', () => {
  it('renders loading state initially', () => {
    render(<ApprovalReview />);
    expect(screen.getByText(/Loading approval review.../i)).toBeInTheDocument();
  });

  it('renders selected scenario and guardrails', async () => {
    render(<ApprovalReview />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading approval review.../i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('Balanced Scenario')).toBeInTheDocument();
    expect(screen.getByText('New SKU Limit Check')).toBeInTheDocument();
    expect(screen.getByText('Private Brand Check')).toBeInTheDocument();
    expect(screen.getByText('Shelf Space Check')).toBeInTheDocument();
  });

  it('allows submitting approval when form is filled', async () => {
    render(<ApprovalReview />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading approval review.../i)).not.toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Enter your full name');
    fireEvent.change(input, { target: { value: 'John Doe' } });

    const submitButton = screen.getByRole('button', { name: /Submit Approval/i });
    expect(submitButton).not.toBeDisabled();

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/confirmation', expect.any(Object));
    });
  });
});
