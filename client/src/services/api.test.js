import { describe, it, expect } from "vitest";
import {
  authApi,
  petsApi,
  appointmentsApi,
  medicalRecordsApi,
  vaccinationsApi,
  remindersApi,
} from "./api";

describe("API Services Export Verification", () => {
  it("exports authApi methods", () => {
    expect(typeof authApi.login).toBe("function");
    expect(typeof authApi.register).toBe("function");
    expect(typeof authApi.getMe).toBe("function");
  });

  it("exports petsApi methods", () => {
    expect(typeof petsApi.getPets).toBe("function");
    expect(typeof petsApi.createPet).toBe("function");
    expect(typeof petsApi.getPet).toBe("function");
    expect(typeof petsApi.updatePet).toBe("function");
  });

  it("exports appointmentsApi methods", () => {
    expect(typeof appointmentsApi.getAppointments).toBe("function");
    expect(typeof appointmentsApi.createAppointment).toBe("function");
    expect(typeof appointmentsApi.updateAppointmentStatus).toBe("function");
  });

  it("exports medicalRecordsApi methods", () => {
    expect(typeof medicalRecordsApi.createMedicalRecord).toBe("function");
    expect(typeof medicalRecordsApi.getPetMedicalRecords).toBe("function");
  });

  it("exports vaccinationsApi methods", () => {
    expect(typeof vaccinationsApi.createVaccination).toBe("function");
    expect(typeof vaccinationsApi.getPetVaccinations).toBe("function");
  });

  it("exports remindersApi methods", () => {
    expect(typeof remindersApi.getReminders).toBe("function");
    expect(typeof remindersApi.processReminders).toBe("function");
  });
});
