import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import useAlertSetup from './useAlertSetup';
import * as api from '../services/api';

vi.mock('../services/api');

describe('useAlertSetup Hook', () => {
  it('should call setupAlert and update state on successful setup', async () => {
    const mockResponse = { transaction_id: '123' };
    api.setupAlert.mockResolvedValue({ data: mockResponse });

    const { result } = renderHook(() => useAlertSetup());

    let returnedData;
    await act(async () => {
      returnedData = await result.current.setup({ card_number: 'test' });
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.data).toEqual(mockResponse);
    expect(returnedData).toEqual(mockResponse);
    expect(result.current.error).toBeNull();
  });

  it('should call verifyOtp and update state on successful verification', async () => {
    const mockResponse = { status: 'ACTIVE' };
    api.verifyOtp.mockResolvedValue({ data: mockResponse });

    const { result } = renderHook(() => useAlertSetup());

    let returnedData;
    await act(async () => {
      returnedData = await result.current.verify({ otp_code: '123456' });
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.data).toEqual(mockResponse);
    expect(returnedData).toEqual(mockResponse);
    expect(result.current.error).toBeNull();
  });
});
