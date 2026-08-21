import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MainArea from "./MainArea.jsx";

describe("MainArea Component", () => {
  it("renders welcome screen when there are no messages", () => {
    render(
      <MainArea
        messages={[]}
        isStreaming={false}
        onSendMessage={vi.fn()}
        onStopGenerating={vi.fn()}
        isSidebarOpen={true}
        setIsSidebarOpen={vi.fn()}
        error={null}
      />,
    );

    expect(screen.getByText("How can I help you today?")).toBeInTheDocument();
    expect(screen.getByText(/Explain quantum computing/)).toBeInTheDocument();
  });

  it("renders message history when messages are present", () => {
    const messages = [
      {
        id: "1",
        role: "user",
        content: "Hello AI",
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        role: "assistant",
        content: "Hello User",
        created_at: new Date().toISOString(),
      },
    ];

    render(
      <MainArea
        messages={messages}
        isStreaming={false}
        onSendMessage={vi.fn()}
        onStopGenerating={vi.fn()}
        isSidebarOpen={true}
        setIsSidebarOpen={vi.fn()}
        error={null}
      />,
    );

    expect(screen.getByText("Hello AI")).toBeInTheDocument();
    expect(screen.getByText("Hello User")).toBeInTheDocument();
  });

  it("renders error banner when error is present", () => {
    render(
      <MainArea
        messages={[]}
        isStreaming={false}
        onSendMessage={vi.fn()}
        onStopGenerating={vi.fn()}
        isSidebarOpen={true}
        setIsSidebarOpen={vi.fn()}
        error="Failed to load messages"
      />,
    );

    expect(screen.getByText("Failed to load messages")).toBeInTheDocument();
  });
});
