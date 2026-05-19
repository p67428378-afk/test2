import React from 'react';
import { render, screen } from '@testing-library/react';
import RoomAvailability from '../RoomAvailability';
import * as api from '../../services/api';

vi.mock('../../services/api');

describe('RoomAvailability', () => {
  it('renders room availability with data', async () => {
    const roomsData = {
      rooms: [
        {
          id: '1',
          roomNumber: '101',
          type: 'Deluxe',
          status: 'available',
        },
        {
          id: '2',
          roomNumber: '102',
          type: 'Standard',
          status: 'occupied',
        },
      ],
    };
    api.getRoomAvailability.mockResolvedValue({ data: roomsData });

    render(<RoomAvailability />);

    expect(await screen.findByText('101')).toBeInTheDocument();
    expect(screen.getByText('Deluxe')).toBeInTheDocument();
    expect(screen.getByText('available')).toBeInTheDocument();

    expect(screen.getByText('102')).toBeInTheDocument();
    expect(screen.getByText('Standard')).toBeInTheDocument();
    expect(screen.getByText('occupied')).toBeInTheDocument();
  });
});
