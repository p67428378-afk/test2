import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Smoke Test', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/Update Registered Mobile Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Account Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/New Mobile Number/i)).toBeInTheDocument();
  });
});
