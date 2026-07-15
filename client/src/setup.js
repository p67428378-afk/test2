import "@testing-library/jest-dom";
import { vi } from "vitest";

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock clipboard API
if (typeof navigator !== "undefined") {
  Object.defineProperty(navigator, "clipboard", {
    value: {
      writeText: vi.fn().mockImplementation(() => Promise.resolve()),
    },
    configurable: true,
  });
}
