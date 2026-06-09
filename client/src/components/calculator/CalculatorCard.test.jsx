import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CalculatorCard from './CalculatorCard.jsx';

// Mock the API services
vi.mock('../../services/api.js', () => ({
  calculate: vi.fn(() => Promise.resolve({ result: 10 })),
}));

describe('CalculatorCard Component Smoke Test', () => {
  it('renders display and buttons', () => {
    render(<CalculatorCard onCalculationSuccess={vi.fn()} />);
    // Check that the clear button is present
    expect(screen.getByText('C')).toBeInTheDocument();
    // Check that some numbers are present
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
  });
});