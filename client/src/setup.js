import "@testing-library/jest-dom";

// Mock ResizeObserver for Recharts or other libraries
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
