import "@testing-library/jest-dom";

// Global ResizeObserver mock for jsdom environment
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Global URL.createObjectURL mock if used in tests
if (typeof window !== "undefined" && !window.URL.createObjectURL) {
  window.URL.createObjectURL = () => "mock-url";
}
