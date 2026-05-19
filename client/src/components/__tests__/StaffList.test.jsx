import React from 'react';
import { render, screen } from '@testing-library/react';
import StaffList from '../StaffList';
import * as api from '../../services/api';

vi.mock('../../services/api');

describe('StaffList', () => {
  it('renders staff list with data', async () => {
    const staffData = {
      staff: [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          role: 'Manager',
          email: 'john.doe@example.com',
        },
      ],
    };
    api.getStaff.mockResolvedValue({ data: staffData });

    render(<StaffList />);

    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Manager')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
  });
});
