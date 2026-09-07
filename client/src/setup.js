import "@testing-library/jest-dom";

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

if (typeof window !== "undefined") {
  window.scrollTo = () => {};
  if (!navigator.clipboard) {
    Object.assign(navigator, {
      clipboard: {
        writeText: () => Promise.resolve(),
      },
    });
  }
}
