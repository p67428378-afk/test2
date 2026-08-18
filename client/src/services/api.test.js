import { describe, it, expect } from "vitest";
import * as apiServices from "./api";

describe("API Services Structural Integrity", () => {
  it("exports all expected API endpoints", () => {
    expect(typeof apiServices.getCategories).toBe("function");
    expect(typeof apiServices.createCategory).toBe("function");
    expect(typeof apiServices.getExpenses).toBe("function");
    expect(typeof apiServices.getExpenseById).toBe("function");
    expect(typeof apiServices.createExpense).toBe("function");
    expect(typeof apiServices.updateExpense).toBe("function");
    expect(typeof apiServices.deleteExpense).toBe("function");
    expect(typeof apiServices.getExpenseSummary).toBe("function");
  });
});
