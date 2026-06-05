import { describe, it, expect, vi } from 'vitest';
import api, { createOrder, getOrder, getPositions, getMarketData, estimateTca } from './api';

// Mock axios
vi.mock('axios', () => {
  const mockAxios = {
    create: vi.fn(() => mockAxios),
    post: vi.fn(),
    get: vi.fn(),
  };
  return { default: mockAxios };
});

describe('API Service', () => {
  it('should have a createOrder function', () => {
    expect(typeof createOrder).toBe('function');
  });

  it('should have a getOrder function', () => {
    expect(typeof getOrder).toBe('function');
  });

  it('should have a getPositions function', () => {
    expect(typeof getPositions).toBe('function');
  });

  it('should have a getMarketData function', () => {
    expect(typeof getMarketData).toBe('function');
  });

  it('should have a estimateTca function', () => {
    expect(typeof estimateTca).toBe('function');
  });
});
