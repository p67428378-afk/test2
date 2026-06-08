import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MarkConsumedForm from './MarkConsumedForm';
import * as api from '../../services/api';

vi.mock('../../services/api');

describe('MarkConsumedForm component', () => {
  it('submits the form and calls the api', async () => {
    const inventoryData = [{ id: 1, snack_name: 'Chips', quantity: 10 }];
    api.getInventory.mockResolvedValue({ data: inventoryData });
    api.consumeSnack.mockResolvedValue({ data: { message: 'Success' } });

    render(<MarkConsumedForm />);

    // Wait for inventory to load
    await screen.findByText('Chips (Qty: 10)');

    fireEvent.change(screen.getByLabelText('Select Snack'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Quantity Consumed'), { target: { value: '5' } });
    fireEvent.click(screen.getByText('Mark as Consumed'));

    expect(api.consumeSnack).toHaveBeenCalledWith('1', { quantity_consumed: 5 });
    expect(await screen.findByText('Snack consumed successfully!')).toBeInTheDocument();
  });
});
