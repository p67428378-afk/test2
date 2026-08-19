import { describe, it, expect } from "vitest";

describe("Setup Environment", () => {
  it("should have ResizeObserver mocked globally", () => {
    expect(global.ResizeObserver).toBeDefined();
    const observer = new global.ResizeObserver();
    expect(typeof observer.observe).toBe("function");
  });
});
