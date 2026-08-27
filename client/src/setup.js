import "@testing-library/jest-dom";

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock document.execCommand if needed for tests
if (typeof document !== "undefined" && !document.execCommand) {
  document.execCommand = () => true;
}

// Mock clipboard API
if (typeof navigator !== "undefined" && !navigator.clipboard) {
  Object.defineProperty(navigator, "clipboard", {
    value: {
      writeText: () => Promise.resolve(),
      readText: () => Promise.resolve(""),
    },
    writable: true,
    configurable: true,
  });
}
