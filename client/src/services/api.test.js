
import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { 
  registerUser, 
  getUser, 
  configureAlerts, 
  getAlertConfig, 
  updateAlertConfig, 
  getWaterUsage 
} from './api';

vi.mock('axios');

const BASE_URL = 'http://localhost:8000';

describe('API Service', () => {
  it('registerUser should be a function', () => {
    expect(typeof registerUser).toBe('function');
  });

  it('getUser should be a function', () => {
    expect(typeof getUser).toBe('function');
  });

  it('configureAlerts should be a function', () => {
    expect(typeof configureAlerts).toBe('function');
  });

  it('getAlertConfig should be a function', () => {
    expect(typeof getAlertConfig).toBe('function');
  });

  it('updateAlertConfig should be a function', () => {
    expect(typeof updateAlertConfig).toBe('function');
  });

  it('getWaterUsage should be a function', () => {
    expect(typeof getWaterUsage).toBe('function');
  });
});
