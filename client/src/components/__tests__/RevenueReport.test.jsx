import React from 'react';
import { render, screen } from '@testing-library/react';
import RevenueReport from '../RevenueReport';
import * as api from '../../services/api';

vi.mock('../../services/api');

describe('RevenueReport', () => {
  it('renders revenue report with data', async () => {
    const reportData = {
      date: '2024-01-01',
      totalRevenue: 5000,
      pendingDues: 500,
      revenueBreakdown: {
        rooms: 3000,
        food: 1500,
        other: 500,
      },
    };
    api.getDailyRevenueReport.mockResolvedValue({ data: reportData });

    render(<RevenueReport />);

    expect(await screen.findByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('$5000')).toBeInTheDocument();

    expect(screen.getByText('Pending Dues')).toBeInTheDocument();
    expect(screen.getByText('$500')).toBeInTheDocument();
  });
});
