import { describe, it, expect } from "vitest";
import api, {
  getPodcasts,
  getPodcastById,
  getPodcastEpisodes,
  getEpisodeById,
} from "./api";

describe("API Service Unit Tests", () => {
  it("exports all expected API query functions", () => {
    expect(typeof getPodcasts).toBe("function");
    expect(typeof getPodcastById).toBe("function");
    expect(typeof getPodcastEpisodes).toBe("function");
    expect(typeof getEpisodeById).toBe("function");
  });

  it("default export includes all endpoints", () => {
    expect(api.getPodcasts).toBe(getPodcasts);
    expect(api.getPodcastById).toBe(getPodcastById);
    expect(api.getPodcastEpisodes).toBe(getPodcastEpisodes);
    expect(api.getEpisodeById).toBe(getEpisodeById);
  });
});
