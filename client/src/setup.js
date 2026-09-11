import "@testing-library/jest-dom";

// Global ResizeObserver mock for jsdom environment
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Global window.scrollTo mock
if (typeof window !== "undefined") {
  window.scrollTo = () => {};
}
