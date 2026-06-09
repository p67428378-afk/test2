import '@testing-library/jest-dom';

// Mock ResizeObserver for jsdom environment
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
