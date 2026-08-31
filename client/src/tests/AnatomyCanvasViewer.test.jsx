import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AnatomyCanvasViewer from "../components/viewer/AnatomyCanvasViewer";

describe("AnatomyCanvasViewer Component", () => {
  const mockLayers = [
    {
      id: "l1",
      layer_name: "Skeletal Framework",
      layer_order: 1,
      image_url: "https://example.com/skeletal.jpg",
    },
    {
      id: "l2",
      layer_name: "Neural Plexus",
      layer_order: 2,
      image_url: "https://example.com/neural.jpg",
    },
  ];

  const mockHotspots = [
    {
      id: "h1",
      layer_id: "l2",
      x_percent: 50,
      y_percent: 50,
      title: "Radial Nerve",
      clinical_notes: "Arises from posterior cord (C5-T1).",
      clinical_significance: "Lesions precipitate wrist drop.",
    },
  ];

  it("renders anatomical canvas controls and layer toggles", () => {
    render(
      <AnatomyCanvasViewer
        moduleData={{ title: "Brachial Plexus Anatomy" }}
        layers={mockLayers}
        hotspots={mockHotspots}
      />,
    );

    expect(
      screen.getAllByText(/Brachial Plexus Anatomy/i)[0],
    ).toBeInTheDocument();
    expect(screen.getByText(/Anatomical Layers/i)).toBeInTheDocument();
    expect(screen.getByText(/Skeletal Framework/i)).toBeInTheDocument();
    expect(screen.getByText(/Neural Plexus/i)).toBeInTheDocument();
  });

  it("displays clinical significance section", () => {
    render(
      <AnatomyCanvasViewer
        moduleData={{ title: "Brachial Plexus Anatomy" }}
        layers={mockLayers}
        hotspots={mockHotspots}
      />,
    );

    expect(screen.getByText(/Clinical Significance/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Radial Nerve/i)[0]).toBeInTheDocument();
  });
});
