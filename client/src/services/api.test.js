import { describe, it, expect, vi } from 'vitest';
import api, * as apiService from './api';

describe('API Service', () => {
  it('should have the correct functions exported', () => {
    expect(typeof apiService.getCampaigns).toBe('function');
    expect(typeof apiService.createCampaign).toBe('function');
    expect(typeof apiService.getCampaign).toBe('function');
    expect(typeof apiService.updateCampaign).toBe('function');
    expect(typeof apiService.deleteCampaign).toBe('function');
    expect(typeof apiService.getDeliverables).toBe('function');
    expect(typeof apiService.createDeliverable).toBe('function');
    expect(typeof apiService.updateDeliverable).toBe('function');
    expect(typeof apiService.connectSocialAccount).toBe('function');
    expect(typeof apiService.disconnectSocialAccount).toBe('function');
    expect(typeof apiService.getEngagementMetrics).toBe('function');
  });

  it('axios instance should be created with a base URL', () => {
    expect(api.defaults.baseURL).toBe(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1');
  });
});
