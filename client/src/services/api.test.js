import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { setupAlert, verifyOtp } from './api';

vi.mock('axios', () => {
  const mockAxiosInstance = {
    post: vi.fn(),
    create: vi.fn(() => mockAxiosInstance)
  };
  return {
    default: mockAxiosInstance
  };
});

describe('API Service', () => {
  it('setupAlert should be a function', () => {
    expect(typeof setupAlert).toBe('function');
  });

  it('verifyOtp should be a function', () => {
    expect(typeof verifyOtp).toBe('function');
  });

  it('setupAlert should make a POST request to /api/v1/alerts/setup', async () => {
    const data = { card_number: '123', daily_spend_threshold: 100, alert_delivery_channel: 'SMS' };
    axios.post.mockResolvedValue({ data: { success: true } });
    await setupAlert(data);
    expect(axios.post).toHaveBeenCalledWith('/api/v1/alerts/setup', data);
  });

  it('verifyOtp should make a POST request to /api/v1/alerts/verify', async () => {
    const data = { transaction_id: 'abc', otp_code: '123456' };
    axios.post.mockResolvedValue({ data: { success: true } });
    await verifyOtp(data);
    expect(axios.post).toHaveBeenCalledWith('/api/v1/alerts/verify', data);
  });
});
