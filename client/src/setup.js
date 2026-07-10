import "@testing-library/jest-dom";
import { vi } from "vitest";

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock window.alert
global.alert = vi.fn();
