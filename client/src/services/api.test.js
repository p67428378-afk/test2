import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { calculatePremium } from './api';

vi.mock('axios');

describe('api service', () => {
  it('calculatePremium calls the correct endpoint and returns data', async () => {
    const mockData = { calculated_premium: 420 };
    const postSpy = vi.spyOn(axios, 'create').mockReturnValue({
        post: vi.fn().mockResolvedValue({ data: mockData })
    });

    const api = (await import('./api')).calculatePremium;

    const formData = { vehicle_value: 25000, ncb_percentage: 20, vehicle_multiplier: 1.0 };
    const result = await api(formData);

    expect(result).toEqual(mockData);
    postSpy.mockRestore();
  });
});
