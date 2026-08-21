import { describe, it, expect } from "vitest";
import {
  authService,
  patientService,
  appointmentService,
  billingService,
} from "./api";

describe("API Services Structural Integrity", () => {
  it("exports authService methods", () => {
    expect(typeof authService.login).toBe("function");
    expect(typeof authService.register).toBe("function");
    expect(typeof authService.getMe).toBe("function");
  });

  it("exports patientService methods", () => {
    expect(typeof patientService.getPatients).toBe("function");
    expect(typeof patientService.createPatient).toBe("function");
  });

  it("exports appointmentService methods", () => {
    expect(typeof appointmentService.getAppointments).toBe("function");
    expect(typeof appointmentService.createAppointment).toBe("function");
  });

  it("exports billingService methods", () => {
    expect(typeof billingService.getInvoices).toBe("function");
    expect(typeof billingService.payInvoice).toBe("function");
  });
});
