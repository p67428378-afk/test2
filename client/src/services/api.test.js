import { describe, it, expect } from "vitest";
import {
  authService,
  noteService,
  reviewService,
  searchService,
  tagService,
} from "./api.js";

describe("API Services", () => {
  it("exports required authentication service methods", () => {
    expect(typeof authService.login).toBe("function");
    expect(typeof authService.register).toBe("function");
    expect(typeof authService.getMe).toBe("function");
    expect(typeof authService.logout).toBe("function");
  });

  it("exports required note service methods", () => {
    expect(typeof noteService.createNote).toBe("function");
    expect(typeof noteService.getNotes).toBe("function");
    expect(typeof noteService.getNoteById).toBe("function");
    expect(typeof noteService.approveNote).toBe("function");
    expect(typeof noteService.rejectNote).toBe("function");
  });

  it("exports required review and search service methods", () => {
    expect(typeof reviewService.getQueue).toBe("function");
    expect(typeof searchService.search).toBe("function");
    expect(typeof tagService.getTags).toBe("function");
  });
});
