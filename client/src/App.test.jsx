import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import * as api from './services/api';

// Mock the api service
vi.mock('./services/api', () => ({
  calculate: vi.fn(),
}));

describe('MathFlow Calculator App', () => {
  it('renders the calculator and history sidebar', () => {
    render(<App />);
    
    // Check header
    expect(screen.getByText('MathFlow')).toBeInTheDocument();
    expect(screen.getByText('API Connected')).toBeInTheDocument();
    
    // Check calculator display
    expect(screen.getByTestId('display-value')).toHaveTextContent('0');
    
    // Check history sidebar
    expect(screen.getByText('Calculation History')).toBeInTheDocument();
    expect(screen.getByText('45 + 55')).toBeInTheDocument();
    expect(screen.getByText('= 100')).toBeInTheDocument();
  });

  it('clears history when clear history button is clicked', () => {
    render(<App />);
    
    const clearButton = screen.getByRole('button', { name: /clear history/i });
    fireEvent.click(clearButton);
    
    expect(screen.getByText('No calculations yet')).toBeInTheDocument();
  });

  it('performs basic arithmetic operations via API', async () => {
    vi.mocked(api.calculate).mockResolvedValue({ result: 12 });
    
    render(<App />);
    
    // Click 7
    fireEvent.click(screen.getByRole('button', { name: '7' }));
    expect(screen.getByTestId('display-value')).toHaveTextContent('7');
    
    // Click +
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    expect(screen.getByTestId('display-expression')).toHaveTextContent('7 +');
    
    // Click 5
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    expect(screen.getByTestId('display-value')).toHaveTextContent('5');
    
    // Click =
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    
    await waitFor(() => {
      expect(api.calculate).toHaveBeenCalledWith(7, 5, '+');
      expect(screen.getByTestId('display-value')).toHaveTextContent('12');
    });
  });

  it('handles division by zero gracefully on client side', () => {
    render(<App />);
    
    // Click 8
    fireEvent.click(screen.getByRole('button', { name: '8' }));
    
    // Click /
    fireEvent.click(screen.getByRole('button', { name: '/' }));
    
    // Click 0
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    
    // Click =
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    
    expect(screen.getByTestId('display-value')).toHaveTextContent('Error');
  });
});