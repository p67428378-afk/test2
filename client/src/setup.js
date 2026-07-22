import "@testing-library/jest-dom";

// Global ResizeObserver mock for jsdom environment
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
