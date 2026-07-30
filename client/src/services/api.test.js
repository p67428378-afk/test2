import { describe, it, expect, vi } from "vitest";
import { getAnimals, getEnclosures, getMapData } from "./api";

vi.mock("axios", () => {
  return {
    default: {
      create: vi.fn(() => ({
        get: vi.fn((url) => {
          if (url === "/api/v1/animals") {
            return Promise.resolve({
              data: [
                {
                  id: "1",
                  name: "Simba",
                  species: "Lion",
                  status: "Active",
                  enclosure_id: "e1",
                },
              ],
            });
          }
          if (url === "/api/v1/enclosures") {
            return Promise.resolve({
              data: [
                { id: "e1", name: "Savannah", location_x: 50, location_y: 50 },
              ],
            });
          }
          if (url === "/api/v1/map") {
            return Promise.resolve({
              data: { enclosures: [], facilities: [], paths: [] },
            });
          }
          return Promise.reject(new Error("Not found"));
        }),
      })),
    },
  };
});

describe("API Service", () => {
  it("should export API functions", () => {
    expect(getAnimals).toBeTypeOf("function");
    expect(getEnclosures).toBeTypeOf("function");
    expect(getMapData).toBeTypeOf("function");
  });

  it("should fetch animals", async () => {
    const animals = await getAnimals();
    expect(animals).toBeInstanceOf(Array);
    expect(animals[0].name).toBe("Simba");
  });

  it("should fetch enclosures", async () => {
    const enclosures = await getEnclosures();
    expect(enclosures).toBeInstanceOf(Array);
    expect(enclosures[0].name).toBe("Savannah");
  });
});
