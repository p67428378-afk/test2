import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import ProfileForm from "./components/resume/ProfileForm";
import ExperienceForm from "./components/resume/ExperienceForm";
import EducationSkillsForm from "./components/resume/EducationSkillsForm";
import LiveResumePreview from "./components/resume/LiveResumePreview";
import PdfExportPanel from "./components/resume/PdfExportPanel";
import * as api from "./services/api";

// Mock API module
vi.mock("./services/api", () => ({
  getResumes: vi.fn(),
  getResumeById: vi.fn(),
  createResume: vi.fn(),
  updateResume: vi.fn(),
  deleteResume: vi.fn(),
  exportResumePdf: vi.fn(),
  downloadPdfBlob: vi.fn(),
}));

describe("Quick Resume Maker App & Components", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.getResumes.mockResolvedValue([
      {
        id: "res-1",
        title: "Senior Full-Stack Engineer",
        full_name: "Jane Doe",
        email: "jane.doe@example.com",
        phone: "+1-555-0100",
        summary:
          "Passionate engineer with experience building web applications.",
        experiences: [
          {
            id: "exp-1",
            company_name: "Tech Solutions",
            role: "Frontend Lead",
            start_date: "2020-01-01",
            end_date: "2023-01-01",
            is_current: false,
            description: "Built React SPAs.",
          },
        ],
        education: [
          {
            id: "edu-1",
            institution: "MIT",
            degree: "B.S. in Computer Science",
            start_date: "2015-09-01",
            end_date: "2019-06-01",
          },
        ],
        skills: ["React", "JavaScript", "FastAPI"],
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      },
    ]);
  });

  it("renders App with navbar and dashboard title without crashing", async () => {
    render(<App />);
    expect(screen.getAllByText(/Quick/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Resume/i).length).toBeGreaterThan(0);
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Resume Dashboard/i }),
      ).toBeInTheDocument();
    });
  });

  it("renders ProfileForm and handles field input changes", () => {
    const updateMock = vi.fn();
    const formData = {
      title: "Backend Engineer",
      full_name: "John Smith",
      email: "john@example.com",
      phone: "1234567890",
      summary: "Python expert",
    };

    render(<ProfileForm formData={formData} updateFormData={updateMock} />);

    const titleInput = screen.getByPlaceholderText(
      /e.g. Senior Software Engineer CV/i,
    );
    expect(titleInput).toHaveValue("Backend Engineer");

    fireEvent.change(titleInput, {
      target: { name: "title", value: "Principal Engineer" },
    });
    expect(updateMock).toHaveBeenCalledWith({ title: "Principal Engineer" });
  });

  it("renders ExperienceForm and allows adding and updating positions", () => {
    const setExpMock = vi.fn();
    const experiences = [
      {
        id: "exp-1",
        company_name: "Acme Corp",
        role: "Software Engineer",
        start_date: "2021-01-01",
        end_date: "2023-12-31",
        is_current: false,
        description: "Built microservices",
      },
    ];

    render(
      <ExperienceForm experiences={experiences} setExperiences={setExpMock} />,
    );

    expect(screen.getByText(/Work Experience/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("Acme Corp")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Software Engineer")).toBeInTheDocument();

    const addBtn = screen.getByRole("button", { name: /Add Position/i });
    fireEvent.click(addBtn);
    expect(setExpMock).toHaveBeenCalled();
  });

  it("renders EducationSkillsForm and allows adding education and skills", () => {
    const setEduMock = vi.fn();
    const setSkillsMock = vi.fn();
    const education = [
      {
        id: "edu-1",
        institution: "Stanford",
        degree: "M.S. CS",
        start_date: "2019-09-01",
        end_date: "2021-06-01",
      },
    ];
    const skills = ["Python", "FastAPI"];

    render(
      <EducationSkillsForm
        education={education}
        setEducation={setEduMock}
        skills={skills}
        setSkills={setSkillsMock}
      />,
    );

    expect(screen.getByDisplayValue("Stanford")).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("FastAPI")).toBeInTheDocument();
  });

  it("renders LiveResumePreview correctly with provided resume data", () => {
    const resumeData = {
      title: "Lead Architect",
      full_name: "Alice Wonderland",
      email: "alice@example.com",
      phone: "+1 234 567 8900",
      summary: "Seasoned cloud and software architect.",
      experiences: [
        {
          id: "exp-1",
          company_name: "Cloud Innovations",
          role: "Chief Architect",
          start_date: "2018-01-01",
          is_current: true,
          description: "Led company-wide cloud transformation.",
        },
      ],
      education: [
        {
          id: "edu-1",
          institution: "Oxford",
          degree: "Computer Science",
          start_date: "2012-09-01",
          end_date: "2016-06-01",
        },
      ],
      skills: ["Kubernetes", "AWS", "Python"],
    };

    render(<LiveResumePreview resumeData={resumeData} />);

    expect(screen.getByText("Alice Wonderland")).toBeInTheDocument();
    expect(screen.getByText("Lead Architect")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("Cloud Innovations")).toBeInTheDocument();
    expect(screen.getByText("Kubernetes")).toBeInTheDocument();
  });

  it("renders PdfExportPanel and triggers PDF export on click", async () => {
    const mockBlob = new Blob(["%PDF-1.4"], { type: "application/pdf" });
    api.exportResumePdf.mockResolvedValue(mockBlob);

    render(
      <PdfExportPanel
        resumeId="test-resume-123"
        resumeTitle="Software Engineer"
      />,
    );

    const exportBtn = screen.getByRole("button", { name: /Download PDF CV/i });
    expect(exportBtn).toBeInTheDocument();

    fireEvent.click(exportBtn);

    await waitFor(() => {
      expect(api.exportResumePdf).toHaveBeenCalledWith("test-resume-123");
      expect(api.downloadPdfBlob).toHaveBeenCalled();
    });
  });
});
