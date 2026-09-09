import { describe, it, expect } from "vitest";
import {
  authAPI,
  evidenceAPI,
  custodyAPI,
  casesAPI,
  auditAPI,
  rbacAPI,
} from "./api";

describe("API Services Module Export Integrity", () => {
  it("exports authAPI functions", () => {
    expect(typeof authAPI.login).toBe("function");
    expect(typeof authAPI.register).toBe("function");
    expect(typeof authAPI.getMe).toBe("function");
    expect(typeof authAPI.logout).toBe("function");
  });

  it("exports evidenceAPI functions", () => {
    expect(typeof evidenceAPI.requestUploadUrl).toBe("function");
    expect(typeof evidenceAPI.confirmUpload).toBe("function");
    expect(typeof evidenceAPI.listEvidence).toBe("function");
    expect(typeof evidenceAPI.verifyIntegrity).toBe("function");
  });

  it("exports custodyAPI functions", () => {
    expect(typeof custodyAPI.transferCustody).toBe("function");
    expect(typeof custodyAPI.recordAction).toBe("function");
    expect(typeof custodyAPI.getHistory).toBe("function");
  });

  it("exports casesAPI functions", () => {
    expect(typeof casesAPI.getStats).toBe("function");
    expect(typeof casesAPI.listCases).toBe("function");
    expect(typeof casesAPI.createCase).toBe("function");
    expect(typeof casesAPI.assignEvidence).toBe("function");
  });

  it("exports auditAPI and rbacAPI functions", () => {
    expect(typeof auditAPI.listLogs).toBe("function");
    expect(typeof rbacAPI.getRolesMatrix).toBe("function");
    expect(typeof rbacAPI.listUsers).toBe("function");
    expect(typeof rbacAPI.updateUserRole).toBe("function");
  });
});
