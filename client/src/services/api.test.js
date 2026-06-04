import { describe, it, expect } from 'vitest';
import * as api from './api';

describe('API Service', () => {
  it('should export calculatePremium function', () => {
    expect(api.calculatePremium).toBeInstanceOf(Function);
  });
});
