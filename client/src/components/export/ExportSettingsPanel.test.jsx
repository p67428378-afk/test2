// @vitest-environment jsdom
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ExportSettingsPanel from "./ExportSettingsPanel";

describe("ExportSettingsPanel Component", () => {
  it("renders export settings with default filename and options", () => {
    render(
      <ExportSettingsPanel
        userName="Jane Doe"
        templateId="modern"
        isExporting={false}
        onExportPdf={() => {}}
      />,
    );

    expect(
      screen.getByText(/PDF Export & Print Settings/i),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("Jane_Doe_Resume.pdf")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Export & Download PDF CV/i }),
    ).toBeInTheDocument();
  });

  it("submits configured export options on button click", () => {
    const handleExport = vi.fn();
    render(
      <ExportSettingsPanel
        userName="Jane Doe"
        templateId="classic"
        isExporting={false}
        onExportPdf={handleExport}
      />,
    );

    const submitBtn = screen.getByRole("button", {
      name: /Export & Download PDF CV/i,
    });
    fireEvent.click(submitBtn);

    expect(handleExport).toHaveBeenCalledWith(
      expect.objectContaining({
        fileName: "Jane_Doe_Resume.pdf",
        pageSize: "A4",
      }),
    );
  });
});
