import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CalculatorCard from './CalculatorCard';

// Mock the API service
vi.mock('../../services/api', () => ({
  calculatePost: vi.fn(() => Promise.resolve({ success: true, data: { result: 10 }, status: 200, statusText: 'OK', duration: 5, request: { method: 'POST', url: '/api/v1/calculate' } })),
  calculateGet: vi.fn(() => Promise.resolve({ success: true, data: { result: 10 }, status: 200, statusText: 'OK', duration: 5, request: { method: 'GET', url: '/api/v1/calculate' } })),
}));

describe('CalculatorCard Component', () => {
  it('renders the calculator card with display and keys', () => {
    const mockOnLogRequest = vi.fn();
    render(<CalculatorCard onLogRequest={mockOnLogRequest} />);
    
    // Check if display is present
    expect(screen.getByText('0')).toBeInTheDocument();
    
    // Check if some keys are present
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('=')).toBeInTheDocument();
  });

  it('updates display when number keys are clicked', () => {
    const mockOnLogRequest = vi.fn();
    render(<CalculatorCard onLogRequest={mockOnLogRequest} />);
    
    const key7 = screen.getByText('7');
    const key8 = screen.getByText('8');
    
    fireEvent.click(key7);
    fireEvent.click(key8);
    
    expect(screen.getByText('78')).toBeInTheDocument();
  });

  it('clears display when C is clicked', () => {
    const mockOnLogRequest = vi.fn();
    render(<CalculatorCard onLogRequest={mockOnLogRequest} />);
    
    const key7 = screen.getByText('7');
    const keyC = screen.getByText('C');
    
    fireEvent.click(key7);
    expect(screen.getByText('7')).toBeInTheDocument();
    
    fireEvent.click(keyC);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
