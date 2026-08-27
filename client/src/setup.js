import "@testing-library/jest-dom";

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

if (typeof window !== "undefined" && window.HTMLMediaElement) {
  window.HTMLMediaElement.prototype.play = () => Promise.resolve();
  window.HTMLMediaElement.prototype.pause = () => {};
  window.HTMLMediaElement.prototype.load = () => {};
}
