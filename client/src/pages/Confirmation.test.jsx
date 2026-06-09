import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Confirmation from './Confirmation';

// Mock useLocation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({
      state: {
        approvalId: 'test-approval-id',
        approverName: 'John Doe',
        scenarioName: 'Balanced',
        scenarioId: 'balanced',
        timestamp: '2026-06-09T20:57:47.438593+00:00',
        guardrailStatus: {
          new_sku_limit_check: 'PASS',
          private_brand_check: 'PASS',
          shelf_space_check: 'PASS',
        },
        itemsToAdd: [],
        itemsToRemove: [],
      }
    })
  };
});

describe('Confirmation Component', () => {
  it('renders confirmation details and audit trail', () => {
    render(
      <BrowserRouter>
        <Confirmation />
      </BrowserRouter>
    );

    expect(screen.getByText('Assortment Approved')).toBeInTheDocument();
    expect(screen.getByText('test-approval-id')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Balanced')).toBeInTheDocument();
  });
});
