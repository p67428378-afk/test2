import { describe, it, expect, vi } from 'vitest';
import { bodiesApi, funeralsApi, invoicesApi } from './api';

describe('API Services Structure', () => {
  it('should export bodiesApi with correct methods', () => {
    expect(bodiesApi.register).toBeTypeOf('function');
    expect(bodiesApi.list).toBeTypeOf('function');
    expect(bodiesApi.get).toBeTypeOf('function');
    expect(bodiesApi.update).toBeTypeOf('function');
  });

  it('should export funeralsApi with correct methods', () => {
    expect(funeralsApi.create).toBeTypeOf('function');
    expect(funeralsApi.list).toBeTypeOf('function');
    expect(funeralsApi.get).toBeTypeOf('function');
    expect(funeralsApi.update).toBeTypeOf('function');
  });

  it('should export invoicesApi with correct methods', () => {
    expect(invoicesApi.create).toBeTypeOf('function');
    expect(invoicesApi.list).toBeTypeOf('function');
    expect(invoicesApi.get).toBeTypeOf('function');
    expect(invoicesApi.update).toBeTypeOf('function');
  });
});