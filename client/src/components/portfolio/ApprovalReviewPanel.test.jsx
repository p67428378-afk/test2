import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ApprovalReviewPanel from "./ApprovalReviewPanel";

describe("ApprovalReviewPanel", () => {
  const mockScenarioPass = {
    id: "1",
    name: "Balanced",
    product_actions: {
      GROW: 2,
      MAINTAIN: 2,
      REDUCE: 1,
      SWAP: 1,
    },
    guardrails: {
      kyc_aml_flags: "PASS",
      minimum_casa_floor: "PASS",
      pmla_2002_screening: "PASS",
      rbi_exposure_norms: "PASS",
    },
  };

  const mockScenarioFail = {
    id: "2",
    name: "Aggressive",
    product_actions: {
      GROW: 3,
      MAINTAIN: 1,
      REDUCE: 1,
      SWAP: 1,
    },
    guardrails: {
      kyc_aml_flags: "PASS",
      minimum_casa_floor: "PASS",
      pmla_2002_screening: "PASS",
      rbi_exposure_norms: "FAIL",
    },
  };

  it("renders loading state correctly", () => {
    render(
      <ApprovalReviewPanel
        scenario={null}
        onSubmit={() => {}}
        submitting={false}
        loading={true}
      />,
    );
    expect(screen.getByTestId("approval-loading")).toBeInTheDocument();
  });

  it("enables submit button when all guardrails pass", () => {
    const handleSubmit = vi.fn();
    render(
      <ApprovalReviewPanel
        scenario={mockScenarioPass}
        onSubmit={handleSubmit}
        submitting={false}
        loading={false}
      />,
    );

    const submitBtn = screen.getByTestId("submit-decision-btn");
    expect(submitBtn).not.toBeDisabled();
    fireEvent.click(submitBtn);
    expect(handleSubmit).toHaveBeenCalled();
  });

  it("disables submit button when any guardrail fails", () => {
    render(
      <ApprovalReviewPanel
        scenario={mockScenarioFail}
        onSubmit={() => {}}
        submitting={false}
        loading={false}
      />,
    );

    const submitBtn = screen.getByTestId("submit-decision-btn");
    expect(submitBtn).toBeDisabled();
    expect(
      screen.getByText("Cannot submit: Guardrail checks failed"),
    ).toBeInTheDocument();
  });
});
