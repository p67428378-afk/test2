import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CertificateVerificationCard from "./CertificateVerificationCard";

describe("CertificateVerificationCard Component", () => {
  it("renders certificate verification input form", () => {
    render(<CertificateVerificationCard />);

    expect(screen.getByText("Digital Certificate Portal")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Enter Certificate UUID/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Verify" })).toBeInTheDocument();
  });
});
