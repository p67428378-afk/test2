import '@testing-library/jest-dom';

// Mock ResizeObserver globally for tests
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};