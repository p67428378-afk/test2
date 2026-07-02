import "@testing-library/jest-dom";

// Mock ResizeObserver for tests (e.g. if charts or other components use it)
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
