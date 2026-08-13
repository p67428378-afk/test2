import { describe, it, expect } from "vitest";
import {
  tournamentService,
  playerService,
  pairingService,
  scoreService,
  standingsService,
  certificateService,
  authService,
} from "./api";

describe("API Service Exports", () => {
  it("exports tournamentService methods", () => {
    expect(typeof tournamentService.getTournaments).toBe("function");
    expect(typeof tournamentService.getTournament).toBe("function");
    expect(typeof tournamentService.createTournament).toBe("function");
    expect(typeof tournamentService.finishTournament).toBe("function");
  });

  it("exports playerService methods", () => {
    expect(typeof playerService.registerPlayer).toBe("function");
    expect(typeof playerService.getRoster).toBe("function");
  });

  it("exports pairingService methods", () => {
    expect(typeof pairingService.generatePairings).toBe("function");
    expect(typeof pairingService.getRounds).toBe("function");
  });

  it("exports scoreService methods", () => {
    expect(typeof scoreService.submitScore).toBe("function");
  });

  it("exports standingsService methods", () => {
    expect(typeof standingsService.getStandings).toBe("function");
  });

  it("exports certificateService methods", () => {
    expect(typeof certificateService.verifyCertificate).toBe("function");
    expect(typeof certificateService.getCertificatePdfUrl).toBe("function");
    expect(certificateService.getCertificatePdfUrl("test-uuid")).toContain(
      "/api/v1/certificates/test-uuid/pdf",
    );
  });

  it("exports authService methods", () => {
    expect(typeof authService.login).toBe("function");
    expect(typeof authService.logout).toBe("function");
  });
});
