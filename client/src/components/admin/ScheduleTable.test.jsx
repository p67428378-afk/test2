import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ScheduleTable from "./ScheduleTable";

describe("ScheduleTable Component", () => {
  const mockSchedules = [
    {
      id: "sched-101",
      tour_title: "Impressionist Masterpieces",
      start_time: "2026-09-02T09:00:00Z",
      end_time: "2026-09-02T10:30:00Z",
      max_capacity: 30,
      booked_tickets: 10,
      remaining_capacity: 20,
      guide_name: "Sophie Laurent",
      status: "Published",
    },
  ];

  it("renders table columns, schedule row, and action buttons", () => {
    const onEdit = vi.fn();
    const onAssign = vi.fn();
    const onReport = vi.fn();

    render(
      <ScheduleTable
        schedules={mockSchedules}
        onEditSchedule={onEdit}
        onAssignGuide={onAssign}
        onViewReport={onReport}
        isLoading={false}
      />,
    );

    expect(screen.getByText(/Impressionist Masterpieces/i)).toBeInTheDocument();
    expect(screen.getByText(/10 \/ 30/i)).toBeInTheDocument();
    expect(screen.getByText(/Sophie Laurent/i)).toBeInTheDocument();

    const editBtn = screen.getByTitle(/Edit Schedule/i);
    fireEvent.click(editBtn);
    expect(onEdit).toHaveBeenCalledWith(mockSchedules[0]);

    const guideBtn = screen.getByTitle(/Assign Guide/i);
    fireEvent.click(guideBtn);
    expect(onAssign).toHaveBeenCalledWith(mockSchedules[0]);

    const reportBtn = screen.getByTitle(/Attendance Report/i);
    fireEvent.click(reportBtn);
    expect(onReport).toHaveBeenCalledWith(mockSchedules[0]);
  });
});
