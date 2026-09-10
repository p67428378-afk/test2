import { describe, it, expect } from "vitest";
import { resumeService } from "./api";

describe("Resume API Service Exports", () => {
  it("exports resumeService methods", () => {
    expect(typeof resumeService.getTemplates).toBe("function");
    expect(typeof resumeService.listResumes).toBe("function");
    expect(typeof resumeService.getResume).toBe("function");
    expect(typeof resumeService.createResume).toBe("function");
    expect(typeof resumeService.updateResume).toBe("function");
    expect(typeof resumeService.deleteResume).toBe("function");
    expect(typeof resumeService.exportPdf).toBe("function");
    expect(typeof resumeService.healthCheck).toBe("function");
  });
});
