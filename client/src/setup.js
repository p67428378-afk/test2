import "@testing-library/jest-dom";

// Mock ResizeObserver which is missing in jsdom
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
