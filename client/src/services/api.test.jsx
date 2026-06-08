import { describe, it, expect } from 'vitest';
import * as api from './api';

describe('api service', () => {
  it('exports the expected functions', () => {
    expect(api.getInventory).toBeInstanceOf(Function);
    expect(api.requestSnack).toBeInstanceOf(Function);
    expect(api.consumeSnack).toBeInstanceOf(Function);
    expect(api.updateInventoryItem).toBeInstanceOf(Function);
    expect(api.getExpiryAlerts).toBeInstanceOf(Function);
  });
});
