import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App.jsx';

// Mock the API services
vi.mock('./services/api.js', () => ({
  getCalculations: vi.fn(() => Promise.resolve([])),
  clearCalculations: vi.fn(() => Promise.resolve({ message: 'History cleared' })),
  calculate: vi.fn(() => Promise.resolve({ result: 10 })),
}));

describe('App Component Smoke Test', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Simple Calculator')).toBeInTheDocument();
    expect(screen.getByText('Recent Calculations')).toBeInTheDocument();
  });
});