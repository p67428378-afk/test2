import api from './api';
import { describe, it, expect } from 'vitest';

describe('api service', () => {
  it('should have all the api functions', () => {
    expect(typeof api.getItems).toBe('function');
    expect(typeof api.createItem).toBe('function');
    expect(typeof api.getItem).toBe('function');
    expect(typeof api.updateItem).toBe('function');
    expect(typeof api.recordSale).toBe('function');
    expect(typeof api.getSalesHistory).toBe('function');
    expect(typeof api.getCustomers).toBe('function');
    expect(typeof api.createCustomer).toBe('function');
    expect(typeof api.getCustomer).toBe('function');
    expect(typeof api.updateCustomer).toBe('function');
    expect(typeof api.getBestsellersReport).toBe('function');
    expect(typeof api.getSlowmoversReport).toBe('function');
    expect(typeof api.getProfitabilityReport).toBe('function');
  });
});
