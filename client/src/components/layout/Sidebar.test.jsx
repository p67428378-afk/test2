import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Sidebar from "./Sidebar.jsx";

describe("Sidebar Component", () => {
  it("renders placeholder when there are no chats", () => {
    render(
      <Sidebar
        chats={[]}
        activeChatId={null}
        setActiveChatId={vi.fn()}
        isOpen={true}
        setIsOpen={vi.fn()}
        onNewChat={vi.fn()}
        onDeleteChat={vi.fn()}
        onOpenRenameModal={vi.fn()}
      />,
    );

    expect(screen.getByText("No recent chats")).toBeInTheDocument();
  });

  it("renders list of chats when chats are present", () => {
    const chats = [
      {
        id: "1",
        title: "FastAPI SSE Integration",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Tailwind CSS Layouts",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    render(
      <Sidebar
        chats={chats}
        activeChatId="1"
        setActiveChatId={vi.fn()}
        isOpen={true}
        setIsOpen={vi.fn()}
        onNewChat={vi.fn()}
        onDeleteChat={vi.fn()}
        onOpenRenameModal={vi.fn()}
      />,
    );

    expect(screen.getByText("FastAPI SSE Integration")).toBeInTheDocument();
    expect(screen.getByText("Tailwind CSS Layouts")).toBeInTheDocument();
  });
});
