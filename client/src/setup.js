import "@testing-library/jest-dom";

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

global.WebSocket = class {
  constructor() {}
  close() {}
  send() {}
};
