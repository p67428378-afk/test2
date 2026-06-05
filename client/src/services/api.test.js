import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { createOrder, getOrder, getPositions, getMarketDepth, estimateTca } from './api';

// Mock the axios library
vi.mock('axios', () => {
  const mockAxiosInstance = {
    post: vi.fn(),
    get: vi.fn(),
  };
  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
    },
  };
});

// We need to get a reference to the mocked instance that the api.js module will use.
const mockedAxios = axios.create();

describe('API Service Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createOrder calls POST on /orders', async () => {
    const orderData = { instrument_id: 'AAPL', quantity: 100, price: 150.00, order_type: 'LIMIT' };
    mockedAxios.post.mockResolvedValue({ data: { order_id: '123' } });
    await createOrder(orderData);
    expect(mockedAxios.post).toHaveBeenCalledWith('/orders', orderData);
  });

  it('getOrder calls GET on /orders/:orderId', async () => {
    const orderId = '123';
    mockedAxios.get.mockResolvedValue({ data: { order_id: '123' } });
    await getOrder(orderId);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/orders/${orderId}`);
  });

  it('getPositions calls GET on /positions/:traderId', async () => {
    const traderId = 'trader-abc';
    mockedAxios.get.mockResolvedValue({ data: [] });
    await getPositions(traderId);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/positions/${traderId}`);
  });

  it('getMarketDepth calls GET on /market-data/depth/:instrumentId', async () => {
    const instrumentId = 'AAPL';
    mockedAxios.get.mockResolvedValue({ data: {} });
    await getMarketDepth(instrumentId);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/market-data/depth/${instrumentId}`);
  });

  it('estimateTca calls POST on /tca/estimate', async () => {
    const tradeData = { instrument_id: 'AAPL', quantity: 100, order_type: 'BUY' };
    mockedAxios.post.mockResolvedValue({ data: { estimated_cost: 5.25 } });
    await estimateTca(tradeData);
    expect(mockedAxios.post).toHaveBeenCalledWith('/tca/estimate', tradeData);
  });
});
