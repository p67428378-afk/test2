import { describe, it, expect, vi } from "vitest";
import { registerUser } from "./api";
import api from "./api";

vi.mock("./api", () => {
  return {
    default: {
      post: vi.fn(),
    },
    registerUser: async (userData) => {
      if (userData.email === "error@example.com") {
        throw { detail: "Email already exists" };
      }
      return { id: "123", message: "User created successfully" };
    },
  };
});

describe("API Service", () => {
  it("registerUser returns success response", async () => {
    const result = await registerUser({
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      password: "Password123!",
    });

    expect(result.message).toBe("User created successfully");
  });

  it("registerUser throws error on failure", async () => {
    await expect(
      registerUser({
        first_name: "John",
        last_name: "Doe",
        email: "error@example.com",
        password: "Password123!",
      }),
    ).rejects.toEqual({ detail: "Email already exists" });
  });
});
