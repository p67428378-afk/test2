import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RequestSnackForm from './RequestSnackForm';
import * as api from '../../services/api';

vi.mock('../../services/api');

describe('RequestSnackForm component', () => {
  it('submits the form and calls the api', async () => {
    api.requestSnack.mockResolvedValue({ data: { request_id: '123' } });

    render(<RequestSnackForm />);

    fireEvent.change(screen.getByLabelText('Snack Name'), { target: { value: 'Pretzels' } });
    fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '30' } });
    fireEvent.click(screen.getByText('Submit Request'));

    expect(api.requestSnack).toHaveBeenCalledWith({ name: 'Pretzels', quantity: 30 });
    expect(await screen.findByText('Request submitted successfully! Request ID: 123')).toBeInTheDocument();
  });
});
