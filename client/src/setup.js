import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock ResizeObserver globally
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
