import React from 'react';
import { render, screen } from '@testing-library/react';
import BookingList from '../BookingList';
import * as api from '../../services/api';

vi.mock('../../services/api');

describe('BookingList', () => {
  it('renders booking list with data', async () => {
    const bookingsData = {
      bookings: [
        {
          id: '1',
          guestName: 'John Doe',
          roomNumber: '101',
          checkInDate: '2024-01-01',
          checkOutDate: '2024-01-05',
          status: 'confirmed',
        },
      ],
    };
    api.getBookings.mockResolvedValue({ data: bookingsData });

    render(<BookingList />);

    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('101')).toBeInTheDocument();
    expect(screen.getByText('confirmed')).toBeInTheDocument();
  });
});
