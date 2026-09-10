import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EmailInputForm from "./EmailInputForm";

describe("EmailInputForm Component", () => {
  it("renders input elements and sample template chips", () => {
    render(
      <EmailInputForm
        onClassifiedSuccess={vi.fn()}
        onViewDashboard={vi.fn()}
      />,
    );

    expect(screen.getByText("Email Classification Studio")).toBeInTheDocument();
    expect(screen.getByText("Direct Text Entry")).toBeInTheDocument();
    expect(
      screen.getByText("File Upload (.eml/.pdf/.txt)"),
    ).toBeInTheDocument();
    expect(screen.getByText("+ Urgent Alert")).toBeInTheDocument();
    expect(screen.getByText("+ Work Project")).toBeInTheDocument();
  });

  it("fills inputs when a sample template is clicked", () => {
    render(
      <EmailInputForm
        onClassifiedSuccess={vi.fn()}
        onViewDashboard={vi.fn()}
      />,
    );

    const urgentBtn = screen.getByText("+ Urgent Alert");
    fireEvent.click(urgentBtn);

    const textarea = screen.getByPlaceholderText(/Paste the full email body/i);
    expect(textarea.value).toContain("URGENT ALERT");
  });

  it("switches to file upload mode when tab is clicked", () => {
    render(
      <EmailInputForm
        onClassifiedSuccess={vi.fn()}
        onViewDashboard={vi.fn()}
      />,
    );

    const fileTab = screen.getByText("File Upload (.eml/.pdf/.txt)");
    fireEvent.click(fileTab);

    expect(
      screen.getByText(/Click to browse or drag and drop email files here/i),
    ).toBeInTheDocument();
  });
});
