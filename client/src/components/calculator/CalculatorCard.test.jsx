import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CalculatorCard from './CalculatorCard';
import * as api from '../../services/api';

// Mock the api service
vi.mock('../../services/api', () => ({
  calculate: vi.fn(),
}));

describe('CalculatorCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the calculator display and buttons', () => {
    render(<CalculatorCard />);
    
    // Check display is present
    expect(screen.getByTestId('current-display')).toBeInTheDocument();
    
    // Check some key buttons are present
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('+/-')).toBeInTheDocument();
    expect(screen.getByText('%')).toBeInTheDocument();
    expect(screen.getByText('/')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('+')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('.')).toBeInTheDocument();
    expect(screen.getByText('=')).toBeInTheDocument();
  });

  it('updates display when digit buttons are clicked', () => {
    render(<CalculatorCard />);
    
    const btn7 = screen.getByText('7');
    const btn5 = screen.getByText('5');
    
    fireEvent.click(btn7);
    fireEvent.click(btn5);
    
    expect(screen.getByTestId('current-display')).toHaveTextContent('75');
  });

  it('calls the calculate API when equals is clicked', async () => {
    api.calculate.mockResolvedValue({ result: 12, error: null });
    
    render(<CalculatorCard />);
    
    // Input: 7 + 5 =
    fireEvent.click(screen.getByText('7'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('='));
    
    await waitFor(() => {
      expect(api.calculate).toHaveBeenCalledWith('7', '5', '+');
    });
    
    expect(screen.getByTestId('current-display')).toHaveTextContent('12');
    expect(screen.getByTestId('history-display')).toHaveTextContent('7 + 5 =');
  });

  it('handles division by zero error from API', async () => {
    api.calculate.mockResolvedValue({ result: null, error: 'Division by zero' });
    
    render(<CalculatorCard />);
    
    // Input: 8 / 0 =
    fireEvent.click(screen.getByText('8'));
    fireEvent.click(screen.getByText('/'));
    fireEvent.click(screen.getByText('0'));
    fireEvent.click(screen.getByText('='));
    
    await waitFor(() => {
      expect(api.calculate).toHaveBeenCalledWith('8', '0', '/');
    });
    
    expect(screen.getByTestId('current-display')).toHaveTextContent('Division by zero');
  });

  it('clears the display when C is clicked', () => {
    render(<CalculatorCard />);
    
    fireEvent.click(screen.getByText('9'));
    expect(screen.getByTestId('current-display')).toHaveTextContent('9');
    
    fireEvent.click(screen.getByText('C'));
    expect(screen.getByTestId('current-display')).toHaveTextContent('0');
  });
});
