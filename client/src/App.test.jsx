import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import * as api from './services/api';

// Mock the API service
vi.mock('./services/api', () => ({
  getRooms: vi.fn(),
  createReservation: vi.fn(),
  getReservations: vi.fn(),
  getReservation: vi.fn(),
  updateReservation: vi.fn(),
}));

describe('Grand Horizon Resort Portal App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.getReservations.mockResolvedValue([]);
    api.getRooms.mockResolvedValue([]);
  });

  it('renders the dashboard page by default', async () => {
    render(<App />);
    
    // Check that the sidebar and header are rendered
    expect(screen.getByText('Grand Horizon')).toBeInTheDocument();
    expect(screen.getByText('Room Availability & Search')).toBeInTheDocument();
    
    // Check that the KPI cards are rendered
    expect(screen.getByText('Occupancy Rate')).toBeInTheDocument();
    expect(screen.getByText('Active Bookings')).toBeInTheDocument();
    expect(screen.getByText('Arrivals Today')).toBeInTheDocument();
  });

  it('allows switching between Dashboard and Reservations tabs', async () => {
    render(<App />);
    
    // Click on Reservations tab in sidebar
    const reservationsTab = screen.getAllByText('Reservations')[0];
    fireEvent.click(reservationsTab);
    
    // Check that Reservations page is rendered
    expect(screen.getByText('Reservation Lookup & Management')).toBeInTheDocument();
    
    // Click back to Dashboard tab
    const dashboardTab = screen.getAllByText('Dashboard')[0];
    fireEvent.click(dashboardTab);
    
    // Check that Dashboard page is rendered again
    expect(screen.getByText('Find Available Rooms')).toBeInTheDocument();
  });

  it('allows searching for available rooms', async () => {
    const mockRooms = [
      {
        id: 'room-1',
        room_number: '101',
        room_type: 'Double',
        price_per_night: 150.00,
        is_available: true,
      }
    ];
    api.getRooms.mockResolvedValue(mockRooms);

    render(<App />);
    
    const searchButton = screen.getByRole('button', { name: /Search Availability/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(api.getRooms).toHaveBeenCalledWith('2026-07-10', '2026-07-15', '');
    });

    await waitFor(() => {
      expect(screen.getByText('Room 101')).toBeInTheDocument();
    });
  });
});
