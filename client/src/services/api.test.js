import { vi, describe, it, expect, beforeEach } from 'vitest';
import axios from 'axios';
import { calculatePremium } from './api';

vi.mock('axios', () => {
  const mockAxiosInstance = {
    post: vi.fn(),
  };
  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
    },
  };
});

describe('api service', () => {
  const mockPost = axios.create().post;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return calculated premium on success', async () => {
    const mockData = { calculated_premium: 420 };
    mockPost.mockResolvedValue({ data: mockData });

    const data = { ncb_percentage: 0.3, vehicle_multiplier: 1.2 };
    const result = await calculatePremium(data);

    expect(result).toEqual(mockData);
    expect(mockPost).toHaveBeenCalledWith('/api/v1/premiums/calculate', data);
  });

  it('should throw an error on failure', async () => {
    const errorMessage = 'Network Error';
    mockPost.mockRejectedValue(new Error(errorMessage));

    const data = { ncb_percentage: 0.3, vehicle_multiplier: 1.2 };

    await expect(calculatePremium(data)).rejects.toThrow(errorMessage);
  });
});
