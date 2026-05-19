import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard';
import * as api from '../../services/api';

vi.mock('../../services/api');

describe('Dashboard', () => {
  it('renders dashboard with summary data', async () => {
    const summaryData = {
      totalBookings: 10,
      availableRooms: 5,
      todaysRevenue: 1234.56,
      recentActivities: ['Activity 1', 'Activity 2'],
    };
    api.getDashboardSummary.mockResolvedValue({ data: summaryData });

    render(<Dashboard />);

    expect(await screen.findByText('Total Bookings')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();

    expect(screen.getByText('Available Rooms')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();

    expect(screen.getByText('Today\'s Revenue')).toBeInTheDocument();
    expect(screen.getByText('$1234.56')).toBeInTheDocument();

    expect(screen.getByText('Recent Activities')).toBeInTheDocument();
    expect(screen.getByText('Activity 1')).toBeInTheDocument();
    expect(screen.getByText('Activity 2')).toBeInTheDocument();
  });
});
