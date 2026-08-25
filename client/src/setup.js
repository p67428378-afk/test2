import "@testing-library/jest-dom";

// Mock ResizeObserver for Recharts or other layout-dependent components
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
