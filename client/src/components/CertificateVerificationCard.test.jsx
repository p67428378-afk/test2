import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CertificateVerificationCard from "./CertificateVerificationCard";

describe("CertificateVerificationCard Component", () => {
  it("renders certificate verification input form", () => {
    render(<CertificateVerificationCard />);

    expect(screen.getByText("Digital Certificate Portal")).toBeInView();
    expect(screen.getByPlaceholderText(/Enter Certificate UUID/i)).toBeInView();
    expect(screen.getByRole("button", { name: "Verify" })).toBeInView();
  });
});
