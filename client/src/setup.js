import "@testing-library/jest-dom";

// Mock ResizeObserver for jsdom
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
