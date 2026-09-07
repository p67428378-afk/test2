import "@testing-library/jest-dom";

if (typeof global !== "undefined" && !global.ResizeObserver) {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
