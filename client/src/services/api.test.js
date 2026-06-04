import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { calculatePremium } from './api';

vi.mock('axios');

describe('API Service', () => {
  it('calculatePremium should post to the correct endpoint and return data', async () => {
    const postData = { vehicle_value: 50000, ncb_years: 5, vehicle_type_multiplier: 1.2 };
    const responseData = { final_premium: 420 };
    
    // Correctly mock the post method on the default export
    axios.create.mockReturnThis(); // Ensure the created instance is chainable
    axios.post.mockResolvedValue({ data: responseData });

    const result = await calculatePremium(postData);

    expect(axios.post).toHaveBeenCalledWith('/api/v1/insurance/premium/calculate', postData);
    expect(result).toEqual(responseData);
  });

  it('calculatePremium should throw an error when the API call fails', async () => {
    const postData = { vehicle_value: 50000, ncb_years: 5, vehicle_type_multiplier: 1.2 };
    const error = new Error('Network Error');
    
    axios.create.mockReturnThis();
    axios.post.mockRejectedValue(error);

    await expect(calculatePremium(postData)).rejects.toThrow('Network Error');
  });
});
